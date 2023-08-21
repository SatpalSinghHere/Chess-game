from django.shortcuts import render

# Create your views here.

def game(request, room_name, username):
    return render(request, 'game/game.html', {
        'room_name': room_name,
        'username': username
    })