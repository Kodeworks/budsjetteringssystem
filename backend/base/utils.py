from enum import Enum
from typing import List
from dataclasses import dataclass, field
from rest_framework.exceptions import ErrorDetail


class ErrorType(Enum):
    ERROR = 'error'
    FORM_ERROR = 'form_error'
    JWT_ERROR = 'jwt_error'


@dataclass
class ErrorEntry:
    code: str
    detail: str

    @classmethod
    def factory(self, obj):
        if isinstance(obj, ErrorDetail):
            return ErrorEntry(code=obj.code, detail=str(obj))
        elif isinstance(obj, dict):
            return ErrorEntry(code=obj['code'], detail=obj['detail'])
        else:
            raise TypeError('obj should be a ErrorDetail or a dict')


@dataclass
class Error:
    error_type: ErrorType = ErrorType.ERROR
    errors: List[ErrorEntry] = field(default_factory=list)
    field_errors: dict = field(default_factory=dict)
