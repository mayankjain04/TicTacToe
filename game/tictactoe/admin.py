from django.contrib import admin

# Register your models here.
from .models import Game

class GameView(admin.ModelAdmin):
    list_display = ('id', 'lobby_id', 'gameInfo')

admin.site.register(Game, GameView)