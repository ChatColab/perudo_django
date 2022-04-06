from django.shortcuts import render
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from game.models import Game, GameState

class Index(LoginRequiredMixin, View):
	def get(self, request):
		return render(request, 'game/index.html')

class Room(LoginRequiredMixin, View):
	def get(self, request, game_id):
		game = Game.objects.filter(id=game_id).first()
		gamedata = []
		if game:
			gamedata = GameState.objects.filter(game_id=game_id)
		else: 
			game = Game(id=game_id)
			game.save()
		return render(request, 'game/room.html', {'game_id': game_id, 'gamedata': gamedata})