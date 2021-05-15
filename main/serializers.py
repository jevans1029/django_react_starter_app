from django.db import transaction
from rest_framework import serializers
from main.models import *


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"
