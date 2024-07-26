from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.conf import settings
from django.http import JsonResponse, HttpResponse
import json
import requests
import logging
from django.contrib.auth import get_user_model, login, logout as django_logout
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from .models import Player

User = get_user_model()
logger = logging.getLogger(__name__)

def hello_world(request):
    return HttpResponse("Hello, World!2")

@api_view(['GET'])
@permission_classes([AllowAny])
def index(request):
    try:
        logger.info("index view called")  # 로그 출력
        # JWT 인증을 통해 사용자 정보 가져오기
        jwt_auth = JWTAuthentication()
        user_auth = jwt_auth.authenticate(request)

        if user_auth is None:
            logger.info("User is not authenticated, redirecting to login")
            return render(request, 'login.html')

        user, token = user_auth

        # 사용자 정보와 함께 페이지 렌더링
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        }
        logger.info(f"User {user.username} authenticated successfully")
        return render(request, 'game/index.html', {'user_data': user_data})

    except AuthenticationFailed as e:
        logger.error(f"Authentication failed: {str(e)}")
        return render(request, 'login.html')

    except Exception as e:
        logger.exception(f"Unexpected error: {str(e)}")
        return render(request, 'login.html')

# Protected view
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({'message': 'This is a protected view'})

# Add player
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

# Check player
def check_player(request, player_name):
    try:
        player = get_object_or_404(Player, username=player_name)
        data = {
            'username': player.username,
            'games_played': player.games_played,
            'games_won': player.games_won,
        }
    except:
        data = {'error': 'No user found'}
    return JsonResponse(data)

# Update winner
@csrf_exempt
def update_winner(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            winner_name = data.get('winner')
            loser_name = data.get('loser')

            winner = Player.objects.get(username=winner_name)
            loser = Player.objects.get(username=loser_name)

            winner.games_won += 1
            winner.games_played += 1
            loser.games_played += 1

            winner.save()
            loser.save()

            response_data = {
                'winner': {
                    'username': winner.username,
                    'games_played': winner.games_played,
                    'games_won': winner.games_won
                },
                'loser': {
                    'username': loser.username,
                    'games_played': loser.games_played,
                    'games_won': loser.games_won
                }
            }

            return JsonResponse(response_data)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

# Token refresh view
@api_view(['POST'])
@csrf_protect
def token_refresh_view(request):
    try:
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)

        return Response({
            'access': access_token
        }, status=status.HTTP_200_OK)

    except TokenError as e:
        logger.error(f"Token refresh error: {str(e)}")
        return Response({"detail": "Invalid refresh token."}, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        logger.error(f"Unexpected error during token refresh: {str(e)}")
        return Response({"detail": "Token refresh failed."}, status=status.HTTP_400_BAD_REQUEST)

# Auth login view
def auth_login_view(request):
    client_id = settings.CLIENT_ID
    redirect_uri = settings.REDIRECT_URI
    scope = 'public'
    auth_url = f'https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}&response_type=code'
    return JsonResponse({'auth_url': auth_url})

import pyotp
import qrcode
import io
from django.core.files.base import ContentFile
# Callback view
@api_view(['GET'])
@permission_classes([AllowAny])
def callback(request):
    code = request.GET.get('code')
    if not code:
        logger.error("No authorization code provided in callback")
        return redirect('login/')

    try:
        token_url = 'https://api.intra.42.fr/oauth/token'
        data = {
            'grant_type': 'authorization_code',
            'client_id': settings.CLIENT_ID,
            'client_secret': settings.CLIENT_SECRET,
            'code': code,
            'redirect_uri': settings.REDIRECT_URI,
        }
        token_response = requests.post(token_url, data=data)
        token_json = token_response.json()

        if 'access_token' not in token_json:
            logger.error(f"Failed to obtain access token: {token_json}")
            return redirect('login/')

        access_token = token_json['access_token']

        user_url = 'https://api.intra.42.fr/v2/me'
        headers = {'Authorization': f'Bearer {access_token}'}
        user_response = requests.get(user_url, headers=headers)
        user_data = user_response.json()

        if 'login' not in user_data:
            logger.error(f"Failed to obtain user data: {user_data}")
            return redirect('login/')

        user, created = User.objects.get_or_create(
            username=user_data['login'],
            defaults={
                'email': user_data.get('email', ''),
                'first_name': user_data.get('first_name', ''),
                'last_name': user_data.get('last_name', '')
            }
        )

        if not user.is_2fa_enabled:
            otp_secret = pyotp.random_base32()
            user.otp_secret = otp_secret
            user.save()

            totp = pyotp.TOTP(otp_secret)
            qr_url = totp.provisioning_uri(name=user.username, issuer_name="Pong Game")
            qr = qrcode.make(qr_url)
            buffer = io.BytesIO()
            qr.save(buffer, format="PNG")
            qr_image = buffer.getvalue()

            response = render(request, 'callback.html', {'qr_image': qr_image})
            return response

        login(request, user)

        refresh = RefreshToken.for_user(user)

        response = redirect('index')
        response.set_cookie('access_token', str(refresh.access_token), httponly=True, secure=True, samesite='Lax')
        response.set_cookie('refresh_token', str(refresh), httponly=True, secure=True, samesite='Lax')

        # Add tokens to the response for the client to store them
        response['access_token'] = str(refresh.access_token)
        response['refresh_token'] = str(refresh)

        logger.info(f"User {user.username} successfully authenticated and redirected to index")
        return response

    except Exception as e:
        logger.exception(f"Error in callback: {str(e)}")
        return redirect('login/')
@csrf_exempt
@api_view(['POST'])
def verify_2fa(request):
    try:
        otp_code = request.data.get('otp_code')
        user = request.user
        if not user.is_authenticated or not user.otp_secret:
            return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)

        totp = pyotp.TOTP(user.otp_secret)
        if totp.verify(otp_code):
            user.is_2fa_enabled = True
            user.save()
            return Response({'success': 'OTP verified successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        logger.exception(f"Error in verify_2fa: {str(e)}")
        return Response({'error': 'Failed to verify OTP'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Get CSRF token
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ensure_csrf_cookie
def get_csrf_token(request):
    return Response({"detail": "CSRF cookie set"})

# Logout view
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        if request.auth and isinstance(request.auth, RefreshToken):
            try:
                token = request.auth
                token.blacklist()
            except AttributeError:
                pass

        user = request.user
        tokens = OutstandingToken.objects.filter(user_id=user.id)
        for token in tokens:
            BlacklistedToken.objects.get_or_create(token=token)

        django_logout(request)

        request.session['is_authenticated'] = False
        request.session['user_data'] = None
        request.session.flush()

        response = Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        logger.info(f"User {user.username} successfully logged out")
        return response

    except Exception as e:
        logger.error(f"Logout error for user {request.user.username}: {str(e)}")
        return Response({"error": "Failed to logout"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Force logout view
@api_view(['POST'])
def force_logout(request):
    try:
        django_logout(request)
        request.session['is_authenticated'] = False
        request.session['user_data'] = None
        request.session.flush()

        response = Response({"detail": "Forced logout."}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response

    except Exception as e:
        logger.error(f"Forced logout error: {str(e)}")
        return Response({"error": "Failed to force logout"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Reset session view
def reset_session(request):
    request.session['is_authenticated'] = False
    request.session['user_data'] = None
    request.session.flush()

    response = redirect('login')
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response