from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ParseError


class SingleObjectQueryOrDataMixin:
    """Allows pk for a object to be sent as a query or POST parameter, instead of through the URL."""
    lookup_query_field = None
    lookup_data_field = None
    lookup_arg_field = None

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())

        if self.request.method == 'GET':
            field = self.lookup_query_field or self.lookup_arg_field or self.lookup_field
            data = self.request.query_params
        else:
            field = self.lookup_data_field or self.lookup_arg_field or self.lookup_field
            data = self.request.data

        if field not in data:
            raise ParseError(f'Missing argument "{field}"')
        value = data[field]

        obj = get_object_or_404(queryset, **{self.lookup_field: value})
        self.check_object_permissions(self.request, obj)
        return obj
