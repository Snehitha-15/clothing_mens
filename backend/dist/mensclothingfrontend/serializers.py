from rest_framework import serializers
from .models import User, SignupSession, Category, Product, Banner, WishlistItem, Cart, CartItem, Address, Order, OrderItem
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()

class SignupSerializer(serializers.Serializer):
    step = serializers.CharField()

    # step 1
    email = serializers.EmailField(required=False)

    # step 2
    email_otp = serializers.CharField(required=False)

    # step 3
    phone = serializers.CharField(required=False)

    # step 4
    phone_otp = serializers.CharField(required=False)

    # step 5 — set password + username
    username = serializers.CharField(required=False)
    password = serializers.CharField(required=False)
    password2 = serializers.CharField(required=False)

    signup_token = serializers.CharField(required=False)

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