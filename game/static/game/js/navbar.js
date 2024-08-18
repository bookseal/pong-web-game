async function checkAuthStatus() {
    try {
        const response = await fetch('/api/check-auth/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                // JWT 토큰이 있다면 여기에 추가
                // 'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            console.log('User is authenticated:', data.username);
            return true;
        } else {
            console.log('User is not authenticated');
            return false;
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        return false;
    }
}

function addPlayer(modal) {
    const username = document.getElementById("username").value;
    const gamesPlayed = document.getElementById("gamesPlayed").value;
    const gamesWon = document.getElementById("gamesWon").value;

    if (!username) {
        // alert('Username is required');
		alert(gettext('Username is required'));  // 수정: 번역 함수 사용
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
            // alert(`Error: ${data.error}`);
			alert(gettext('Error: ') + data.error);  // 수정: 번역 함수 사용
        } else {
            // alert('Player created successfully');
			alert(gettext('Player created successfully'));  // 수정: 번역 함수 사용
            document.getElementById("createPlayerForm").reset();
            modal.hide();
        }
    })
    .catch(error => {
        // console.error('Error:', error);
		console.error(gettext('Error:'), error);  // 수정: 번역 함수 사용
    });
}


async function logout() {
    try {
        // 로그아웃 요청을 서버로 전송
        const response = await fetch('/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(),  // CSRF 토큰이 필요하다면 추가
            },
            credentials: 'include'  // 쿠키를 함께 전송
        });

        // 응답 상태 확인
        const data = await response.json();

        console.log('Response status:', response.status);
        console.log('Response data:', data);

        if (response.ok) {
            console.log(gettext('Logout successful'));

            // 클라이언트 측 토큰 삭제 (쿠키에 저장된 토큰을 사용할 경우 필요하지 않음)
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            // 로그아웃 후 페이지 새로고침 또는 리다이렉트
            window.location.replace('/login/');
        } else {
            console.error(gettext('Logout failed'), data);
        }
    } catch (error) {
        console.error(gettext('Error during logout:'), error);
    }
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
            // console.error('Main content not found in the fetched HTML');
			console.error(gettext('Main content not found in the fetched HTML'));  // 수정: 번역 함수 사용
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
        // console.error('Error loading root content:', error);
		console.error(gettext('Error loading root content:'), error);  // 수정: 번역 함수 사용
    });
}

document.addEventListener("DOMContentLoaded", function() {
     const homeLink = document.getElementById("homeLink");

    // SPA 방식으로 루트 URL로 이동
    homeLink.addEventListener("click", function(event) {
        event.preventDefault(); // 기본 동작 방지
        // SPA 루트 이동 로직 추가 (예: 페이지 변경 또는 컴포넌트 로드)
        // 예시: mainContent.innerHTML = "Root content loaded...";
        // console.log("Navigated to root URL");
		console.log(gettext("Navigated to root URL"));  // 수정: 번역 함수 사용
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
    checkAuthStatus();
});