from rest_framework import serializers
from .models import CatchEntry

class CatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatchEntry
        fields = '__all__'
