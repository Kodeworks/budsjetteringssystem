from rest_framework import serializers, relations

from .utils import ErrorType


class EnumField(serializers.ChoiceField):
    def __init__(self, enum_class, *args, **kwargs):
        self.enum_class = enum_class
        choices = [(item.value, item.value) for item in enum_class]
        return super().__init__(*args, choices=choices, **kwargs)

    def to_representation(self, instance):
        if isinstance(instance, self.enum_class):
            return super().to_representation(instance.value)
        else:
            return super().to_representation(instance)


class IDManyRelatedField(relations.ManyRelatedField):
    """
    Many-to-many field that appends an '_ids' suffix to the field name.
    """
    field_name_suffix = '_ids'

    def bind(self, field_name, parent):
        """Make sure the data is saved to the field name, without the suffix."""
        self.source = field_name[:-len(self.field_name_suffix)]
        super().bind(field_name, parent)


class IDPrimaryKeyRelatedField(relations.PrimaryKeyRelatedField):
    """
    Foreign key field that appends an '_id' suffix to the field name.
    """
    many_related_field_class = IDManyRelatedField
    field_name_suffix = '_id'

    def bind(self, field_name, parent):
        if field_name:
            self.source = field_name[:-len(self.field_name_suffix)]
        super().bind(field_name, parent)


class AppendIDMixin:
    """
    Override the standard relation fields to add a '_id' suffix
    to the field name.
    """
    serializer_related_field = IDPrimaryKeyRelatedField

    def get_fields(self):
        fields = super().get_fields()
        # Create a set of fields to use, and make sure it's the
        # same type of object as `fields`.
        new_fields = type(fields)()

        for field_name, field in fields.items():
            if getattr(field, 'field_name_suffix', None):
                field_name += field.field_name_suffix
            new_fields[field_name] = field

        return new_fields


class LiquidatorSerializer(AppendIDMixin, serializers.ModelSerializer):
    """
    A serializer that provides features that are useful for most
    serializers in this project. Should be used as the default
    serializer superclass.
    """
    pass


class DateSerializer(serializers.Serializer):
    """
    A serializer that deserializes a date.

    Useful as a request serializer, or to get a python
    date from a date string.
    """
    date = serializers.DateField(help_text='The date')


class DateRangeSerializer(serializers.Serializer):
    """A serializer that deserializes a date range."""
    start_date = serializers.DateField(help_text='The first date of the range (inclusive)')
    end_date = serializers.DateField(help_text='The last day of the range (inclusive)')


class ErrorEntrySerializer(serializers.Serializer):
    code = serializers.CharField(help_text='The error code')
    detail = serializers.CharField(help_text='A description of the error')


class ErrorSerializer(serializers.Serializer):
    error_type = EnumField(ErrorType, help_text='The type of error')
    errors = ErrorEntrySerializer(many=True, help_text='Non-field errors')
    field_errors = serializers.DictField(
        child=serializers.ListField(
            child=ErrorEntrySerializer()
        ),
        help_text='Errors corresponding to form fields',
    )
