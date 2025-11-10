from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OTP

class UserAdmin(BaseUserAdmin):
    list_display = ('fullname', 'email')
    search_fields = ('fullname', 'email')
    ordering = ('fullname',)

    # We’re not using passwords, so we keep forms simple
    fieldsets = (
        (None, {'fields': ('fullname', 'email')}),
    )

    add_fieldsets = (
        (None, {'fields': ('fullname', 'email')}),
    )

    filter_horizontal = ()
    list_filter = ()


class OTPAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'created_at', 'is_valid_status')
    search_fields = ('user__fullname', 'user__email', 'code')
    list_filter = ('created_at',)

    def is_valid_status(self, obj):
        return obj.is_valid()
    is_valid_status.short_description = 'Is Valid?'
    is_valid_status.boolean = True  # shows green/red icons in admin

admin.site.register(User, UserAdmin)
admin.site.register(OTP, OTPAdmin)
