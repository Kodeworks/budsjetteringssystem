from rest_framework_simplejwt.tokens import RefreshToken


class UserToken:
    def __init__(self, user):
        self.user = user
        self.token = RefreshToken.for_user(user)
        self.refresh = str(self.token)
        self.access = str(self.token.access_token)
