from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .models import Subscription, Task
from .serializers import UserSerializer, SuscriptionSerializer, TaskSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from datetime import datetime, timedelta

# Create your views here.
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = response.data
        refresh = RefreshToken.for_user(User.objects.get(username=user['username']))
        return Response({
            'user': user,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

class SuscriptionView(generics.CreateAPIView):
    serializer_class = SuscriptionSerializer
    
    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        end_date = datetime.now() + timedelta(days=30)
        serializer.save(user=self.request.user, end_date=end_date)
    

class TaskListView(generics.ListAPIView):
    serializer_class = TaskSerializer
    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)