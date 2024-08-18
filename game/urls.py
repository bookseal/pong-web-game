from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.views.i18n import JavaScriptCatalog  # 추가: JavaScriptCatalog import


urlpatterns = [
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
	path('reset_otp/', views.reset_otp, name='reset_otp'),
	path('get_blockchain_scores/<str:player_name>/', views.get_blockchain_scores, name='get_blockchain_scores'),
    path('score_check/', views.score_check_page, name='score_check_page'),
	path('jsi18n/', JavaScriptCatalog.as_view(), name='javascript-catalog'),  # 추가: JavaScript 번역 카탈로그 URL
    path('change_language/', views.change_language, name='change_language'),  # 추가: 언어 변경 URL
    path('api/check-auth/', views.check_auth, name='check_auth'),

]