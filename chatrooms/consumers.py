import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Chat, ChatRoom, ConnectedRoom

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.room_name = self.scope['url_route']['kwargs']['room_name']
		self.room_group_name = 'chat_%s' % self.room_name

		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)

		room = await database_sync_to_async(ChatRoom.objects.get)(name=self.room_name)

		connected = ConnectedRoom(
			user=self.scope['user'],
			room=room
		)

		await database_sync_to_async(connected.save)()	

		await self.accept()

	async def disconnect(self, close_code):
		# leave the user from the channel
		await self.channel_layer.group_discard(
			self.room_group_name,
			self.channel_name
		)
		user_id = self.scope['user'].id
		room_id = await database_sync_to_async(ChatRoom.objects.get)(name=self.room_name)

		if(await database_sync_to_async(ConnectedRoom.objects.filter(room=room_id).count)() == 1):
			# delete the user in connected which leave the room
			user =  await database_sync_to_async(ConnectedRoom.objects.get)(user=user_id)
			user = await database_sync_to_async(user.delete)()
			chatroom = await database_sync_to_async(ChatRoom.objects.get)(id=room_id.id)
			chatroom = await database_sync_to_async(chatroom.delete)()
		else:
			# delete the user in connected which leave the room
			user =  await database_sync_to_async(ConnectedRoom.objects.get)(user=user_id)
			user = await database_sync_to_async(user.delete)()

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		message = text_data_json['message']
		self.user_id = self.scope['user'].id
		self.user_username = self.scope['user'].username

		# Find room object
		room = await database_sync_to_async(ChatRoom.objects.get)(name=self.room_name)

		# Create a new chat object 
		chat = Chat(
			content=message, 
			user=self.scope['user'],
			room=room
		)

		await database_sync_to_async(chat.save)()


		await self.channel_layer.group_send(
			self.room_group_name,
			{
				'type': 'chat_message',
				'message': message,
				'user_id': self.user_id,
				'user_username': self.user_username
			})

	async def chat_message(self, event):
		message = event['message']
		user_id = event['user_id']
		user_username = event['user_username']

		await self.send(text_data=json.dumps({
			'message': message,
			'user_id': user_id,
			'user_username': user_username
		}))