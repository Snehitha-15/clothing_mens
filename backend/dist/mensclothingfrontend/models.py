from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, phone_number, password=None):
        user = self.model(phone_number=phone_number)
        if password:
            user.set_password(password)
        user.is_active = True
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password):
        user = self.create_user(phone_number, password)
        user.is_staff = True
        user.is_superuser = True
        user.is_admin = True
    #  IMPORTANT: without this, admin login FAILS
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    phone_number = models.CharField(max_length=10, unique=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)     # required for admin login
    is_superuser = models.BooleanField(default=False) # required for admin login
    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.phone_number
    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser
    
class PhoneOTP(models.Model):
    phone_number = models.CharField(max_length=10, unique=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.phone_number} - {self.otp}"
    
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=150)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='media/product_images/', blank=True, null=True)
    stock = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} ({self.category.name})"
