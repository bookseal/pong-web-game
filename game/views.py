from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Player, Game, Tournament, Room
from rest_framework import status

# SPA view
def spa_index(request):
    return render(request, 'game/index.html')

# API views
@api_view(['GET'])
def api_home(request):
    return Response({'message': 'Welcome to the Game API!'})

@api_view(['GET'])
def api_game(request):
    # logic about game
    return Response({'message': 'Game data'})

@api_view(['GET'])
def api_tournament(request):
    # logic about tournament
    return Response({'message': 'Tournament data'})

@api_view(['GET'])
def api_room_list(request):
    rooms = Room.objects.all()
    data = [{'id': room.id, 'name': room.name, 'current_players': room.current_players, 'max_players': room.max_players} for room in rooms]
    return Response(data)

@api_view(['POST'])
def api_create_room(request):
    name = request.data.get('name')
    max_players = request.data.get('max_players', 2)
    if name:
        room = Room.objects.create(name=name, max_players=max_players)
        return Response({'id': room.id, 'name': room.name, 'current_players': room.current_players, 'max_players': room.max_players}, status=status.HTTP_201_CREATED)
    return Response({'error': 'Room name is required'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def api_join_room(request, room_id):
    try:
        room = Room.objects.get(id=room_id)
        if room.current_players < room.max_players:
            room.current_players += 1
            room.save()
            return Response({'message': f'Joined room {room.name}'})
        else:
            return Response({'error': 'Room is full'}, status=status.HTTP_400_BAD_REQUEST)
    except Room.DoesNotExist:
        return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def create_game(request):
    # Logic to create a new game
    return Response({'message': 'New game created'})

@api_view(['POST'])
def join_tournament(request):
    # Logic to join a tournament
    return Response({'message': 'Joined tournament'})
