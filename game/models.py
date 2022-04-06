from django.db import models
from django.db import models
from django.contrib.auth.models import User
from chatrooms.models import ChatRoom 
# Create your models here.


class Game(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    dice1 = models.IntegerField(default=0)
    dice2 = models.IntegerField(default=0)
    dice3 = models.IntegerField(default=0)
    dice4 = models.IntegerField(default=0)
    dice5 = models.IntegerField(default=0)
    palifico = models.IntegerField(default=0)
    ready = models.BooleanField(default=False)

class GameState(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    nbdice = models.IntegerField(default=0)
    valuedice = models.IntegerField(default=0)

