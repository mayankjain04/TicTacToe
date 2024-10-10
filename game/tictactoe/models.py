from django.db import models

class Game(models.Model):
    lobby_id = models.CharField(max_length=64, blank=False, null=False)
    gameInfo = models.JSONField(encoder=None, blank=True, null=True, default=dict)
    def __str__(self):
        return f"{self.lobby_id}"