from django.db import models
from django.contrib.auth.models import User


class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=50, unique=True)
    games_played = models.IntegerField(default=0)
    games_won = models.IntegerField(default=0)

    def __str__(self):
        return self.nickname

class Game(models.Model):
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='games_as_player1')
    player2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='games_as_player2')
    score_player1 = models.IntegerField(default=0)
    score_player2 = models.IntegerField(default=0)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.player1} vs {self.player2} - {self.start_time}"

class Tournament(models.Model):
    name = models.CharField(max_length=100)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    players = models.ManyToManyField(Player, related_name='tournaments')
    games = models.ManyToManyField(Game, related_name='tournament')
    winner = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, blank=True, related_name='tournaments_won')

    def __str__(self):
        return self.name

class Room(models.Model):
    name = models.CharField(max_length=100)
    max_players = models.IntegerField(default=2)
    current_players = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name