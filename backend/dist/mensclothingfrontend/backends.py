from django.contrib.auth.backends import ModelBackend
from .models import User

class EmailOrPhoneBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        identifier = username  # Django passes identifier as "username"

        try:
            if "@" in identifier:
                user = User.objects.get(email=identifier)
            else:
                user = User.objects.get(phone_number=identifier)
        except User.DoesNotExist:
            return None

        if user.check_password(password):
            return user

        return None
