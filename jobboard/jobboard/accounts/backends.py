from django.contrib.auth.backends import ModelBackend
from accounts.models import User

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        print("🔍 Authenticating with:", username, password)
        email = username or kwargs.get('email')  # fallback to username

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
