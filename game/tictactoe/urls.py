from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    # api routes
    path('api/create/<str:lobby_id>', views.creategame, name='creategame'),
    path('api/gamedata/<str:lobby_id>', views.gamedata, name='gamedata')
]