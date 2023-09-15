import json
import random

from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from channels.db import database_sync_to_async
from django.db import models
from .models import Playing_User

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        active_players = await database_sync_to_async(get_active_players)(self.room_name)
        print(active_players)
        if active_players <= 2:
            # Join room group
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()

            self.user_id = active_players + 1
        

        
        
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        
        await database_sync_to_async(remove_name)(self.channel_name, self.room_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        add_my_name = text_data_json["add_my_name"]
        if add_my_name == '':
            print("add_my_name = blank")
        active_players = await database_sync_to_async(get_active_players)(self.room_name)
        
        if add_my_name != '':
            if active_players < 2:
                await database_sync_to_async(add_name)(add_my_name, self.room_name, self.user_id, self.channel_name)

                active_players = await database_sync_to_async(get_active_players)(self.room_name)
                if active_players == 2:
                    #toss
                    toss1 = random.randint(0, 1)
                    toss2 = 0 if toss1 == 1 else 1
                    user1_channel_name = await database_sync_to_async(get_channel_name)(1, self.room_name)
                    user2_channel_name = await database_sync_to_async(get_channel_name)(2, self.room_name)
                    user1 = await database_sync_to_async(get_user_name)(1, self.room_name)
                    user2 = await database_sync_to_async(get_user_name)(2, self.room_name)
                    print("sending")
                    print(user1_channel_name)
                    print(user2_channel_name)
                    await self.channel_layer.send(user1_channel_name, {"type": "toss", "toss": toss1, "opponent": user2 })
                    await self.channel_layer.send(user2_channel_name, {"type": "toss", "toss": toss2, "opponent": user1})
            else:
                await self.send(text_data=json.dumps({"toss": "room_full"}))
                return
            

        launch = text_data_json["launch"]
        land = text_data_json["land"]
        sender = text_data_json["sender"]
        swap = text_data_json["swap"]
        
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "game_message", "launch": launch, "land": land, "sender": sender, "swap": swap}
        )

    # Receive message from room group
    async def game_message(self, event):
        launch = event["launch"]
        land = event["land"]
        sender = event["sender"]
        swap = event["swap"]
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"launch": launch, "land": land, "sender": sender, "swap": swap}))

    async def toss(self, event):
        print(event["toss"])
        if event["toss"] == 0 or event["toss"] == 1:
            await self.send(text_data = json.dumps({"toss" : event["toss"], "opponent": event["opponent"]}))


def get_active_players(room_name):
    return Playing_User.objects.filter(room_name=room_name).count()

def add_name(name, room_name, id, channel_name):
    if((Playing_User.objects.filter(username=name, room_name=room_name).exists()) == False):
        Playing_User.objects.create(username=name, room_name=room_name, user_id=id, channel_name=channel_name)

def remove_name(channel_name, room_name):
    active_players = get_active_players(room_name)
    exiting_user = Playing_User.objects.get(channel_name = channel_name, room_name=room_name)
    staying_user_id = 1 if exiting_user.user_id == 2 else 2
    if active_players == 2:
        if exiting_user.user_id == 1:
            staying_user = Playing_User.objects.get(user_id = staying_user_id, room_name=room_name)
            staying_user.user_id = 1
            staying_user.save()

    exiting_user.delete()

def get_channel_name(id, room_name):
    player = Playing_User.objects.get(user_id=id, room_name= room_name)
    return player.channel_name

def get_user_name(id, room_name):
    player = Playing_User.objects.get(user_id=id, room_name= room_name)
    return player.username


    