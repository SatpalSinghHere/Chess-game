from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.urls import reverse

# Create your views here.

def signup(request):
    message = ""
    if request.method=='POST':
        name = request.POST.get('name')
        pwd1 = request.POST.get('password1')
        pwd2 = request.POST.get('password2')

        if User.objects.filter(username=name).exists():
            message = "Username already exists"
            print(message)
        else:
            if(pwd1==pwd2):
                print(name, pwd1)
                user = User.objects.create_user(username=name, password=pwd1)
                user.save()
                return redirect('signup:login')            

            else:
                print("Password not matched")
                message = "Password not matched"
        
    return render(request, "signup/signup.html", {
        'message': message
    })

def login(request, message=''):
    
    if request.method=='POST':
        print('checking credentials')
        name = request.POST.get('player_name')
        pwd = request.POST.get('password')
        print(name, pwd)
        
        if User.objects.filter(username=name).exists():
            user = User.objects.get(username=name)
            if user.check_password(pwd):
                print('valid credentials')
                return redirect(reverse('signup:home', kwargs={'username': name}))
            else:
                print('invalid credentials')
                message = "Invalid Credentials"
                return redirect('signup:login', message=message)
        else:
            message = "This Username does not exist"
            return redirect('signup:login', message=message)

    return render(request, "signup/login.html", {
        'message': message
    })

def home(request, username):
    return render(request, "signup/home.html", {
        'username': username
    })

def room_full(request):
    return render(request, "signup/room_full.html", )