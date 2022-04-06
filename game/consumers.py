import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django import db
from .models import Game, GameState
from chatrooms.models import ChatRoom
from utils import function
import random

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.room_name = self.scope['url_route']['kwargs']['room_name']
		self.room_group_name = 'chat_%s' % self.room_name

		await self.channel_layer.group_add(
		    self.room_group_name,
                 			self.channel_name
		)
		if(await database_sync_to_async(Game.objects.get)(user=self.scope['user']) is None):
			room = await database_sync_to_async(ChatRoom.objects.get)(name=self.room_name)

			game = Game(
				room=room,
				user=self.scope['user']
			)

			await database_sync_to_async(game.save)()

			await self.accept()

		else:
			await self.accept()

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(
		    self.room_group_name,
                 			self.channel_name
		)

	async def receive(self, text_data):
		game_data_json = json.loads(text_data)
		event = game_data_json['event']
		user = game_data_json['user']
		game_data_json = game_data_json['game_data']
		game = await database_sync_to_async(Game.objects.get)(user=user)
		if(event == 'READY'):
			# change ready value on game model
			
			game.ready = True
			await database_sync_to_async(game.save)()
			# check if all players are ready in the same room
			games = await database_sync_to_async(Game.objects.filter)(room=game.room)
			ready_games = await database_sync_to_async(Game.objects.filter)(room=game.room, ready=True)
			if(len(ready_games) == len(games)):
				# take the name of all the players in the room and send them to the game
				players = []
				for player_name in games:
					players.append(player_name.user.username)

				await self.channel_layer.group_send(
                    self.room_group_name, {
                        'type': 'send_message',
                        'game_data': {
                        	'nb_players': len(players),
                            'players': players
                        },
                        'event': "START"
                    })
		
		elif(event == 'LOSE-DICE'):
			dice = "dice" +str( game_data_json['nb_dice'])
			
			game.dice = 0
			await database_sync_to_async(game.save)()

		elif(event == 'ROLL'):
			nbdice = game_data_json['nb_dice']
			for i in range(1,nbdice+1):
				rdm = random.randint(1,6)
				dice="dice"+str(i)
				game.dice = rdm
			await database_sync_to_async(game.save)()



		else:
			await self.channel_layer.group_send(self.room_group_name, {
				'type': 'send_message',
				'game_data': game_data_json,
				'event': "event"
			})

	async def send_message(self, event):
		await self.send(text_data=json.dumps({
			'event': event['event'],
			'game_data': event['message']
		}))
