from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Category, Product
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
    list_display = ('id', 'name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}  # auto-fill slug from name
    ordering = ('id',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price', 'stock')
    list_filter = ('category',)
    search_fields = ('name', 'category__name')
    list_editable = ('price', 'stock')  # allows inline edit of price & stock
    ordering = ('id',)