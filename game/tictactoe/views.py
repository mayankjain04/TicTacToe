import json
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, request, JsonResponse
from .models import Game
from django.views.decorators.csrf import csrf_exempt


def index(request):
    return render(request, 'game/index.html')

def game(request):
    return HttpResponseRedirect('index')

@csrf_exempt
def gamedata(request, lobby_id):
    # this is when a client wants to access or create a lobby
    if request.method == 'GET':
        # data = {
        #     'lobby_id':lobby_id,
        #     'player_1':None,
        #     'player_2':None,
        #     'currentTurn':0,
        #     'moves':[None, None, None, None, None, None, None, None, None]
        # }
        game, created = Game.objects.update_or_create(lobby_id=lobby_id)
        return JsonResponse({'success':f'Lobby {lobby_id} {'created' if created else 'updated'} successfully', 'gameInfo':game.gameInfo}, status=201)
    # this is when the client makes a post request to create/update a lobby
    if request.method == 'POST':
        data = json.loads(request.body)
        lobby = get_object_or_404(Game, lobby_id=lobby_id)
        # if (lobby_id==''):
        #     return JsonResponse({error:'The lobby named {lobby_id} does not exist!'},
        #      status=404)
        lobby.gameInfo = data
        lobby.save()
        return JsonResponse({'success': f'Lobby {lobby_id} updated successfully'}, status=200)

