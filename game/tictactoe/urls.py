from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    # path('online', views.online, name='online'),
    path('game', views.game, name='game'),
    path('gamedata', views.gamedata, name='gamedata-post'),
    path('gamedata/<str:lobby_id>', views.gamedata, name='gamedata')
]