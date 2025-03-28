from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import CatchEntry
from .serializers import CatchSerializer

@api_view(['GET'])
def get_catches(request):
    catches = CatchEntry.objects.all()
    serializer = CatchSerializer(catches, many=True)
    return Response(serializer.data)

