from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (User, Category, Product, Banner, WishlistItem, Cart, CartItem, Address, Order, 
                    OrderItem, ProductVariant, SearchLog,)

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "email",
        "phone_number",
        "email_verified",
        "phone_verified",
        "is_staff",
        "is_active",
    )
    list_filter = ("email_verified", "phone_verified", "is_staff", "is_active")
    search_fields = ("email", "phone_number")

    ordering = ("email",)

    fieldsets = (
        ("Login Credentials", {
            "fields": ("email", "phone_number", "password")
        }),
        ("Verification Status", {
            "fields": ("email_verified", "phone_verified")
        }),
        ("OTP Data (Read Only)", {
            "fields": (
                "email_otp",
                "phone_otp",
                "login_otp",
                "reset_password_otp",
                "change_email_otp",
                "change_phone_otp",
                "otp_created_at",
            )
        }),
        ("Permissions", {
            "fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")
        }),
    )

    readonly_fields = (
        "email_verified",
        "phone_verified",
        "email_otp",
        "phone_otp",
        "otp_created_at",
        "reset_password_otp",
        "reset_token",
        "signup_token",
    )

    add_fieldsets = (
        ("Create User", {
            "classes": ("wide",),
            "fields": ("email", "phone_number", "password1", "password2"),
        }),
    )
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug', 'parent')
    list_filter = ('parent',)
    search_fields = ('name',)
    
class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = ("color", "size", "stock", "image")
    show_change_link = True

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price',)
    list_filter = ('category',)
    search_fields = ('name', 'category__name')
    list_editable = ('price',)  # allows inline edit of price & stock
    ordering = ('id',)
    inlines = [ProductVariantInline]
    
@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'order', 'active')
    list_editable = ('order', 'active')

@admin.register(WishlistItem)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'created_at')
    search_fields = ('user__email', 'product__name')

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at')
    inlines = [CartItemInline]

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'full_name', 'city', 'is_default')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total', 'paid', 'payment_method', 'status', 'created_at')
    inlines = [OrderItemInline]


@admin.register(SearchLog)
class SearchLogAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "query", "created_at")
    search_fields = ("query",)
    list_filter = ("created_at",)