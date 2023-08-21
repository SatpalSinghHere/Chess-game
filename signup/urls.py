from django.urls import path
from . import views

app_name="signup"
urlpatterns=[
    path('signup/', views.signup, name="signup"),
    path('<message>', views.login, name="login"),
    path('', views.login, name="login"),
    path('home/<username>', views.home, name="home"),
    path('home/', views.home, name="home"),
    path('room_full/', views.room_full, name="room_full"),
]