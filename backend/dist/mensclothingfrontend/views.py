import uuid
import random
import razorpay
from django.conf import settings
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, SignupSession, OTP, Category, Product, Banner, WishlistItem, Cart, CartItem, Address, Order, OrderItem
from .serializers import SignupSerializer, LoginSerializer,ResetPasswordSerializer, ProductSerializer, CategorySerializer, BannerSerializer, WishlistSerializer, CartSerializer, CartItemSerializer, AddressSerializer, OrderSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
from .utils import send_email_otp, send_phone_otp
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.utils import timezone
User = get_user_model()

class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        step = data.get("step")

        # 1️⃣ STEP — SEND EMAIL OTP
        if step == "email":
            email = data["email"]
            session, _ = SignupSession.objects.get_or_create(email=email)

            if session.is_expired():
                session.delete()
                session = SignupSession.objects.create(email=email)

            send_email_otp(email)

            return Response({
                "message": "Email OTP sent",
                "signup_token": str(session.token)
            })

        # 2️⃣ STEP — VERIFY EMAIL OTP
        if step == "verify_email":
            token = data["signup_token"]
            email_otp = data["email_otp"]

            session = get_object_or_404(SignupSession, token=token)

            otp_obj = OTP.objects.filter(email=session.email).latest('created_at')

            if otp_obj.is_expired():
                return Response({"error": "OTP expired"}, status=400)
            if otp_obj.code != email_otp:
                return Response({"error": "Incorrect OTP"}, status=400)

            session.email_verified = True
            session.save()

            return Response({
                "message": "Email verified",
                "signup_token": str(session.token)
            })

        # 3️⃣ STEP — SEND PHONE OTP
        if step == "phone":
            token = data["signup_token"]
            phone = data["phone"]

            session = get_object_or_404(SignupSession, token=token)

            if not session.email_verified:
                return Response({"error": "Email not verified"}, status=400)

            session.phone = phone
            session.save()

            send_phone_otp(phone)

            return Response({
                "message": "Phone OTP sent",
                "signup_token": str(session.token)
            })

        # 4️⃣ STEP — VERIFY PHONE OTP
        if step == "verify_phone":
            token = data["signup_token"]
            phone_otp = data["phone_otp"]

            session = get_object_or_404(SignupSession, token=token)

            otp_obj = OTP.objects.filter(phone_number=session.phone).latest("created_at")

            if otp_obj.is_expired():
                return Response({"error": "OTP expired"}, status=400)
            if otp_obj.code != phone_otp:
                return Response({"error": "Incorrect OTP"}, status=400)

            session.phone_verified = True
            session.save()

            return Response({"message": "Phone verified", "signup_token": str(session.token)})

        # 5️⃣ STEP — SET PASSWORD AND CREATE USER
        if step == "set_password":
            token = data["signup_token"]
            password = data["password"]
            password2 = data["password2"]
            username = data["username"]

            session = get_object_or_404(SignupSession, token=token)

            if password != password2:
                return Response({"error": "Passwords do not match"}, status=400)

            if not (session.email_verified and session.phone_verified):
                return Response({"error": "Complete verification first"}, status=400)

    # prevent duplicate user
            if User.objects.filter(email=session.email).exists():
                return Response({"error": "Email already exists"}, status=400)
            if User.objects.filter(phone_number=session.phone).exists():
                return Response({"error": "Phone already registered"}, status=400)

    # create the user
        user = User.objects.create_user(
            email=session.email,
            phone_number=session.phone,
            password=password
        )
        user.username = username
        user.save()

        session.delete()

        return Response({"message": "Account created successfully"})


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        identifier = serializer.validated_data['identifier']
        password = serializer.validated_data['password']

        try:
            if "@" in identifier:
                user_obj = User.objects.get(email=identifier)
            else:
                user_obj = User.objects.get(phone_number=identifier)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        user = authenticate(request, email=user_obj.email, password=password)

        if not user:
            return Response({"error": "Invalid credentials"}, status=400)

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })


class ResetPasswordView(APIView):
    reset_sessions = {}  # store temporary reset tokens

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        step = data.get("step")

        # 🔹 STEP 1 — SEND OTP
        if step == "send_otp":
            identifier = data["identifier"]

            # find user
            try:
                if "@" in identifier:
                    user = User.objects.get(email=identifier)
                    send_email_otp(user.email)
                else:
                    user = User.objects.get(phone_number=identifier)
                    send_phone_otp(user.phone_number)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)

            reset_token = str(uuid.uuid4())
            self.reset_sessions[reset_token] = {
                "identifier": identifier,
                "verified": False,
                "created_at": timezone.now()
            }

            return Response({
                "message": "OTP sent",
                "reset_token": reset_token
            })

        # 🔹 STEP 2 — VERIFY OTP
        if step == "verify_otp":
            reset_token = data["reset_token"]
            otp = data["otp"]

            if reset_token not in self.reset_sessions:
                return Response({"error": "Invalid or expired reset token"}, status=400)

            session = self.reset_sessions[reset_token]

            identifier = session["identifier"]

            try:
                if "@" in identifier:
                    otp_obj = OTP.objects.filter(email=identifier).latest("created_at")
                else:
                    otp_obj = OTP.objects.filter(phone_number=identifier).latest("created_at")
            except OTP.DoesNotExist:
                return Response({"error": "OTP not found"}, status=404)

            if otp_obj.is_expired():
                return Response({"error": "OTP expired"}, status=400)

            if otp_obj.code != otp:
                return Response({"error": "Invalid OTP"}, status=400)

            session["verified"] = True

            return Response({
                "message": "OTP verified",
                "reset_token": reset_token
            })

        # 🔹 STEP 3 — RESET PASSWORD
        if step == "reset_password":
            reset_token = data["reset_token"]
            password = data["password"]
            password2 = data["password2"]

            if reset_token not in self.reset_sessions:
                return Response({"error": "Invalid or expired reset token"}, status=400)

            session = self.reset_sessions[reset_token]

            if not session["verified"]:
                return Response({"error": "OTP not verified"}, status=400)

            if password != password2:
                return Response({"error": "Passwords do not match"}, status=400)

            identifier = session["identifier"]

            # find user
            if "@" in identifier:
                user = User.objects.get(email=identifier)
            else:
                user = User.objects.get(phone_number=identifier)

            user.set_password(password)
            user.save()

            del self.reset_sessions[reset_token]

            return Response({"message": "Password reset successful"})

        return Response({"error": "Invalid step"}, status=400)
    
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
