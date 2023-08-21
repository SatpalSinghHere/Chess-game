from django.urls import path
from . import views

app_name = 'game'
urlpatterns = [
    path('<str:room_name>/<str:username>', views.game, name='game'),
]