import random
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, PhoneOTP, Category, Product
from .serializers import SendOTPSerializer, VerifyOTPSerializer, ProductSerializer, CategorySerializer

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
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# Fetch all products or filter by category
class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset
    
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer