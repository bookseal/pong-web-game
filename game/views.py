from django.shortcuts import render
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Player
import json

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def index(request):
    return render(request, 'game/index.html')

@csrf_exempt
def add_player(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            games_played = data.get('games_played', 0)
            games_won = data.get('games_won', 0)

            if not username:
                return JsonResponse({'error': 'Username is required'}, status=400)

            player, created = Player.objects.get_or_create(
                username=username,
                defaults={'games_played': games_played, 'games_won': games_won}
            )

            if not created:
                return JsonResponse({'error': 'Player with this username already exists'}, status=400)

            return JsonResponse({'message': 'Player created successfully'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

