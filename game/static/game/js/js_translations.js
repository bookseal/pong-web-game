const gettext = (function() {
    const translations = {
        'en': {
            'Player 1': 'Player 1',
            'Player 2': 'Player 2',
            'Player 3': 'Player 3',
            'Player 4': 'Player 4',
            'Start Game': 'Start Game',
            'Start Game for Beginner': 'Start Game for Beginner',
            'Both player names are required.': 'Both player names are required.',
            'Player names must be different.': 'Player names must be different.',
            'Create New Player': 'Create New Player',
            'Tournament': 'Tournament',
            'Logout': 'Logout',
            'Username': 'Username',
            'Games Played': 'Games Played',
            'Games Won': 'Games Won',
            'Create': 'Create',
            'Start Tournament': 'Start Tournament',
            'Close': 'Close',
            'Enter name': 'Enter name',
            'Confirm': 'Confirm',
            // Add more translations as needed
        },
        'ko': {
            'Player 1': '플레이어 1',
            'Player 2': '플레이어 2',
            'Player 3': '플레이어 3',
            'Player 4': '플레이어 4',
            'Start Game': '게임 시작',
            'Start Game for Beginner': '초보자용 게임 시작',
            'Create New Player': '새 플레이어 생성',
            'Tournament': '토너먼트',
            'Logout': '로그아웃',
            'Username': '사용자 이름',
            'Games Played': '플레이한 게임',
            'Games Won': '이긴 게임',
            'Create': '생성',
            'Start Tournament': '토너먼트 시작',
            'Close': '닫기',
            'Enter name': '이름 입력',
            'Confirm': '확인',
            'Error: No user found': '오류: 사용자를 찾을 수 없습니다',
            'Both player names are required.': '두 플레이어의 이름이 모두 필요합니다.',
            'Player names must be different.': '플레이어 이름은 서로 달라야 합니다.',
            'Player 1 (%s) does not exist.': '플레이어 1 (%s)가 존재하지 않습니다.',
            'Player 2 (%s) does not exist.': '플레이어 2 (%s)가 존재하지 않습니다.',
            'Game started with %s (W/S keys) and %s (Arrow keys)': '%s (W/S 키)와 %s (화살표 키)로 게임 시작',
            'All player names are required.': '모든 플레이어 이름이 필요합니다.',
            'All player names must be different.': '모든 플레이어 이름은 서로 달라야 합니다.',
            "Tournament Winner: %s!<br><br>Click to start a new tournament": "토너먼트 우승자: <br><br>클릭하여 새 토너먼트 시작",
            'Username is missing or empty': '사용자 이름이 누락되었거나 비어 있습니다.',
            'An error occurred. Username is missing.': '오류가 발생했습니다. 사용자 이름이 누락되었습니다.',
            'OTP is missing or empty': 'OTP가 누락되었거나 비어 있습니다.',
            'Please enter the OTP.': 'OTP를 입력하세요.',
            'Invalid OTP. Please try again.': '잘못된 OTP입니다. 다시 시도하세요.',
            'An error occurred. Please try again.': '오류가 발생했습니다. 다시 시도하세요.',
            'An error occurred. Please try refreshing the page.': '오류가 발생했습니다. 페이지를 새로 고침하세요.',
            'API request failed': 'API 요청 실패',
            'Username is required': '사용자 이름이 필요합니다',
            'Player created successfully': '플레이어가 성공적으로 생성되었습니다',
            "Navigated to root URL": "루트 URL로 이동",
            '%s wins!' : '%s 승리!',
            '%s wins!<br><br>Click to play again': '%s 승리!<br><br>다시 플레이하려면 클릭하세요',
        },
        'fr': {
            'Player 1': 'Joueur 1',
            'Player 2': 'Joueur 2',
            'Player 3': 'Joueur 3',
            'Player 4': 'Joueur 4',
            'Start Game': 'Commencer la partie',
            'Start Game for Beginner': 'Commencer la partie pour débutant',
            'Create New Player': 'Créer un nouveau joueur',
            'Tournament': 'Tournoi',
            'Logout': 'Déconnexion',
            'Username': "Nom d'utilisateur",
            'Games Played': 'Parties jouées',
            'Games Won': 'Parties gagnées',
            'Create': 'Créer',
            'Start Tournament': 'Commencer le tournoi',
            'Close': 'Fermer',
            'Enter name': 'Entrez le nom',
            'Confirm': 'Confirmer',
            'Error: No user found': 'Erreur : Aucun utilisateur trouvé',
            'Both player names are required.': 'Les noms des deux joueurs sont requis.',
            'Player names must be different.': 'Les noms des joueurs doivent être différents.',
            'Player 1 (%s) does not exist.': 'Le joueur 1 (%s) nexiste pas.',
            'Player 2 (%s) does not exist.': 'Le joueur 2 (%s) nexiste pas.',
            'Game started with %s (W/S keys) and %s (Arrow keys)': 'Partie commencée avec %s (touches W/S) et %s (touches fléchées)',
            'All player names are required.': 'Tous les noms des joueurs sont requis.',
            'All player names must be different.': 'Tous les noms des joueurs doivent être différents.',
            "Tournament Winner: %s!<br><br>Click to start a new tournament": "Vainqueur du tournoi : !<br><br>Cliquez pour commencer un nouveau tournoi",
            'Username is missing or empty': "Le nom d'utilisateur est manquant ou vide",
            'An error occurred. Username is missing.': "Une erreur s'est produite. Le nom d'utilisateur est manquant.",
            'OTP is missing or empty': 'Le OTP est manquant ou vide',
            'Please enter the OTP.': 'Veuillez entrer le OTP.',
            'Invalid OTP. Please try again.': 'OTP invalide. Veuillez réessayer.',
            'An error occurred. Please try again.': "Une erreur s'est produite. Veuillez réessayer.",
            'An error occurred. Please try refreshing the page.': "Une erreur s'est produite. Veuillez essayer de rafraîchir la page.",
            'API request failed': "La requête API a échoué",
            'Username is required': "Le nom d'utilisateur est requis",
            'Player created successfully': 'Joueur créé avec succès',
            "Navigated to root URL": "Navigation vers l'URL racine",
            '%s wins!' : '%s gagne !',
            '%s wins!<br><br>Click to play again': '%s gagne !<br><br>Cliquez pour jouer à nouveau',
            }
    };

    return function(text) {
        const lang = document.documentElement.lang || 'en';
        console.log("lang: ", lang);
        console.log("text: ", text);
        console.log("translations[lang]: ", translations[lang]);
        console.log("translations[lang][text]: ", translations[lang][text]);
        console.log("translations[lang] && translations[lang][text]: ", translations[lang] && translations[lang][text]);
        return (translations[lang] && translations[lang][text]) || text;
    };
})();