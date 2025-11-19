import random
import razorpay
from django.conf import settings
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, PhoneOTP, Category, Product, Banner, WishlistItem, Cart, CartItem, Address, Order, OrderItem
from .serializers import SendOTPSerializer, VerifyOTPSerializer, ProductSerializer, CategorySerializer, BannerSerializer, WishlistSerializer, CartSerializer, CartItemSerializer, AddressSerializer, OrderSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes

def generate_otp():
    return str(random.randint(100000, 999999))


class SendOTPView(generics.GenericAPIView):
    serializer_class = SendOTPSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data['phone_number']
        otp = generate_otp()

        PhoneOTP.objects.update_or_create(
            phone_number=phone,
            defaults={'otp': otp}
        )

        # In real world → integrate with SMS API here
        print("OTP sent:", otp)

        return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)


class VerifyOTPView(generics.GenericAPIView):
    serializer_class = VerifyOTPSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data['phone_number']
        otp = serializer.validated_data['otp']

        try:
            otp_obj = PhoneOTP.objects.get(phone_number=phone)
        except PhoneOTP.DoesNotExist:
            return Response({"error": "Phone number not found"}, status=400)

        # Check OTP match
        if otp_obj.otp != otp:
            return Response({"error": "Incorrect OTP"}, status=400)

        # Create user permanently if not exists
        user, created = User.objects.get_or_create(phone_number=phone)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "OTP verified successfully",
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=200)
        
# LOGOUT VIEW
class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)

        except TokenError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception:
            return Response({"error": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(parent__isnull=True)
    serializer_class = CategorySerializer

class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# Fetch all products or filter by category
class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()

        sub = self.request.query_params.get("subcategory")
        main = self.request.query_params.get("category")

        # Filter by subcategory
        if sub:
            queryset = queryset.filter(category__slug=sub)

        # Filter products by parent category
        if main:
            queryset = queryset.filter(category__parent__slug=main)

        return queryset

    
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ReduceStockView(APIView):

    def post(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        if product.stock <= 0:
            return Response({"error": "Out of stock"}, status=400)

        product.stock -= 1
        product.save()

        return Response({
            "message": "Product purchased successfully",
            "remaining_stock": product.stock
        })
        
class BannerListView(generics.ListAPIView):
    queryset = Banner.objects.filter(active=True).order_by('order')[:3]
    serializer_class = BannerSerializer
    permission_classes = [permissions.AllowAny]


# Wishlist: list, add, remove
class WishlistListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = WishlistItem.objects.filter(user=request.user)
        serializer = WishlistSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        product_id = request.data.get('product_id')
        product = get_object_or_404(Product, pk=product_id)
        obj, created = WishlistItem.objects.get_or_create(user=request.user, product=product)
        serializer = WishlistSerializer(obj, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class WishlistRemoveView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, pk):
        item = get_object_or_404(WishlistItem, pk=pk, user=request.user)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Cart endpoints
class CartDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

class CartAddUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        product = get_object_or_404(Product, pk=product_id)

        if product.stock < quantity:
            return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product, defaults={'quantity': quantity})
        if not created:
            item.quantity += quantity
            item.save()
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        # update quantity
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item = get_object_or_404(CartItem, cart=cart, product__id=product_id)
        if quantity <= 0:
            item.delete()
        else:
            if item.product.stock < quantity:
                return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)
            item.quantity = quantity
            item.save()
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

class CartRemoveItemView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, pk):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item = get_object_or_404(CartItem, pk=pk, cart=cart)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Addresses (CRUD)
class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if serializer.validated_data.get('is_default', False):
            # unset other defaults
            Address.objects.filter(user=self.request.user, is_default=True).update(is_default=False)
        serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


# Checkout / Create Order (simple)
class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        address_id = request.data.get('address_id')
        payment_method = request.data.get('payment_method', 'COD')

        address = get_object_or_404(Address, pk=address_id, user=request.user)
        cart, _ = Cart.objects.get_or_create(user=request.user)
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # calculate total and check stock
        total = Decimal('0.00')
        for item in cart.items.select_related('product'):
            if item.product.stock < item.quantity:
                return Response({'error': f'Not enough stock for {item.product.name}'}, status=status.HTTP_400_BAD_REQUEST)
            total += item.subtotal()

        order = Order.objects.create(user=request.user, address=address, total=total, payment_method=payment_method)
        # create order items and reduce stock
        for item in cart.items.select_related('product'):
            OrderItem.objects.create(order=order, product=item.product, price=item.product.price, quantity=item.quantity)
            # reduce stock
            item.product.stock -= item.quantity
            item.product.save()

        # clear cart
        cart.items.all().delete()

        # NOTE: integrate payment gateway here. For now, assume COD or payment handled separately.
        serializer = OrderSerializer(order, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Profile endpoints
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            'id': user.id,
            'phone_number': getattr(user, 'phone_number', None),
            'email': getattr(user, 'email', None),
            'name': getattr(user, 'name', None),
        }
        return Response(data)

    def put(self, request):
        user = request.user
        name = request.data.get('name')
        # extend as needed
        if name:
            user.name = name
            user.save()
        return Response({'message': 'Profile updated'})

class CreateRazorpayOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get("amount")  # in Rupees
        amount_in_paisa = int(float(amount) * 100)  # convert to paisa
        
        # Razorpay client
        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY, settings.RAZORPAY_SECRET)
        )
        print("Razorpay auth →", settings.RAZORPAY_KEY, settings.RAZORPAY_SECRET)
        # create order
        payment_order = client.order.create({
            "amount": amount_in_paisa,
            "currency": "INR",
            "payment_capture": 1
        })

        return Response({
            "order_id": payment_order["id"],
            "amount": amount,
            "currency": "INR",
            "key": settings.RAZORPAY_KEY
        })

class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get("razorpay_order_id")
        razorpay_payment_id = request.data.get("razorpay_payment_id")
        razorpay_signature = request.data.get("razorpay_signature")
        order_id = request.data.get("order_id")  # your internal order

        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY, settings.RAZORPAY_SECRET)
        )

        # verify signature
        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature
            })

            order = Order.objects.get(id=order_id, user=request.user)
            order.paid = True
            order.payment_method = "RAZORPAY"
            order.payment_reference = razorpay_payment_id
            order.save()

            return Response({"status": "success", "message": "Payment verified"})
        except:
            return Response({"status": "failed", "message": "Payment verification failed"}, status=400)
