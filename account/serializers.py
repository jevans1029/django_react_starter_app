import traceback

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers
from django.contrib.auth import authenticate, login
from rest_framework.validators import UniqueValidator
from main.models import *

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=200)
    password= serializers.CharField(max_length=100)

    def validate(self, data):
        request = self.context.get("request")

        user = authenticate(request, username=data["email"],
                            password=data["password"])
        if user is None:
            raise serializers.ValidationError("Invalid credentials.")
        self.user = user
        return data

class SignupSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=200,)
                                   # validators=[UniqueValidator(queryset=User.objects.all())])
    password= serializers.CharField(max_length=100)
    confirmpassword= serializers.CharField(max_length=100)


    def validate(self, data):
        if User.objects.filter(email=data["email"]).count()>0:
            raise serializers.ValidationError("This Email is already taken.")
        if data["password"] != data["confirmpassword"]:
            raise serializers.ValidationError("Passwords are not the same")
        if len(data["password"]) < 8:
            raise serializers.ValidationError("Your password must be at least 8 characters long.")
        return data

    def create(self, validated_data):
        return User.objects.create_user(validated_data["email"], email=validated_data["email"], password=validated_data["password"])

class PasswordChangeSerializer(serializers.Serializer):
    password= serializers.CharField(max_length=100)
    confirmpassword= serializers.CharField(max_length=100)

    def validate(self, data):
        if data["password"] != data["confirmpassword"]:
            raise serializers.ValidationError("Passwords are not the same")
        if len(data["password"]) <8:
            raise serializers.ValidationError("Passwords must be 8 or more characters long.")
        return data


class PasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=200)

    def validate(self, data):
        if User.objects.filter(email=data["email"]).count() != 1:
            raise serializers.ValidationError("User does not exist")
        return data

class PasswordResetTokenSerializer(serializers.Serializer):
    uidb = serializers.CharField(max_length=20)
    token = serializers.CharField(max_length=50)

    def validate(self, data):
        try:
            uid = force_text(urlsafe_base64_decode(data["uidb"]))
            user = User.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            traceback.print_exc()
            raise serializers.ValidationError("User not found")
        if user is not None and PasswordResetTokenGenerator().check_token(user, data["token"]):
            data["user"] = user
            self.token_user = user
            return data
        else:
            print("invalid")
            raise serializers.ValidationError("Token is Invalid")



