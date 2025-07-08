from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model
from rest_framework import serializers
from drf_spectacular.utils import extend_schema, OpenApiResponse

User = get_user_model()

def hello_world(request):
    return HttpResponse("Hello, World!")

class Users(View):
    def get(self, request):
        return HttpResponse("Hello, Mister!")

class ProtectedView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses={200: OpenApiResponse(description='User data returned.')},
        summary="Protected User Data",
        description="Returns data for the authenticated user."
    )
    def get(self, request):
        return Response({
            'id': str(request.user.id),
            'email': request.user.email,
            'user_type': request.user.user_type,
        })