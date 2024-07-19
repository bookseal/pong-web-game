from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('add_player/', views.add_player, name='add_player'),
]