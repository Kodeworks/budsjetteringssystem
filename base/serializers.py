from rest_framework import serializers, relations


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
    pass


class DateSerializer(serializers.Serializer):
    date = serializers.DateField()


class DateRangeSerializer(serializers.Serializer):
    start_date = serializers.DateField()
    end_date = serializers.DateField()
