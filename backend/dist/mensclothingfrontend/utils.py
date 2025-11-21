import random
from django.core.mail import send_mail
from django.conf import settings
from .models import OTP

def generate_otp():
    return f"{random.randint(100000, 999999):06d}"

def send_email_otp(email):
    otp = generate_otp()
    OTP.objects.create(email=email, code=otp)
    # send email (SMTP) — will use settings EMAIL_BACKEND
    subject = "Your signup OTP"
    message = f"Your OTP code is: {otp}. It is valid for 5 minutes."
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=False)
    return otp  # useful for console tests

def send_phone_otp(phone):
    otp = generate_otp()
    OTP.objects.create(phone_number=phone, code=otp)
    # print to terminal (no SMS provider)
    print("\n====================================")
    print(f"OTP for {phone}: {otp}")
    print("====================================\n")
    return otp
