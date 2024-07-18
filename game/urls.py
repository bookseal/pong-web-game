from django.urls import path
from . import views

urlpatterns = [
    path('', views.spa_index, name='spa_index'),
    path('api/home/', views.api_home, name='api_home'),
    path('api/game/', views.api_game, name='api_game'),
    path('api/tournament/', views.api_tournament, name='api_tournament'),
    path('api/rooms/', views.api_room_list, name='api_room_list'),
    path('api/rooms/create/', views.api_create_room, name='api_create_room'),
    path('api/rooms/<int:room_id>/join/', views.api_join_room, name='api_join_room'),
    path('api/create_game/', views.create_game, name='create_game'),
    path('api/join_tournament/', views.join_tournament, name='join_tournament'),
    path('<path:path>', views.spa_index, name='spa_path'),
]