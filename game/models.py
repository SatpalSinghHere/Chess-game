from django.db import models

# Create your models here.

class Playing_User(models.Model):
    username = models.CharField(max_length=100)
    room_name = models.CharField(max_length=6)
    user_id = models.IntegerField(default=0)
    channel_name = models.CharField(max_length=500, default='')
    def __str__(self):
        return f'{self.user_id} : {self.username} : {self.room_name} : {self.channel_name}'