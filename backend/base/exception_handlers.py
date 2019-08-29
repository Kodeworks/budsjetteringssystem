import logging
from django.http.response import Http404
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError, ErrorDetail
from rest_framework_simplejwt.exceptions import InvalidToken

from .utils import ErrorType, ErrorEntry, Error
from .serializers import ErrorSerializer

logger = logging.getLogger(__name__)


def server_error():
    """Return a standard 500 response"""
    serializer = ErrorSerializer(
        Error(
            errors=[{'code': 'server_error', 'detail': 'Internal server error.'}],
        )
    )

    return Response(data=serializer.data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def custom_exception_handler(exc, context):
    """
    A custom exception handler that makes sure errors are returned with a fixed format.

    Django, django-rest-framework, and the jwt framework all throw exceptions in slightly
    different ways. This has to be caught and each type of exception has to be converted
    to the common error format.

    This function is called whenever there is an uncaught exception in the code. It doesn't
    handle responses with error codes.

    As this is the last line of defense, it will check every possibility, and log all errors,
    so that they can be easily found and fixed.
    """
    # Let django-rest-framework do its handling. This might return None
    # The response variable will be ignored at the end, so don't set the
    # status code or data directly on that.
    response = exception_handler(exc, context)

    # Define variables that can be modified during handling, and will be
    # converted to a Response at the end. We default to status code 400.
    status_code = response.status_code if response else '400'
    error = Error()

    try:
        if isinstance(exc, ValidationError):
            # It's a rest framework ValidationError
            error.error_type = ErrorType.FORM_ERROR

            if isinstance(exc.detail, dict):
                error.errors = [ErrorEntry.factory(obj)
                                for obj in exc.detail.pop('non_field_errors', [])]

                error.field_errors = {key: [ErrorEntry.factory(obj)
                                            for obj in exc.detail[key]]
                                      for key in exc.detail}
            elif isinstance(exc.detail, list):
                error.errors = [ErrorEntry.factory(obj) for obj in exc.detail]
            else:
                logger.error('Unable to parse detail attribute (%s) on exception %s', exc.detail, repr(exc))
                return server_error()
        elif isinstance(exc, InvalidToken):
            # It's an error from simplejwt
            error.error_type = ErrorType.JWT_ERROR

            if isinstance(exc.detail, dict):
                error.errors = [ErrorEntry.factory(exc.detail['detail'])]
            else:
                logger.error('Unable to parse detail attribute (%s) on exception %s', exc.detail, repr(exc))
                return server_error()
        elif isinstance(exc, DjangoValidationError):
            # It's a django ValidationError
            error.error_type = ErrorType.FORM_ERROR
            status_code = status.HTTP_400_BAD_REQUEST

            # The ValidationError might, or might not, have the code attribute set.
            # It might also be None
            error_code = exc.code if hasattr(exc, 'code') and exc.code else 'invalid'

            try:
                # Validation errors are usually dicts with the field name as the key
                message_dict = exc.message_dict
                error.errors = [ErrorEntry(code=error_code, detail=message)
                                for message in message_dict.pop('non_field_errors', [])]
                error.field_errors = {key: [ErrorEntry(code=error_code, detail=message)
                                            for message in messages]
                                      for key, messages in message_dict.items()}
            except AttributeError:
                # If an argument with an invalid format is used in a queryset `filter()`
                # we only get a list of errors, not a dict.
                error.errors = [ErrorEntry(code=error_code, detail=message)
                                for message in exc]
        elif isinstance(exc, Http404):
            # It's a Http404 exception (probably from `get_or_404`)
            status_code = status.HTTP_404_NOT_FOUND
            error.errors = [ErrorEntry(detail=str(exc), code='not_found')]
        elif hasattr(exc, 'detail'):
            if isinstance(exc.detail, ErrorDetail):
                error.errors = [ErrorEntry.factory(exc.detail)]
            elif isinstance(exc.detail, list) and all(isinstance(detail, ErrorDetail)
                                                      for detail in exc.detail):
                error.errors = [ErrorEntry.factory(item)
                                for item in exc.detail]
            else:
                logger.error('Unable to parse detail attribute (%s) on exception %s', exc.detail, repr(exc))
                return server_error()
        else:
            # It's an unknown exception, so we don't know how to get the data from it.
            # Return a 500, log the data, and hope someone sees it.
            logger.error('Unable to handle exception: %s', repr(exc))
            return server_error()
    except Exception as e:
        # There was an exception while processing the exception.
        # Return a 500, log the data, and hope someone sees it.
        logger.error('Exception (%s) occurred during handling of exception: %s', repr(e), repr(exc))
        return server_error()

    # Convert the Error object into a JSON response, and return it
    serializer = ErrorSerializer(error)
    return Response(data=serializer.data, status=status_code)
