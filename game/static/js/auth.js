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
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

// JWT 토큰을 사용하여 API 요청
async function apiRequest(url, method = 'GET', body = null) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`,
        'X-CSRFToken': getCsrfToken()
    };

    const options = {
        method,
        headers,
        credentials: 'include'
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        let response = await fetch(url, options);

        if (response.status === 401) {
            // 토큰이 만료된 경우, 갱신 시도
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                headers.Authorization = `Bearer ${newAccessToken}`;
                response = await fetch(url, { ...options, headers });
            } else {
                // 갱신 실패 시 로그인 페이지로 리다이렉트
                window.location.href = '/api/login';
                return;
            }
        }

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'API request failed');
        }
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// 액세스 토큰 갱신
async function refreshAccessToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        return null;
    }

    try {
        const response = await fetch('/api/token/refresh/', {
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
        console.error('Token refresh failed:', error);
        return null;
    }
}

export { saveTokens, getAccessToken, apiRequest };