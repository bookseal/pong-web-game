from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from game.views import auth_login_view, callback, protected_view, logout, reset_session, index, force_logout
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('game.urls')),
    path('index', index, name='index'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', logout, name='logout'),
    path('api/login/', auth_login_view, name='auth_login'),
    path('callback/', callback, name='auth_callback'),
    path('api/protected/', protected_view, name='protected_view'),
    path('reset-session/', reset_session, name='reset_session'),
    path('api/force_logout/', force_logout, name='force_logout'),
]
