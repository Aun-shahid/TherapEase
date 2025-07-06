from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework import permissions

User = get_user_model()

# Create your views here.
def hello_world(request):
    return HttpResponse("Hello, World!")


class Users(View):
    def get(self, request):
        return HttpResponse("Hello, Mister!")


class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_active=True
        )
        return user


class SignupView(APIView):
    permission_classes = [permissions.AllowAny]
    """
    User signup endpoint.
    Allows registration with only username, email, and password. All other fields are optional.
    """
    @extend_schema(
        request=UserSignupSerializer,
        responses={201: OpenApiResponse(description='User created successfully.'), 400: OpenApiResponse(description='Validation error')},
        summary="User Signup",
        description="Register a new user with username, email, and password. All other fields are optional."
    )
    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'detail': 'User created successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



