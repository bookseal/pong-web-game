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
        'kr': {
            'Player 1': '플레이어 1',
            'Player 2': '플레이어 2',
            'Player 3': '플레이어 3',
            'Player 4': '플레이어 4',
            'Start Game': '게임 시작',
            'Start Game for Beginner': '초보자용 게임 시작',
            'Both player names are required.': '두 플레이어의 이름이 모두 필요합니다.',
            'Player names must be different.': '플레이어 이름은 서로 달라야 합니다.',
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
            // Add more translations as needed
        },
        'fr': {
            'Player 1': 'Joueur 1',
            'Player 2': 'Joueur 2',
            'Player 3': 'Joueur 3',
            'Player 4': 'Joueur 4',
            'Start Game': 'Commencer le jeu',
            'Start Game for Beginner': 'Commencer le jeu pour débutant',
            'Both player names are required.': 'Les noms des deux joueurs sont requis.',
            'Player names must be different.': 'Les noms des joueurs doivent être différents.',
            'Create New Player': 'Créer un nouveau joueur',
            'Tournament': 'Tournoi',
            'Logout': 'Déconnexion',
            'Username': 'Nom d\'utilisateur',
            'Games Played': 'Parties jouées',
            'Games Won': 'Parties gagnées',
            'Create': 'Créer',
            'Start Tournament': 'Commencer le tournoi',
            'Close': 'Fermer',
            'Enter name': 'Entrez le nom',
            'Confirm': 'Confirmer',
            // Add more translations as needed
        }
    };

    return function(text) {
        const lang = document.documentElement.lang || 'en';
        return (translations[lang] && translations[lang][text]) || text;
    };
})();