from django.shortcuts import render
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from game.models import Game, GameRoom, GameState

class Index(LoginRequiredMixin, View):
	def get(self, request):
		return render(request, 'game/index.html')

class Test(LoginRequiredMixin,View):
	def get(self,request):
		return render(request,'game/test.html')

class Room(LoginRequiredMixin, View):
	def get(self, request, game_name):
		game = GameRoom.objects.filter(name=game_name).first()
		gamedata = []
		if game:
			gamedata = Game.objects.filter(room=game)
		else: 
			game = GameRoom(name=game_name)
			game.save()
		return render(request, 'game/room.html', {'game_name': game_name, 'gamedata': gamedata})