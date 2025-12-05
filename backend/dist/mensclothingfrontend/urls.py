from django.urls import path
from .views import (LoginView, SignupView, LogoutView, ResetPasswordView, CategoryListView, CategoryDetailView, ProductListView, ProductDetailView, 
    ReduceStockView, BannerListView, WishlistListCreateView, WishlistRemoveView, CartDetailView, CartAddUpdateView, CartRemoveItemView, AddressListCreateView, 
    AddressDetailView, CreateOrderView, ProfileView,VerifyPaymentView, RecommendationView, MyOrdersView, CancelOrderView, OrderTrackView)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='sigup'),
    path('login/', LoginView.as_view(), name='login'),
    path('reset/', ResetPasswordView.as_view(), name='reset'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:pk>/buy/', ReduceStockView.as_view(), name='buy-product'),
    path('banners/', BannerListView.as_view(), name='banners'),
    path('wishlist/', WishlistListCreateView.as_view(), name='wishlist-list-create'),
    path('wishlist/<int:pk>/', WishlistRemoveView.as_view(), name='wishlist-remove'),
    path('cart/', CartDetailView.as_view(), name='cart-detail'),
    path('cart/items/', CartAddUpdateView.as_view(), name='cart-add'),
    path('cart/items/<int:pk>/', CartRemoveItemView.as_view(), name='cart-remove-item'),
    path("my-orders/", MyOrdersView.as_view(), name="my-orders"),
    path("orders/<int:order_id>/cancel/", CancelOrderView.as_view(), name="cancel-order"),
    path("orders/<int:order_id>/track/", OrderTrackView.as_view(), name="track-order"),
    path('addresses/', AddressListCreateView.as_view(), name='address-list-create'),
    path('addresses/<int:pk>/', AddressDetailView.as_view(), name='address-detail'),
    path('checkout/', CreateOrderView.as_view(), name='create-order'),
    path('profile/', ProfileView.as_view(), name='profile'),  
    path("razorpay/verify/", VerifyPaymentView.as_view()),
    path('recommendations/', RecommendationView.as_view(), name='recommendations'),
    path('logout/', LogoutView.as_view(), name='logout')
]

