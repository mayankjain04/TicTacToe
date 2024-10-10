import json
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, request, JsonResponse
from .models import Game
from django.views.decorators.csrf import csrf_exempt


def index(request):
    return render(request, 'game/index.html')

@csrf_exempt
def creategame(request, lobby_id):
    # this is when a client wants to update or create a lobby
    if request.method == 'POST':
        # data = {
        #     'lobby_id':lobby_id,
        #     'player_1':None,
        #     'player_2':None,
        #     'currentTurn':0,
        #     'moves':[None, None, None, None, None, None, None, None, None]
        # }
        data = json.loads(request.body)
        game, created = Game.objects.update_or_create(lobby_id=lobby_id, gameInfo=data)
        return JsonResponse({'success':f'Lobby {lobby_id} {'created' if created else 'updated'} successfully', 'gameInfo':game.gameInfo}, status=201)


@csrf_exempt
def gamedata(request, lobby_id):
    # this is when the client makes a post request to create/update a lobby
    if request.method == 'POST':
        data = json.loads(request.body)
        lobby = get_object_or_404(Game, lobby_id=lobby_id)
        # this line is for adding the player_2 name, usually a request from JoinPath
        if data.get('player_2'):
            lobby.gameInfo['player_2'] = data.get('player_2', '')
        # this line updates the database when a player makes a move
        if data.get('currentTurn'):
            lobby.gameInfo['moves'][data.get('index')] = data.get('playermark', '?')
            lobby.gameInfo['currentTurn'] = data.get('currentTurn')
        lobby.save()
        return JsonResponse({'success': f'Lobby {lobby_id} updated successfully', 'gameInfo':lobby.gameInfo}, status=200)