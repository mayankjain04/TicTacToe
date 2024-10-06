from django.shortcuts import render
from django.http import HttpResponseRedirect, request, JsonResponse

def index(request):
    return render(request, 'game/index.html')

def game(request):
    return HttpResponseRedirect('index')

def gamedata(request, lobby_id):
    if request.method == 'GET':
        data = {
            'lobby_id':lobby_id,
            'player_1':None,
            'player_2':None,
            'currentTurn':0,
            'moves':[]
        }
        return JsonResponse(data)
