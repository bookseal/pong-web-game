from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.http import JsonResponse, HttpResponse
import json
import requests
from django.contrib.auth import get_user_model, login, logout as django_logout
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.exceptions import TokenError
from .models import Player, CustomUser  # CustomUser 추가
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import logging
from rest_framework_simplejwt.authentication import JWTAuthentication
from .blockchain_utils import record_score, get_scores
from django.utils.translation import gettext as _
from django.shortcuts import redirect
from django.utils import translation
from datetime import datetime, timedelta

import qrcode
import io
User = get_user_model()
logger = logging.getLogger(__name__)

def start_game(request):
    return render(request, 'game/index_spa.html')
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
                # return JsonResponse({'error': 'Username is required'}, status=400)
                return JsonResponse({'error': _('Username is required')}, status=400)

            player, created = Player.objects.get_or_create(
                username=username,
                defaults={'games_played': games_played, 'games_won': games_won}
            )

            if not created:
                # return JsonResponse({'error': 'Player with this username already exists'}, status=400)
                return JsonResponse({'error': _('Player with this username already exists')}, status=400)  # 수정: 번역 함수 적용


            # return JsonResponse({'message': 'Player created successfully'}, status=201)
            return JsonResponse({'message': _('Player created successfully')}, status=201)  # 수정: 번역 함수 적용


        except json.JSONDecodeError:
            # return JsonResponse({'error': 'Invalid JSON data'}, status=400)
            return JsonResponse({'error': _('Invalid JSON data')}, status=400)  # 수정: 번역 함수 적용

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        # return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
        return JsonResponse({'error': _('Invalid HTTP method')}, status=405)  # 수정: 번역 함수 적용


# # Check player
# def check_player(request, player_name):
#     try:
#         player = get_object_or_404(Player, username=player_name)
#         data = {
#             'username': player.username,
#             'games_played': player.games_played,
#             'games_won': player.games_won,
#         }
#     except:
#         # data = {'error': 'No user found'}
#         data = {'error': _('No user found')}  # 수정: 번역 함수 적용

#     return JsonResponse(data)

def check_player(request, player_name):
    try:
        player = get_object_or_404(Player, username=player_name)
        data = {
  			# 'username': _('Username: {}').format(player.username),  # 수정: 번역 함수 사용
            # 'games_played': _('Games Played: {}').format(player.games_played),  # 수정: 번역 함수 사용
            # 'games_won': _('Games Won: {}').format(player.games_won),  # 수정: 번역 함수 사용
            # 'username': player.username,
			# 'games_played': player.games_played,
			# 'games_won': player.games_won,
            'username': _('Username: {}').format(player.username),
            'games_played': _('Games Played: {}').format(player.games_played),
            'games_won': _('Games Won: {}').format(player.games_won),
        }
    except:
        data = {'error': _('No user found')}
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

            # 블록체인에 승자의 점수 기록
            record_score(winner_name, winner.games_won)

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
        # return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
        return JsonResponse({'error': _('Invalid HTTP method')}, status=405)  # 수정: 번역 함수 적용


def score_check_page(request):
    return render(request, 'game/score_check.html')

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

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        # This is an AJAX request from login.js
        return JsonResponse({'auth_url': auth_url})
    else:
        # This is a direct GET request to the login page
        context = {
            'auth_url': auth_url
        }
        return render(request, 'login.html', context)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ensure_csrf_cookie
def get_csrf_token(request):
    return Response({"detail": "CSRF cookie set"})

from django.contrib.auth import logout as auth_logout
# Logout view
@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def logout_view(request):
    try:
        # Check if user is authenticated via session
        if request.user.is_authenticated:
            username = request.user.username
            # Clear the session
            request.session.flush()
            # Logout the user
            auth_logout(request)
        else:
            # If not authenticated via session, check for JWT
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                    username = token['user_id']  # Assuming user_id is stored in the token
                except Exception as e:
                    logger.error(f"Error blacklisting token: {str(e)}")
            else:
                return Response({"detail": "No active login session found."}, status=status.HTTP_400_BAD_REQUEST)

        # Prepare the response
        response = Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)

        # Remove JWT cookies
        response.delete_cookie('access_token', domain=settings.SESSION_COOKIE_DOMAIN, samesite='Lax')
        response.delete_cookie('refresh_token', domain=settings.SESSION_COOKIE_DOMAIN, samesite='Lax')

        logger.info(f"User {username} successfully logged out")
        return response

    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return Response({"detail": "An error occurred during logout."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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


def get_access_token(code):
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
        return None

    access_token = token_json['access_token']
    logger.info(f"Access token obtained: {access_token}")
    return access_token

def get_user_data(access_token):
    user_url = 'https://api.intra.42.fr/v2/me'
    headers = {'Authorization': f'Bearer {access_token}'}
    user_response = requests.get(user_url, headers=headers)
    user_data = user_response.json()

    if 'login' not in user_data:
        logger.error(f"Failed to obtain user data: {user_data}")
        return None

    logger.info(f"User data obtained: ")
    return user_data

def create_or_update_user(user_data):
    user, created = CustomUser.objects.get_or_create(
        username=user_data['login'],
        defaults={
            'email': user_data.get('email', ''),
            'first_name': user_data.get('first_name', ''),
            'last_name': user_data.get('last_name', '')
        }
    )
    logger.info(f"User {user.username} created: {created}")
    return user

import base64

def generate_qr_code(user):
    otp_secret = pyotp.random_base32()
    user.otp_secret = otp_secret
    user.save()
    logger.info(f"OTP secret set for user {user.username}")

    totp = pyotp.TOTP(otp_secret)
    qr_url = totp.provisioning_uri(name=user.username, issuer_name="Pong Game")
    qr = qrcode.make(qr_url)
    buffer = io.BytesIO()
    qr.save(buffer, format="PNG")
    qr_image = base64.b64encode(buffer.getvalue()).decode("utf-8")
    logger.info(f"Generated QR code for user {user.username}")
    logger.info(f"QR code length: {len(qr_image)}")
    logger.info(f"QR code preview: {qr_image[:50]}...")
    return qr_image


@api_view(['GET'])
@permission_classes([AllowAny])
def callback(request):
    code = request.GET.get('code')
    if not code:
        logger.error("No authorization code provided in callback")
        return redirect('login')

    try:
        logger.info("Callback function called")
        access_token = get_access_token(code)
        if not access_token:
            logger.error("Failed to obtain access token")
            return redirect('login')

        user_data = get_user_data(access_token)
        if not user_data:
            logger.error("Failed to obtain user data")
            return redirect('login')

        user = create_or_update_user(user_data)

        logger.info(f"user.is_2fa_enabled: {user.is_2fa_enabled}")
        if not user.is_2fa_enabled:
            qr_image = generate_qr_code(user)
            logger.info(f"QR image generated, length: {len(qr_image)}")
            logger.info(f"QR image preview: {qr_image[:50]}...")
            return render(request, 'callback.html', {
                'qr_image': qr_image,
                'user': user,
                'setup_mode': True
            })
        # User has already set up 2FA, set up session for 2FA verification
        request.session['pending_user_id'] = user.id
        return redirect('verify_2fa')

    except Exception as e:
        logger.exception(f"Error in callback: {str(e)}")
        return redirect('login')

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import HttpRequest
from rest_framework.request import Request
import pyotp
from .models import CustomUser


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def verify_2fa(request):
    if request.method == 'GET':
        user_id = request.session.get('pending_user_id')
        if not user_id:
            logger.error("No pending user found for 2FA verification")
            return redirect('login')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            logger.error(f"User not found for id: {user_id}")
            return redirect('login')

        # If user hasn't set up 2FA yet, generate QR code
        if not user.is_2fa_enabled:
            qr_image = generate_qr_code(user)
            return render(request, 'callback.html', {'qr_image': qr_image, 'user': user, 'setup_mode': True})

        # If user has already set up 2FA, just show the verification form
        return render(request, 'callback.html', {'user': user, 'setup_mode': False})

    if request.method == 'POST':
        otp_code = request.data.get('otp_code')
        username = request.data.get('username')

        if not username:
            logger.error("No username provided for 2FA verification")
            # return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': _('Username is required')}, status=status.HTTP_400_BAD_REQUEST)  # 수정: 번역 함수 적용


        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            logger.error(f"User not found: {username}")
            # return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'error': _('User not found')}, status=status.HTTP_404_NOT_FOUND)  # 수정: 번역 함수 적용


        if not user.otp_secret:
            logger.error(f"OTP secret not set for user: {username}")
            # return Response({'error': 'OTP secret not set'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': _('OTP secret not set')}, status=status.HTTP_400_BAD_REQUEST)  # 수정: 번역 함수 적용


        totp = pyotp.TOTP(user.otp_secret)
        if totp.verify(otp_code):
            logger.info(f"OTP verified successfully for user: {username}")
            login(request, user)
            user.is_2fa_enabled = True
            user.save()

            # Set the verified_2fa flag in the session
            request.session['verified_2fa'] = True
            request.session['user_id'] = user.id

            # Generate new JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # Log JWT token generation
            logger.info(f"JWT tokens generated for user: {username}")
            logger.debug(f"Access token: {access_token[:10]}... (truncated)")

            response = JsonResponse({
                # 'success': 'OTP verified successfully',
                'success': _('OTP verified successfully'),  # 수정: 번역 함수 적용
                'redirect': '/'  # Redirect to index page
            })
            response.set_cookie('access_token', access_token, httponly=True, secure=True, samesite='Lax')
            response.set_cookie('refresh_token', str(refresh), httponly=True, secure=True, samesite='Lax')

            logger.info(f"JWT tokens set in cookies for user: {username}")
            logger.info(f"Redirecting user {username} to index page after successful 2FA verification")

            return response
        else:
            logger.error(f"Invalid OTP for user: {username}")
            # return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': _('Invalid OTP')}, status=status.HTTP_400_BAD_REQUEST)  # 수정: 번역 함수 적용

@api_view(['GET'])
@permission_classes([AllowAny])
def index(request):
    try:
        logger.info("index view called")

        # Check session-based authentication first
        user_id = request.session.get('user_id')
        if user_id:
            user = User.objects.get(id=user_id)
            if request.session.get('verified_2fa'):
                logger.info(f"User {user.username} authenticated via session")
                user_data = {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
                return render(request, 'game/index.html', {'user_data': user_data})

        # If session auth fails, try JWT authentication
        jwt_auth = JWTAuthentication()
        user_auth = jwt_auth.authenticate(request)

        if user_auth is None:
            logger.info("User is not authenticated, redirecting to login")
            return redirect('login')

        user, token = user_auth

        if not user.is_2fa_enabled:
            logger.info(f"User {user.username} has not completed 2FA setup, redirecting to 2FA setup")
            return redirect('verify_2fa')

        if not request.session.get('verified_2fa'):
            logger.info(f"User {user.username} has not verified 2FA for this session, redirecting to 2FA verification")
            return redirect('verify_2fa')

        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        }
        logger.info(f"User {user.username} authenticated successfully via JWT")
        return render(request, 'game/index.html', {'user_data': user_data})

    except AuthenticationFailed as e:
        logger.error(f"Authentication failed: {str(e)}")
        return redirect('login')

    except Exception as e:
        logger.exception(f"Unexpected error: {str(e)}")
        return redirect('login')
    
@api_view(['POST'])
@permission_classes([AllowAny])  # AllowAny로 수정하여 모든 사용자가 접근 가능하도록 함
def reset_otp(request):
    logger.info("reset_otp called")
    try:
        # 임시로 인증 여부를 체크하지 않음
        user = request.user
        if not user.is_authenticated:
            # 비인증 사용자에 대해 임시 사용자 생성
            user = User.objects.get(username=request.data.get('username'))  # 수정: 요청에서 사용자 이름 가져오기
            logger.warning("Temporary user used for unauthenticated request")

        logger.info(f"User {user.username} authenticated for OTP reset")
        
        # 새로운 OTP 비밀키 생성
        otp_secret = pyotp.random_base32()
        logger.info(f"New OTP secret generated: {otp_secret}")

        user.otp_secret = otp_secret
        user.save()
        logger.info(f"OTP secret saved for user {user.username}")

        # 새로운 QR 코드 생성
        totp = pyotp.TOTP(otp_secret)
        qr_url = totp.provisioning_uri(name=user.username, issuer_name="Pong Game")
        qr = qrcode.make(qr_url)
        buffer = io.BytesIO()
        qr.save(buffer, format="PNG")
        qr_image = base64.b64encode(buffer.getvalue()).decode("utf-8")
        logger.info(f"QR code generated for user {user.username}")

        # 세션에 QR 코드와 OTP 비밀키 저장
        request.session['qr_image'] = qr_image
        request.session['otp_secret'] = otp_secret

        return Response({'qr_image': qr_image}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"OTP 재발급 오류: {str(e)}")
        # return Response({"error": "OTP 재발급 실패"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"error": _("OTP reset failed")}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  # 수정: 번역 함수 적용


# verify_otp 함수 추가
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_otp(request):
    logger.info("reset_otp called")
    try:
        username = request.data.get('username')  # 요청에서 사용자 이름 가져오기
        user = User.objects.get(username=username)

        # 새로운 OTP 비밀키 생성
        otp_secret = pyotp.random_base32()
        logger.info(f"New OTP secret generated: {otp_secret}")

        user.otp_secret = otp_secret
        user.save()
        logger.info(f"OTP secret saved for user {user.username}")

        # 새로운 QR 코드 생성
        totp = pyotp.TOTP(otp_secret)
        qr_url = totp.provisioning_uri(name=user.username, issuer_name="Pong Game")
        qr = qrcode.make(qr_url)
        buffer = io.BytesIO()
        qr.save(buffer, format="PNG")
        qr_image = base64.b64encode(buffer.getvalue()).decode("utf-8")
        logger.info(f"QR code generated for user {user.username}")

        # 세션에 QR 코드와 OTP 비밀키 저장
        request.session['qr_image'] = qr_image
        request.session['otp_secret'] = otp_secret

        return Response({'qr_image': qr_image}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"OTP 재발급 오류: {str(e)}")
        # return Response({"error": "OTP 재발급 실패"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"error": _("OTP reset failed")}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  # 수정: 번역 함수 적용


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    logger.info("verify_otp called")
    try:
        otp_code = request.data.get('otp_code')
        username = request.data.get('username')

        if not username:
            logger.error("No username provided for 2FA verification")
            # return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': _('Username is required')}, status=status.HTTP_400_BAD_REQUEST)  # 수정: 번역 함수 적용


        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            logger.error(f"User not found: {username}")
            # return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'error': _('User not found')}, status=status.HTTP_404_NOT_FOUND)  # 수정: 번역 함수 적용


        if not user.otp_secret:
            logger.error(f"OTP secret not set for user: {username}")
            # return Response({'error': 'OTP secret not set'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': _('OTP secret not set')}, status=status.HTTP_400_BAD_REQUEST)  # 수정: 번역 함수 적용


        totp = pyotp.TOTP(user.otp_secret)
        if totp.verify(otp_code):
            logger.info(f"OTP verified successfully for user: {username}")
            login(request, user)
            user.is_2fa_enabled = True
            user.save()

            # Set the verified_2fa flag in the session
            request.session['verified_2fa'] = True
            request.session['user_id'] = user.id

            logger.info(f"User {username} 2FA verification complete")
            # return JsonResponse({'success': 'OTP verified successfully', 'redirect': '/'})
            return JsonResponse({'success': _('OTP verified successfully'), 'redirect': '/'})  # 수정: 번역 함수 적용

        else:
            logger.error(f"Invalid OTP for user: {username}")
            # return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': _('Invalid OTP')}, status=status.HTTP_400_BAD_REQUEST)  # 수정: 번역 함수 적용

    except Exception as e:
        logger.error(f"OTP verification error: {str(e)}")
        # return Response({"error": "OTP verification failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"error": _("OTP verification failed")}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  # 수정: 번역 함수 적용


def get_blockchain_scores(request, player_name):
    try:
        print(f"Attempting to get blockchain scores for player: {player_name}")
        scores = get_scores(player_name)
        print(f"Scores retrieved: {scores}")
        return JsonResponse({'scores': scores})
        # return JsonResponse({'scores': _(scores)})
    except Exception as e:
        print(f"Error in get_blockchain_scores view: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

# def get_blockchain_scores(request, player_name):
#     try:
#         print(f"Attempting to get blockchain scores for player: {player_name}")
#         scores, timestamps = get_scores(player_name)
#         print(f"Scores retrieved: {scores}")
#         formatted_scores = [
#             {
#                 'score': _('Score: {}').format(score),
#                 'time': _('Time: {}').format(datetime.fromtimestamp(timestamp).strftime('%Y.%m.%d %H:%M:%S'))
#             }
#             for score, timestamp in zip(scores, timestamps)
#         ]
#         return JsonResponse({'scores': formatted_scores, 'title': _('Score Record:')})
#     except Exception as e:
#         print(f"Error in get_blockchain_scores view: {str(e)}")
#         return JsonResponse({'error': str(e)}, status=500)



def score_check_page(request):
    return render(request, 'game/score_check.html')


def change_language(request):
    lang = request.GET.get('lang')
    if not lang:
        lang = request.COOKIES.get(settings.LANGUAGE_COOKIE_NAME)
    if not lang:
        lang = settings.LANGUAGE_CODE

    available_languages = [lang_code for lang_code, _ in settings.LANGUAGES]

    if lang in available_languages:
        translation.activate(lang)
    else:
        lang = settings.LANGUAGE_CODE
        translation.activate(lang)

    logger.info(f"Language changed to: {lang}")  # 추가된 로그

    response = redirect(request.META.get('HTTP_REFERER', '/'))

    max_age = 365 * 24 * 60 * 60
    expires = datetime.strftime(datetime.utcnow() + timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
    response.set_cookie(
        settings.LANGUAGE_COOKIE_NAME,
        lang,
        max_age=max_age,
        expires=expires,
        domain=settings.SESSION_COOKIE_DOMAIN,
        secure=settings.SESSION_COOKIE_SECURE or None
    )

    request.session[settings.LANGUAGE_COOKIE_NAME] = lang
    logger.info(f"Language cookie and session updated: {lang}")  # 추가된 로그

    return response