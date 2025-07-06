# authenticator/urls.py
from django.urls import path
from .views import RegisterView, UserProfileView, ChangePasswordView, LogoutView # Import your views

urlpatterns = [
    # User Registration API: POST request to create a new user
    path('register/', RegisterView.as_view(), name='register'),

    # User Profile API: GET for viewing, PUT/PATCH for updating the authenticated user's profile
    # You'll implement UserProfileView in authenticator/views.py
    path('profile/', UserProfileView.as_view(), name='user_profile'),

    # Change Password API: POST request to change the password for the authenticated user
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),

    # User Logout API: POST request to logout (often involves blacklisting JWT tokens)
    path('logout/', LogoutView.as_view(), name='logout'),

    # Add more authenticator-specific URLs here as needed
    # For example: password reset, email verification, etc.
]