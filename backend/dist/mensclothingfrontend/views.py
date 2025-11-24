import uuid
import random
import razorpay
from django.conf import settings
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, OTP, Category, Product, Banner, WishlistItem, Cart, CartItem, Address, Order, OrderItem
from .serializers import SignupSerializer, LoginSerializer, ResetPasswordSerializer, ProductSerializer, CategorySerializer, BannerSerializer, WishlistSerializer, CartSerializer, CartItemSerializer, AddressSerializer, OrderSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
from .utils import send_email_otp, send_phone_otp
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import transaction

User = get_user_model()


class SignupView(APIView):

    def generate_otp(self):
        import random
        return str(random.randint(100000, 999999))

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        step = serializer.validated_data["step"]
        
        if step == "email":
            email = serializer.validated_data.get("email")

            if User.objects.filter(email=email).exists():
                return Response({"error": "Email already exists"}, status=400)

            # create temporary user (phone blank but NOT UNIQUE)
            otp = send_email_otp(email)

            user = User.objects.create(
             email=email,
             email_otp=otp,
             otp_created_at=timezone.now(),
             phone_number=str(uuid.uuid4())[:12],  
             )

            print("EMAIL OTP:", user.email_otp)
            return Response({
                "message": "OTP sent to email",
                "signup_token": str(user.signup_token)
            })

        if step == "email_verification":
            signup_token = serializer.validated_data.get("signup_token")
            email_otp = serializer.validated_data.get("email_otp")

            user = User.objects.get(signup_token=signup_token)

            if user.email_otp != email_otp:
                return Response({"error": "Invalid OTP"}, status=400)

            if user.is_otp_expired():
                return Response({"error": "OTP expired"}, status=400)

            user.email_verified = True
            user.email_otp = None
            user.save()

            return Response({"message": "Email verified"})
        
        if step == "phone_number":
            signup_token = serializer.validated_data.get("signup_token")
            phone = serializer.validated_data.get("phone_number")

            if not phone or phone.strip() == "":
                return Response({"error": "Phone number required"}, status=400)

            if User.objects.filter(phone_number=phone).exists():
                return Response({"error": "Phone already exists"}, status=400)

            user = User.objects.get(signup_token=signup_token)
            user.phone_number = phone
            user.phone_otp = self.generate_otp()
            user.otp_created_at = timezone.now()
            user.save()

            print("PHONE OTP:", user.phone_otp)
            return Response({"message": "OTP sent to phone"})
        
        if step == "phone_verification":
            signup_token = serializer.validated_data.get("signup_token")
            phone_otp = serializer.validated_data.get("phone_otp")

            user = User.objects.get(signup_token=signup_token)

            if user.phone_otp != phone_otp:
                return Response({"error": "Invalid OTP"}, status=400)

            if user.is_otp_expired():
                return Response({"error": "OTP expired"}, status=400)

            user.phone_verified = True
            user.phone_otp = None
            user.save()

            return Response({"message": "Phone verified"})

        if step == "password":
            signup_token = serializer.validated_data.get("signup_token")
            username = serializer.validated_data.get("username")
            password = serializer.validated_data.get("password")
            password2 = serializer.validated_data.get("password2")

            user = User.objects.get(signup_token=signup_token)

            if password != password2:
                return Response({"error": "Passwords do not match"}, status=400)

            if not (user.email_verified and user.phone_verified):
                return Response({"error": "Complete verification first"}, status=400)

            user.username = username
            user.set_password(password)
            user.save()

            return Response({"message": "Account created successfully!"})

        return Response({"error": "Invalid step"}, status=400)
    
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        identifier = serializer.validated_data['identifier']
        password = serializer.validated_data['password']

        user = authenticate(request, username=identifier, password=password)

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


class CreateOrderView(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # Selected cart items or entire cart
        item_ids = request.data.get("items", [])
        payment_method = request.data.get("payment_method", "COD").upper()
        address_id = request.data.get("address_id")

        # Load cart items
        if item_ids:
            cart_items = CartItem.objects.filter(id__in=item_ids, cart__user=user)
        else:
            cart, _ = Cart.objects.get_or_create(user=user)
            cart_items = cart.items.all()

        if not cart_items.exists():
            return Response({"error": "No cart items found"}, status=400)

        # Get address
        if address_id:
            address = get_object_or_404(Address, id=address_id, user=user)
        else:
            address = Address.objects.filter(user=user, is_default=True).first()

        if not address:
            return Response({"error": "Address is required"}, status=400)

        # Calculate total
        total = Decimal("0.00")
        for item in cart_items:
            if item.product.stock < item.quantity:
                return Response({"error": f"Not enough stock for {item.product.name}"}, status=400)
            total += item.product.price * item.quantity

        # ---------------------------
        #       COD CHECKOUT  
        # ---------------------------
        if payment_method == "COD":
            with transaction.atomic():
                order = Order.objects.create(
                    user=user,
                    address=address,
                    total=total,
                    paid=False,
                    payment_method="COD"
                )

                for item in cart_items:
                    OrderItem.objects.create(
                        order=order,
                        product=item.product,
                        price=item.product.price,
                        quantity=item.quantity
                    )
                    # Reduce stock
                    item.product.stock -= item.quantity
                    item.product.save()

                cart_items.delete()

            return Response({
                "message": "Order placed successfully (COD)",
                "order_id": order.id,
                "total": str(order.total)
            })

        # ---------------------------
        #   RAZORPAY CHECKOUT
        # ---------------------------
        elif payment_method == "RAZORPAY":
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

            amount_paise = int(total * 100)

            razorpay_order = client.order.create({
                "amount": amount_paise,
                "currency": "INR",
                "payment_capture": 1
            })

            return Response({
                "message": "Razorpay order created",
                "razorpay_order_id": razorpay_order["id"],
                "amount": str(total),
                "amount_paisa": amount_paise,
                "items": [item.id for item in cart_items],
                "key": settings.RAZORPAY_KEY_ID,
                "address_id": address.id
            })

        else:
            return Response({"error": "Invalid payment method"}, status=400)
        
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
    

class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        razorpay_order_id = data.get("razorpay_order_id")
        razorpay_payment_id = data.get("razorpay_payment_id")
        razorpay_signature = data.get("razorpay_signature")
        items = data.get("items", [])
        address_id = data.get("address_id")

        if not (razorpay_order_id and razorpay_payment_id and razorpay_signature):
            return Response({"error": "Missing payment details"}, status=400)

        # Verify Razorpay signature
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
            })
        except:
            return Response({"error": "Invalid payment signature"}, status=400)

        # Load cart items
        if items:
            cart_items = CartItem.objects.filter(id__in=items, cart__user=user)
        else:
            cart_items = CartItem.objects.filter(cart__user=user)

        if not cart_items.exists():
            return Response({"error": "No cart items found"}, status=400)

        # Load address
        address = get_object_or_404(Address, id=address_id, user=user)

        # Create final order
        with transaction.atomic():
            total = sum(item.product.price * item.quantity for item in cart_items)

            order = Order.objects.create(
                user=user,
                address=address,
                total=total,
                paid=True,
                payment_method="RAZORPAY",
                payment_reference=razorpay_payment_id
            )

            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    price=item.product.price,
                    quantity=item.quantity
                )
                item.product.stock -= item.quantity
                item.product.save()

            cart_items.delete()

        return Response({"message": "Payment successful, order placed", "order_id": order.id})
