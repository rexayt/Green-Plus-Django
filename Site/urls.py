from django.contrib import admin
from django.urls import path, include
import Site.views

urlpatterns = [
    path('', Site.views.home, name='home'),
    path('login/', Site.views.logar, name='login'),
    path('produtos/', Site.views.produtos, name='produtos'),
    path('aquelela/', Site.views.criarUsuarios, name='usuarios'),
    path('logout', Site.views.logout_view, name='logout'),
]
