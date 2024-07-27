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

function logout() {
    const csrftoken = getCookie('csrftoken');

    fetch('/logout/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            console.log('Logout successful');
            // Redirect to login page or home page
            window.location.href = '/login/';
        } else {
            console.error('Logout failed');
            // Handle logout failure (e.g., show an error message)
        }
    })
    .catch(error => {
        console.error('Error during logout:', error);
        // Handle error (e.g., show an error message)
    });
}

// Helper function to get CSRF token from cookies
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