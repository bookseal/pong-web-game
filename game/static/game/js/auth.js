// auth.js

// JWT 토큰을 로컬 스토리지에 저장
function saveTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
}

// JWT 토큰을 로컬 스토리지에서 가져오기
function getAccessToken() {
    return localStorage.getItem('accessToken');
}

function getRefreshToken() {
    return localStorage.getItem('refreshToken');
}

// CSRF 토큰 가져오기
function getCsrfToken() {
    // 먼저 meta 태그에서 CSRF 토큰을 찾습니다
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
        return metaTag.getAttribute('content');
    }

    // meta 태그가 없으면 hidden input 필드에서 찾습니다
    const csrfInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
    if (csrfInput) {
        return csrfInput.value;
    }

    // 둘 다 없으면 쿠키에서 찾습니다
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') {
            return value;
        }
    }

    console.error('CSRF token not found');
    return null;
}
function apiRequest(url, method = 'GET', body = null) {
    const csrfToken = getCsrfToken();

    console.log('API Request URL:', url);
    console.log('HTTP Method:', method);
    console.log('CSRF Token:', csrfToken ? 'Present' : 'Not found');

    let headers = {
        'Content-Type': 'application/json',
    };

    if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
    }

    console.log('Request Headers:', headers);

    const options = {
        method,
        headers,
        credentials: 'include'  // This ensures cookies are sent with the request
    };

    if (body) {
        options.body = JSON.stringify(body);
        console.log('Request Body:', body);
    }

    return fetch(url, options)
        .then(response => {
            console.log('Response Status:', response.status);
            console.log('Response OK:', response.ok);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response Data:', data);
            return data;
        })
        .catch(error => {
            console.error('API Request Error:', error);
            throw error;
        });
}
// 액세스 토큰 갱신
async function refreshAccessToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        return null;
    }

    try {
        const response = await fetch('/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({ refresh: refreshToken }),
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            saveTokens(data.access, refreshToken);
            return data.access;
        } else {
            // 리프레시 토큰도 만료된 경우
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return null;
        }
    } catch (error) {
        // console.error('Token refresh failed:', error);
		console.error(gettext('Token refresh failed:'), error);  // 수정: 번역 함수 사용
        return null;
    }
}
