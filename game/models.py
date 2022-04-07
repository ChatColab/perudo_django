from django.db import models
from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Game(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey('GameRoom', on_delete=models.CASCADE)
    dice1 = models.IntegerField(default=0)
    dice2 = models.IntegerField(default=0)
    dice3 = models.IntegerField(default=0)
    dice4 = models.IntegerField(default=0)
    dice5 = models.IntegerField(default=0)
    ready = models.BooleanField(default=False)

class GameRoom(models.Model):
    name = models.CharField(max_length=255)

class GameState(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    nbdice = models.IntegerField(default=0)
    valuedice = models.IntegerField(default=0)
    turn = models.IntegerField(default=0)
    turn1 = models.BooleanField(default=False)