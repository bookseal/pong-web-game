document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("42LoginButton").addEventListener("click", function() {
        fetch42AuthUrl();
    });
});

function fetch42AuthUrl() {
    fetch('login/')
        .then(response => response.json())
        .then(data => {
            // console.log('Auth URL data:', data);  // 추가된 로그
			console.log(gettext('Auth URL data:'), data);  // 수정: 번역 함수 사용
            if (data.auth_url) {
                window.location.href = data.auth_url;
            } else {
                // console.error('Error fetching auth URL');
				console.error(gettext('Error fetching auth URL'));  // 수정: 번역 함수 사용
            }
        })
        .catch(error => {
            // console.error('Error:', error);
			console.error(gettext('Error:'), error);  // 수정: 번역 함수 사용
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

