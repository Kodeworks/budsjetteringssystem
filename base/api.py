from drf_yasg.inspectors import SwaggerAutoSchema
from drf_yasg.openapi import Parameter, Response


class LiquidatorAutoSchema(SwaggerAutoSchema):
    def get_query_parameters(self):
        parameters = super().get_query_parameters()

        if self.method in ['GET', 'DELETE']:
            company_id_field = self.view.company_id_field
            if company_id_field:
                for parameter in parameters:
                    if parameter.name == company_id_field:
                        break
                else:
                    parameters.append(
                        Parameter(
                            name=company_id_field,
                            in_='query',
                            type='integer',
                            description='The ID of the company to manage',
                            required=True,
                        )
                    )

            if not getattr(self.view, 'request_serializer_class', None):
                for field in ['lookup_query_field', 'lookup_arg_field', 'lookup_field']:
                    lookup_field = getattr(self.view, field, None)
                    if lookup_field:
                        for parameter in parameters:
                            if parameter.name == lookup_field:
                                break
                        else:
                            parameters.append(
                                Parameter(
                                    name=lookup_field,
                                    in_='query',
                                    type='string',
                                    required=True,
                                )
                            )
                        break

        return parameters

    def get_query_serializer(self):
        serializer = super().get_query_serializer()
        serializer_class = getattr(self.view, 'request_serializer_class', None)

        if not serializer and serializer_class:
            serializer = serializer_class()

        return serializer

    def get_responses(self):
        responses = super().get_responses()

        if '401' not in responses:
            responses['401'] = Response("Not authenticated")

        if '403' not in responses:
            responses['403'] = Response("You don't have access to do this operation on this company")

        return responses
