from rest_framework import serializers
from .models import User
from rest_framework import generics, permissions
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from applicants.serializers import ApplicationSerializer, ApplicantApplicationSummarySerializer
from applicants.models import Application

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'name', 'role', 'password']

    def validate_password(self, value):
        try:
            validate_password(value, self.instance)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    applications = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role','applications']

    def get_applications(self, obj):
        if obj.role == 'applicant':
            apps = Application.objects.filter(applicant=obj)
            return ApplicantApplicationSummarySerializer(apps, many=True).data

        # return []



class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)
    # confirm_password = serializers.CharField(write_only=True)

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    # def validate(self, data):
    #     if data['password'] != data['confirm_password']:
    #         raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
    #     return data