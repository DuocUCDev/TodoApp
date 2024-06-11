from django.contrib import admin
from django.urls import path, include
from core.views import RegisterView, SuscriptionView, TaskListView, TaskDetailView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/suscription/', SuscriptionView.as_view(), name='suscription'),
    path('api/tasks/', TaskListView.as_view(), name='tasks'),
    path('api/tasks/<int:pk>/', TaskDetailView.as_view(), name='task_detail'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
