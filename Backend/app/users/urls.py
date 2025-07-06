from django.urls import path
from . import views


urlpatterns = [
    path('function', views.hello_world),
    path('class' , views.Users.as_view() ),
    path('signup/', views.SignupView.as_view(), name='user_signup'),
]