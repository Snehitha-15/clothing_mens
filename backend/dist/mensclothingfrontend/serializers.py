from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    
    def validate(self, data):
        email = data.get("email", None)
        password = data.get("password", None)

        user = authenticate(username=email, password=password)  # ✅ use username param
        if user is None:
            raise serializers.ValidationError("Invalid credentials")

        data["user"] = user
        return data
