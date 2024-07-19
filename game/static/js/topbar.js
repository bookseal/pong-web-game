// topbar.js

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginButton").addEventListener("click", function() {
        login();
    });

    document.getElementById("tournamentButton").addEventListener("click", function() {
        tournament();
    });

    document.getElementById("createPlayerForm").addEventListener("submit", function(event) {
        event.preventDefault();
        addPlayer();
    });
});

function login() {
    // 로그인 기능 구현 예정
    console.log("Login button clicked");
}

function tournament() {
    // 토너먼트 기능 구현 예정
    console.log("Tournament button clicked");
}

function addPlayer() {
    const username = document.getElementById("username").value;
    const gamesPlayed = document.getElementById("gamesPlayed").value;
    const gamesWon = document.getElementById("gamesWon").value;

    fetch('/add_player/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            username: username,
            games_played: gamesPlayed,
            games_won: gamesWon
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            alert('Player created successfully');
            document.getElementById("createPlayerForm").reset();
            const createPlayerModal = bootstrap.Modal.getInstance(document.getElementById('createPlayerModal'));
            createPlayerModal.hide();
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
