from rest_framework import validators


class IDForeignKeyUniqueForMixin:
    """
    Handles UniqueFor<range> validation on fields that are given a
    '_id' suffix in the serializer.
    """
    field_suffix = '_id'

    def __init__(self, *args, **kwargs):
        if 'field_suffix' in kwargs:
            self.field_suffix = kwargs['field_suffix']

        super().__init__(*args, **kwargs)

    def set_context(self, serializer):
        # Temporarily change the field to account for the suffix
        old_field = self.field
        self.field = f'{self.field}{self.field_suffix}'
        super().set_context(serializer)
        self.field = old_field


class IDForeignKeyUniqueForDateValidator(IDForeignKeyUniqueForMixin, validators.UniqueForDateValidator):
    pass


class IDForeignKeyUniqueForMonthValidator(IDForeignKeyUniqueForMixin, validators.UniqueForMonthValidator):
    pass


class IDForeignKeyUniqueForYearValidator(IDForeignKeyUniqueForMixin, validators.UniqueForYearValidator):
    pass
