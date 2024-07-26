from django.db import models
from django.contrib.auth.models import AbstractUser

class Player(models.Model):
    username = models.CharField(max_length=150, unique=True)
    games_played = models.IntegerField(default=0)
    games_won = models.IntegerField(default=0)

    def __str__(self):
        return self.username

class CustomUser(AbstractUser):
    is_2fa_enabled = models.BooleanField(default=False)
    otp_secret = models.CharField(max_length=64, blank=True, null=True)

    def __str__(self):
        return self.username