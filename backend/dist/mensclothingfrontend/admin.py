from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Category, Product, Banner, WishlistItem, Cart, CartItem, Address, Order, OrderItem
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Fields to display in admin list
    list_display = ('id', 'phone_number', 'is_admin', 'is_active')
    list_filter = ('is_admin', 'is_active')

    fieldsets = (
        (None, {'fields': ('phone_number',)}),
        ('Permissions', {'fields': ('is_admin', 'is_active')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone_number', 'is_admin', 'is_active'),
        }),
    )

    search_fields = ('phone_number',)
    ordering = ('id',)

    filter_horizontal = ()

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug', 'parent')
    list_filter = ('parent',)
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price', 'stock')
    list_filter = ('category',)
    search_fields = ('name', 'category__name')
    list_editable = ('price', 'stock')  # allows inline edit of price & stock
    ordering = ('id',)
    
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
    list_display = ('id', 'user', 'total', 'paid', 'payment_method', 'created_at')
    inlines = [OrderItemInline]