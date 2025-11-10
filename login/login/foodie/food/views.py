from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from .models import OTP
import random

User = get_user_model()

@api_view(['POST'])
def register(request):
    fullname = request.data.get('fullname')
    email = request.data.get('email')

    if User.objects.filter(fullname=fullname).exists():
        return Response({'message': 'Name already exists!'}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({'message': 'Email already exists!'}, status=400)

    User.objects.create_user(fullname=fullname, email=email)
    return Response({'message': 'Account created successfully!'})


@api_view(['POST'])
def send_otp(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'message': 'User not found!'}, status=404)

    otp_code = str(random.randint(100000, 999999))
    OTP.objects.create(user=user, code=otp_code)

    send_mail(
        'Your OTP Code',
        f'Your OTP code is {otp_code}. It is valid for 5 minutes.',
        'youremail@gmail.com',
        [email],
        fail_silently=False,
    )

    return Response({'message': 'OTP sent successfully!'})


@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')

    try:
        user = User.objects.get(email=email)
        otp_obj = OTP.objects.filter(user=user, code=otp).last()
        if otp_obj and otp_obj.is_valid():
            request.session['user_id'] = user.id
            return Response({'message': f'Welcome, {user.fullname}! Login successful!'})
        else:
            return Response({'message': 'Invalid or expired OTP!'}, status=400)
    except User.DoesNotExist:
        return Response({'message': 'User not found!'}, status=404)


@api_view(['POST'])
def logout(request):
    request.session.flush()
    return Response({'message': 'Logout successful!'})
