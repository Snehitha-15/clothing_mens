import random
from rest_framework import serializers
from .models import User, Category, Product, Banner, WishlistItem, Cart, CartItem, Address, Order, OrderItem
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class SignupSerializer(serializers.Serializer):
    step = serializers.CharField()

    # step 1
    email = serializers.EmailField(required=False)

    # step 2
    email_otp = serializers.CharField(required=False)

    # step 3
    phone_number = serializers.CharField(required=False)

    # step 4
    phone_otp = serializers.CharField(required=False)

    # step 5
    username = serializers.CharField(required=False)
    password = serializers.CharField(required=False)
    password2 = serializers.CharField(required=False)

    signup_token = serializers.CharField(required=False)

    def generate_otp(self):
        return str(random.randint(100000, 999999))

    def create(self, validated_data):
        step = validated_data["step"]

        if step == "email":
            email = validated_data["email"]

            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError("Email already exists")

            user = User.objects.create(
                email=email,
                email_otp=self.generate_otp(),
                otp_created_at=timezone.now(),
            )

            # TODO: send email otp

            return {"signup_token": str(user.signup_token)}

        if step == "email_verification":
            signup_token = validated_data["signup_token"]
            user = User.objects.get(signup_token=signup_token)

            if user.email_otp != validated_data["email_otp"]:
                raise serializers.ValidationError("Invalid OTP")

            if user.is_otp_expired():
                raise serializers.ValidationError("OTP expired")

            user.email_verified = True
            user.email_otp = None
            user.save()

            return {"detail": "Email verified"}
        
        if step == "phone_number":
            signup_token = validated_data["signup_token"]
            user = User.objects.get(signup_token=signup_token)

            phone = validated_data["phone_number"]
            if User.objects.filter(phone_number=phone).exists():
                raise serializers.ValidationError("Phone already exists")

            user.phone_number = phone
            user.phone_otp = self.generate_otp()
            user.otp_created_at = timezone.now()
            user.save()

            # TODO: send sms otp

            return {"detail": "OTP sent to phone"}
        if step == "phone_verification":
            signup_token = validated_data["signup_token"]
            user = User.objects.get(signup_token=signup_token)

            if user.phone_otp != validated_data["phone_otp"]:
                raise serializers.ValidationError("Invalid OTP")

            if user.is_otp_expired():
                raise serializers.ValidationError("OTP expired")

            user.phone_verified = True
            user.phone_otp = None
            user.save()

            return {"detail": "Phone verified"}

        if step == "password":
            signup_token = validated_data["signup_token"]
            user = User.objects.get(signup_token=signup_token)

            if validated_data["password"] != validated_data["password2"]:
                raise serializers.ValidationError("Passwords do not match")

            user.username = validated_data["username"]
            user.set_password(validated_data["password"])
            user.save()

            return {"detail": "Signup completed"}

        return {"detail": "Invalid step"}
    
class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField()

class ResetPasswordSerializer(serializers.Serializer):
    step = serializers.CharField()

    # step 1: send otp
    identifier = serializers.CharField(required=False)  # email or phone

    # step 2: verify otp
    otp = serializers.CharField(required=False)

    # step 3: set password
    reset_token = serializers.CharField(required=False)
    password = serializers.CharField(required=False)
    password2 = serializers.CharField(required=False)

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'subcategories']


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(read_only=True, slug_field='name')

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'category', 'stock']

class BannerSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    class Meta:
        model = Banner
        fields = ('id', 'title', 'image', 'link', 'order', 'active')

class WishlistSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    class Meta:
        model = WishlistItem
        fields = ('id', 'product', 'created_at')

    def get_product(self, obj):
        from .serializers import ProductSerializer  # avoid circular import; or import at top
        return ProductSerializer(obj.product, context=self.context).data

class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'quantity', 'subtotal')

    def get_product(self, obj):
        from .serializers import ProductSerializer
        return ProductSerializer(obj.product, context=self.context).data

    def get_subtotal(self, obj):
        return obj.subtotal()

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ('id', 'items', 'total')

    def get_total(self, obj):
        return obj.total_price()


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

class OrderItemSerializer(serializers.ModelSerializer):
    # flatten product fields
    name = serializers.CharField(source="product.name", read_only=True)
    description = serializers.CharField(source="product.description", read_only=True)
    image = serializers.ImageField(source="product.image", read_only=True)
    category = serializers.CharField(source="product.category.name", read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'name',
            'description',
            'price',
            'image',
            'category',
            'quantity'
        ]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    address = AddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'user', 'address', 'total', 'paid', 'payment_method', 'payment_reference', 'created_at', 'items')
        read_only_fields = ('user', 'total', 'paid', 'payment_reference', 'created_at')