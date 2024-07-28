from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('hello/', views.hello_world, name='hello_world'),
    path('', views.index, name='index'),
    # path('index/', views.index, name='index'),
    path('start_game/', views.start_game, name='start_game'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', views.auth_login_view, name='login'),
    path('callback/', views.callback, name='auth_callback'),
    path('verify_2fa/', views.verify_2fa, name='verify_2fa'),
    path('protected/', views.protected_view, name='protected_view'),
    path('logout/', views.logout_view, name='logout'),
    path('reset-session/', views.reset_session, name='reset_session'),
    path('force-logout/', views.force_logout, name='force_logout'),
    path('add_player/', views.add_player, name='add_player'),
    path('check_player/<str:player_name>/', views.check_player, name='check_player'),
    path('update_winner/', views.update_winner, name='update_winner'),
]