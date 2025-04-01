from rest_framework import serializers
from .models import CatchEntry

class CatchSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = CatchEntry
        fields = '__all__'
