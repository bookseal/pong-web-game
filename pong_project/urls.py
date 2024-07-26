from django.contrib import admin
from django.urls import path, include
# from rest_framework_simplejwt.views import TokenRefreshView

from game.views import auth_login_view, callback, protected_view, logout, reset_session, index, force_logout, verify_2fa, hello_world
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('game.urls')),
    # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('logout/', logout, name='logout'),
    # path('login/', auth_login_view, name='auth_login'),
    # path('callback/', callback, name='auth_callback'),
    # path('protected/', protected_view, name='protected_view'),
    # path('reset-session/', reset_session, name='reset_session'),
    # path('force_logout/', force_logout, name='force_logout'),
    # path('verify_2fa/', verify_2fa, name='verify_2fa'),
]
