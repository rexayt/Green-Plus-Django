from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseNotFound, HttpResponse
from django.shortcuts import render, redirect
import json
import requests

def logar(request):
    if request.method == 'POST':
        usuario = request.POST['login']
        senha = request.POST['senha']
        user = authenticate(username=usuario, password=senha)
        print(user)
        if user is not None:
            login(request, user)
            return redirect('home')

    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required(login_url='login')
def home(request):

    return render(request, 'home.html')

@login_required(login_url='login')
def produtos(request):
    
    return render(request, 'produtos.html')

def criarUsuarios(request):
    url='https://rest-node-mztn.onrender.com/django/{"tabela":"Users"}'
    resposta = requests.post(url)
    content = json.loads(resposta.content)
    print(content)
    for item in content:
        usuario = str(item['username'])
        email = str(item['email'])
        senha = str(item['senha'])
        user = User.objects.filter(username=usuario).exists()
        if user == False:
            user = User.objects.create_user(username=usuario, email=email, password=senha)
            user.save()
    return HttpResponseNotFound(request)