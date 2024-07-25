from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('add_player/', views.add_player, name='add_player'),
    path('check_player/<str:player_name>/', views.check_player, name='check_player'),  # check_player URL 추가
    path('update_winner/', views.update_winner, name='update_winner'),  # update_winner URL 추가

]