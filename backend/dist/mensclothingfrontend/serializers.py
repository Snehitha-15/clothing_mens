import random
from rest_framework import serializers
from .models import User, Category, Product, Banner, WishlistItem, Cart, CartItem, Address, Order, OrderItem
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class SignupSerializer(serializers.Serializer):
    # required for identifying which step is happening
    step = serializers.CharField()

    # STEP 1 – email OTP
    email = serializers.EmailField(required=False)

    # STEP 2 – email verification
    email_otp = serializers.CharField(required=False)

    # STEP 3 – phone OTP
    phone_number = serializers.CharField(required=False)

    # STEP 4 – phone verification
    phone_otp = serializers.CharField(required=False)

    # STEP 5 – final password setup
    username = serializers.CharField(required=False)
    password = serializers.CharField(required=False)
    password2 = serializers.CharField(required=False)

    # used in all steps after step 1
    signup_token = serializers.CharField(required=False)

    # Generate random 6-digit OTP
    def generate_otp(self):
        return str(random.randint(100000, 999999))

    # Custom validation to ensure correct fields for each step
    def validate(self, data):
        step = data.get("step")

        # ------- Step 1: email -------
        if step == "email":
            if not data.get("email"):
                raise serializers.ValidationError({"email": "Email is required"})

        # ------- Step 2: email verification -------
        elif step == "email_verification":
            if not data.get("signup_token"):
                raise serializers.ValidationError({"signup_token": "Signup token required"})
            if not data.get("email_otp"):
                raise serializers.ValidationError({"email_otp": "Email OTP is required"})

        # ------- Step 3: phone number (send OTP) -------
        elif step == "phone_number":
            if not data.get("signup_token"):
                raise serializers.ValidationError({"signup_token": "Signup token required"})
            phone = data.get("phone_number")
            if not phone or phone.strip() == "":
                raise serializers.ValidationError({"phone_number": "Valid phone number required"})

        # ------- Step 4: verify phone -------
        elif step == "phone_verification":
            if not data.get("signup_token"):
                raise serializers.ValidationError({"signup_token": "Signup token required"})
            if not data.get("phone_otp"):
                raise serializers.ValidationError({"phone_otp": "Phone OTP required"})

        # ------- Step 5: password setup -------
        elif step == "password":
            if not data.get("signup_token"):
                raise serializers.ValidationError({"signup_token": "Signup token required"})
            if not data.get("username"):
                raise serializers.ValidationError({"username": "Username required"})
            if not data.get("password"):
                raise serializers.ValidationError({"password": "Password required"})
            if data.get("password") != data.get("password2"):
                raise serializers.ValidationError({"password": "Passwords do not match"})

        else:
            raise serializers.ValidationError({"step": "Invalid step"})

        return data
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
        read_only_fields = ('user', 'total', 'paid', 'payment_reference', 'status', 'created_at')
        
class RecommendedProductSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.name', read_only=True)
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = Product
        fields = ('id','name','description','price','image','category','stock')
