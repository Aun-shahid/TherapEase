from django.urls import path
from .views import (
    RegisterView, LoginView, UserProfileView, ChangePasswordView, LogoutView,
    PasswordResetRequestView, PasswordResetConfirmView, EmailVerificationView,
    RefreshTokenView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('verify-email/', EmailVerificationView.as_view(), name='verify_email'),
    path('token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),
]