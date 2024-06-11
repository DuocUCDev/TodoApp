from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Subscription, Task

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class SubscriptionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Subscription
        fields = ['id', 'user', 'username', 'start_date', 'end_date', 'is_active']
        read_only_fields = ['start_date', 'end_date', 'is_active', 'username']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['start_date'] = instance.start_date.strftime('%d-%m-%Y')
        representation['end_date'] = instance.end_date.strftime('%d-%m-%Y')
        return representation

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'user', 'title', 'description', 'create_at', 'update_at']