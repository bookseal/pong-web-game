from django.db import models
from django.contrib.auth.models import User

class Player(models.Model):
    username = models.CharField(max_length=150, unique=True)
    games_played = models.IntegerField(default=0)
    games_won = models.IntegerField(default=0)

    def __str__(self):
        return self.username
