"""The roles a user can have in a company"""

"""Can only view data"""
REPORTER = "RE"

"""Can edit transactions, but not the company, or manage users"""
USER = "US"

"""Can do everything"""
OWNER = "OW"


choices = [
    (REPORTER, 'Reporter'),
    (USER, 'User'),
    (OWNER, 'Owner'),
]


def is_equivalent(role1, role2):
    """Check if `role1` has all permissions `role2` has."""
    return (role1 == OWNER) or (role1 == USER and role2 != OWNER) or (role1 == REPORTER and role2 == REPORTER)


def get_name(role):
    """Get string name of role"""
    for choice in choices:
        if role == choice[0]:
            return choice[1]

    return None


def get_role(role_name):
    """Get role from string name or short name."""
    for (role, name) in choices:
        if role_name in [role, name]:
            return role

    return None
