from drf_yasg.inspectors import SwaggerAutoSchema
from drf_yasg.openapi import Parameter


class LiquidatorAutoSchema(SwaggerAutoSchema):
    """
    The default AutoSchema class for the Liquidator project.

    An AutoSchema extracts info about views and generates a Swagger API.
    This class adds parameters and responses that are used for most
    Liquidator views.

    If a view needs to add or modify Swagger attributes it should use
    the decorator `drf_yasg.utils.swagger_auto_schema`. If this class
    isn't needed at all, set `auto_schema=drf_yasg.inspectors.SwaggerAutoSchema`.

    One feature of this class is the improved handling of query parameters. If the
    `lookup_query_field`, `lookup_arg_field` or `lookup_field` is set it is added to
    Swagger as a query parameter. If the `request_serializer_class` is set it overrides
    the default query parameters.

    The `company_id` field is added to all `GET` and `DELETE` endpoints, unless explicitly
    defined on the view.

    See [the drf-yasg docs](https://drf-yasg.readthedocs.io/en/stable/custom_spec.html)
    for details.
    """

    def get_help_text(self, field_name):
        """Helper function that returns the help text for a field, or None if there is no help text."""
        try:
            if self.view.serializer_class:
                serializer = self.view.serializer_class()

                if field_name in serializer.fields and serializer.fields[field_name].help_text:
                    return serializer.fields[field_name].help_text

        except AttributeError:
            pass

        return None

    def get_company_id_parameter(self):
        """
        Helper function that creates a `Parameter` for the company id.

        Returns None if the view doesn't use company_id (has set `company_id_field' to None`).
        """
        company_id_field = self.view.company_id_field
        if company_id_field:
            return Parameter(
                name=company_id_field,
                in_='query',
                type='integer',
                description='The ID of the company to manage',
                required=True,
            )

        return None

    def get_lookup_parameter(self):
        """Helper function that creates a `Parameter` for the lookup parameter."""
        if not getattr(self.view, 'request_serializer_class', None):
            for field in ['lookup_query_field', 'lookup_arg_field', 'lookup_field']:
                lookup_field = getattr(self.view, field, None)
                if lookup_field:
                    description = self.get_help_text(lookup_field)

                    if not description:
                        if lookup_field == 'id':
                            description = 'The ID of the object'
                        else:
                            description = 'The lookup field'

                    return Parameter(
                        name=lookup_field,
                        in_='query',
                        type='string',
                        required=True,
                        description=description,
                    )

        return None

    def add_parameters(self, parameters, new_parameters):
        """
        Helper function that merges two lists of parameters, avoiding duplicates.

        Entries in `new_parameters` can be `Parameter` objects, or None (which is ignored).
        """
        for new in new_parameters:
            if new:
                for parameter in parameters:
                    if parameter.name == new.name:
                        break
                else:
                    parameters.append(new)

    def get_query_parameters(self):
        """Get the parameters used when querying the endpoint."""
        parameters = super().get_query_parameters()

        if self.method in ['GET', 'DELETE']:
            self.add_parameters(parameters, [
                self.get_company_id_parameter(),
                self.get_lookup_parameter(),
            ])

        return parameters

    def get_query_serializer(self):
        """Get the serializer used to deserialize query parameters."""
        serializer = super().get_query_serializer()
        serializer_class = getattr(self.view, 'request_serializer_class', None)

        if not serializer and serializer_class:
            serializer = serializer_class()

        return serializer

    def get_default_responses(self):
        """Get the default responses."""
        responses = super().get_default_responses()

        responses.update({
            '400': 'Invalid arguments',
            '401': 'Not authenticated',
            '403': "You don't have access to do this operation on this company",
        })

        return responses
