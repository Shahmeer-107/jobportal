from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth import authenticate
from django.utils import timezone
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
import random

from .models import User
from .serializers import UserSerializer, RegisterSerializer

# Swagger imports
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import serializers


# Swagger input serializers
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()
    new_password = serializers.CharField()


class RefreshTokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()


# Views
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        otp = str(random.randint(100000, 999999))
        user.otp = otp
        user.otp_created_at = timezone.now()
        user.save()

        send_mail(
            subject='Your OTP Code',
            message=f'Your OTP is: {otp}',
            from_email='yourgmail@gmail.com',
            recipient_list=[user.email],
        )


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(request_body=OTPVerifySerializer)
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        if user.otp != otp:
            return Response({"error": "Invalid OTP"}, status=400)

        if user.otp_created_at and (timezone.now() - user.otp_created_at).seconds > 600:
            return Response({"error": "OTP expired"}, status=400)

        user.is_active = True
        user.otp = None
        user.otp_created_at = None
        user.save()

        return Response({"message": "Email verified successfully!"}, status=200)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(request_body=LoginSerializer)
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"detail": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)

        if user is not None and user.is_active:
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            })

        return Response({"detail": "Invalid credentials or inactive account"}, status=status.HTTP_401_UNAUTHORIZED)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(request_body=RefreshTokenSerializer)
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
        except KeyError:
            return Response({"detail": "Refresh token missing."}, status=status.HTTP_400_BAD_REQUEST)
        except TokenError:
            return Response({"detail": "Invalid or expired refresh token."}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(request_body=ForgotPasswordSerializer)
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            otp = str(random.randint(100000, 999999))
            user.otp = otp
            user.otp_created_at = timezone.now()
            user.save()

            send_mail(
                'Password Reset OTP',
                f'Your OTP to reset password is: {otp}',
                'noreply@jobboard.com',
                [user.email],
                fail_silently=False
            )
            return Response({'message': 'OTP sent to email'}, status=200)
        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=404)

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(request_body=ResetPasswordSerializer)
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')

        try:
            user = User.objects.get(email=email)

            if user.otp != otp:
                print("OTP:", user.otp)
                return Response({'error': 'Invalid OTP'}, status=400)

            if user.otp_created_at and (timezone.now() - user.otp_created_at).seconds > 600:
                return Response({'error': 'OTP expired'}, status=400)

            # ✅ Validate password
            try:
                validate_password(new_password, user)
            except DjangoValidationError as e:
                return Response({'password_errors': e.messages}, status=400)

            # ✅ Save new password
            user.set_password(new_password)
            user.otp = None
            user.otp_created_at = None
            user.save()

            return Response({'message': 'Password reset successful'}, status=200)

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
