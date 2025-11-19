from rest_framework import serializers
from .models import User, Category, Product, Banner, WishlistItem, Cart, CartItem, Address, Order, OrderItem
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