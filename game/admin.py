from django.contrib import admin
from .models import Player, Game, Tournament

admin.site.register(Player)
admin.site.register(Game)
admin.site.register(Tournament)