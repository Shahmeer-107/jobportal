from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from rest_framework import generics, status,permissions
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer , RegisterSerializer
from .tokens import email_token_generator
from django.utils import timezone
import random
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken , TokenError
from django.contrib.auth import authenticate




# class RegisterView(generics.CreateAPIView):
#     serializer_class = RegisterSerializer

#     def perform_create(self, serializer):
#         user = serializer.save()
#         token = email_token_generator.make_token(user)
#         uid = user.pk
#         domain = get_current_site(self.request).domain
#         link = f"http://{domain}/api/accounts/verify-email/{uid}/{token}/"
#         send_mail(
#             subject='Verify your email',
#             message=f'Click the link to verify your account: {link}',
#             from_email='noreply@jobboard.com',
#             recipient_list=[user.email],
#         )

# class VerifyEmailView(generics.GenericAPIView):
#     def get(self, request, uid, token):
#         try:
#             user = User.objects.get(pk=uid)
#             if email_token_generator.check_token(user, token):
#                 user.is_active = True
#                 user.save()
#                 return Response({'message': 'Email verified'}, status=status.HTTP_200_OK)
#             return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
#         except User.DoesNotExist:
#             return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)




class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
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

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        if user.otp != otp:
            return Response({"error": "Invalid OTP"}, status=400)

        # Optional: check for expiration (e.g., 10 minutes)
        if user.otp_created_at and (timezone.now() - user.otp_created_at).seconds > 600:
            return Response({"error": "OTP expired"}, status=400)

        user.is_active = True
        user.otp = None
        user.otp_created_at = None
        user.save()

        return Response({"message": "Email verified successfully!"}, status=200)





class LoginView(APIView):
    permission_classes = [permissions.AllowAny]  # Allow login without auth

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
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            otp = str(random.randint(100000, 999999))
            user.otp = otp
            user.otp_created_at = timezone.now()
            user.save()

            # Send email
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

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')

        try:
            user = User.objects.get(email=email)
            if user.otp != otp:
                return Response({'error': 'Invalid OTP'}, status=400)

            # Check expiry (10 min)
            if user.otp_created_at and (timezone.now() - user.otp_created_at).seconds > 600:
                return Response({'error': 'OTP expired'}, status=400)

            user.set_password(new_password)
            user.otp = None
            user.otp_created_at = None
            user.save()

            return Response({'message': 'Password reset successful'}, status=200)

        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
