from rest_framework import mixins, generics, permissions
from rest_framework.exceptions import PermissionDenied, ParseError

from custom_auth import roles
from .mixins import SingleObjectQueryOrDataMixin


class CompanyAccessView(generics.GenericAPIView):
    """
    Checks that the user has access to the the requested operation on/for a company.

    The role required to perform an action is given by the `company_access` attribute.
    The role is set for each type of HTTP method. This can be overwritten in subclasses.
    """
    permission_classes = (permissions.IsAuthenticated,)
    company_id_field = 'company_id'
    company_access = {
        'GET': roles.REPORTER,
        'POST': roles.USER,
        'PUT': roles.USER,
        'DELETE': roles.USER,
    }
    permissions = {}

    def get_permissions(self):
        """
        Get the permissions given by `permission_classes`,
        unless overriden in `permissions` for the current method.
        """
        if self.request.method in self.permissions:
            permissions = self.permissions[self.request.method]
            if permissions:
                permissions = [permission() for permission in permissions]
                return permissions
            else:
                return []
        else:
            return super().get_permissions()

    def get_company_access(self):
        """
        Return the roles required for the different HTTP methods.

        If a subclass redifines `company_access` it is merged with
        `CompanyAccessView.company_access`.
        """
        return {
            **CompanyAccessView.company_access,
            **self.company_access,
        }

    def get_data(self, request=None):
        """Get the data/parameters for the request."""
        # Merge POST and query data. Query data is always returned as a list,
        # so if it's only one element we take it out of the list
        if not request:
            request = self.request

        request.data.update({k: v[0] if len(v) == 1 else v for k, v in request.query_params.lists()})
        return request.data

    def get_company_id(self):
        """
        Get the ID of the current company.

        The ID is passed in the field given by `company_id_field`
        in either query or post data, depending on the type of request.

        If no ID is passed None is returned.
        """
        data = self.get_data()

        if self.company_id_field in data:
            return data[self.company_id_field]
        else:
            return None

    def check_company_role(self, request, *args, **kwargs):
        """Check that the user has permission to do this action on the current company."""
        company_id = self.get_company_id()
        required_role = self.get_company_access()[request.method]

        if required_role and not request.user.has_role(company_id, required_role):
            raise PermissionDenied("You don't have access to do this operation on this company")

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_company_role(request, *args, **kwargs)


class RetrieveView(SingleObjectQueryOrDataMixin, mixins.RetrieveModelMixin, CompanyAccessView):
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class RetrieveCreateUpdateDestroyView(SingleObjectQueryOrDataMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin,
                                      mixins.UpdateModelMixin, mixins.DestroyModelMixin, CompanyAccessView):
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class ListView(mixins.ListModelMixin, CompanyAccessView):
    def get(self, *args, **kwargs):
        return self.list(*args, **kwargs)


class ByDateRangeView(ListView):
    start_date_arg = 'start_date'
    end_date_arg = 'end_date'
    date_field = 'date'

    def get_queryset(self):
        queryset = super().get_queryset()
        data = self.get_data()

        try:
            start_date = data[self.start_date_arg]
            end_date = data[self.end_date_arg]
        except KeyError:
            raise ParseError('You must pass start_date and end_date')

        # Filter objects between these dates, inclusive
        return queryset.filter(**{
            f'{self.date_field}__gte': start_date,
            f'{self.date_field}__lte': end_date,
        })
