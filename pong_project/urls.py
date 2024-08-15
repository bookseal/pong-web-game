from django.contrib import admin
from django.urls import path, include
from game.views import change_language

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('game.urls')),
	path('change_language/', change_language, name='change_language'),
]