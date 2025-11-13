from django.urls import path
from .views import SendOTPView, VerifyOTPView, LogoutView, CategoryListView, CategoryDetailView, ProductListView, ProductDetailView

urlpatterns = [
    path('send-otp/', SendOTPView.as_view(), name='register'),
    path('login/', VerifyOTPView.as_view(), name='login'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
