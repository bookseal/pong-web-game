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
     const homeLink = document.getElementById("homeLink");

    // SPA 방식으로 루트 URL로 이동
    homeLink.addEventListener("click", function(event) {
        event.preventDefault(); // 기본 동작 방지
        // SPA 루트 이동 로직 추가 (예: 페이지 변경 또는 컴포넌트 로드)
        // 예시: mainContent.innerHTML = "Root content loaded...";
        console.log("Navigated to root URL");
        // 루트 콘텐츠 로드 함수를 호출하거나 페이지 상태를 변경
        loadRootContent();
    });

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

function loadRootContent() {
    fetch('/')
    .then(response => response.text())
    .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const content = doc.getElementById('mainContent');
        if (content) {
            document.getElementById('mainContent').innerHTML = content.innerHTML;
        } else {
            console.error('Main content not found in the fetched HTML');
        }
		// URL을 홈으로 변경
		history.pushState(null, '', '/');
        // 필요한 경우 추가 스크립트 실행
        if (typeof init === 'function') {
            init();
        }
        if (typeof animate === 'function') {
            animate();
        }
    })
    .catch(error => {
        console.error('Error loading root content:', error);
    });
}