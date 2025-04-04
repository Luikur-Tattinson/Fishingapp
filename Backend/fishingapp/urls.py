"""
URL configuration for fishingapp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import register_user
from users.views import CustomTokenObtainPairView
from users.views import get_user_profile
from users.views import forgot_password
from catches.views import get_catches, create_catch
from django.conf import settings
from django.conf.urls.static import static
from catches.views import search_catches

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register'), 
    path('api/me/', get_user_profile, name='get_user_profile'),
    path('api/forgot-password/', forgot_password, name='forgot-password'),
    path('api/get-catches/', get_catches, name='get-catches'),
    path('api/catches/add/', create_catch, name='create_catch'),
    path('api/catches/search/', search_catches, name='catch_search'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
