function addPlayer(modal) {
    const username = document.getElementById("username").value;
    const gamesPlayed = document.getElementById("gamesPlayed").value;
    const gamesWon = document.getElementById("gamesWon").value;

    if (!username) {
        alert('Username is required');
        return;
    }

    fetch('/add_player/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ username: username, games_played: gamesPlayed, games_won: gamesWon })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(`Error: ${data.error}`);
        } else {
            alert('Player created successfully');
            document.getElementById("createPlayerForm").reset();
            modal.hide();
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
document.addEventListener("DOMContentLoaded", function() {
    const createPlayerModal = new bootstrap.Modal(document.getElementById('createPlayerModal'));

    document.getElementById("createPlayerButton").addEventListener("click", function() {
        createPlayerModal.show();
    });

    document.getElementById("createPlayerForm").addEventListener("submit", function(event) {
        event.preventDefault();
        addPlayer(createPlayerModal);
    });

    document.getElementById("logoutButton").addEventListener("click", function() {
        logout();
    });
});

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

async function logout() {
    try {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        const response = await fetch('/api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
            credentials: 'include'
        });

        if (response.ok) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            console.log('Logout successful');
            window.location.href = 'index';
        } else {
            const errorText = await response.text();
            console.error('Logout failed:', errorText);
            // 401 오류 발생 시 강제 로그아웃 처리
            if (response.status === 401) {
                await fetch('/api/force_logout/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    credentials: 'include'
                });
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = 'index';
            }
        }
    } catch (error) {
        console.error('Logout error:', error);
        // 에러 발생 시에도 로컬 스토리지를 정리하고 로그인 페이지로 이동
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = 'index';
    }
}