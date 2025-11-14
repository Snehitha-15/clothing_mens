from rest_framework import serializers
from .models import User, Category, Product
from django.contrib.auth import authenticate

def validate_phone(value):
    if not value.isdigit() or len(value) != 10:
        raise serializers.ValidationError("Phone number must be exactly 10 digits.")
    return value

class SendOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(validators=[validate_phone])

class VerifyOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(validators=[validate_phone])
    otp = serializers.CharField()
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'category']