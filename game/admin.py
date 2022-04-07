from django.contrib import admin
from game.models import Game, GameRoom, GameState

# Register your models here.


admin .site.register(Game)
admin.site.register(GameRoom)
admin.site.register(GameState)