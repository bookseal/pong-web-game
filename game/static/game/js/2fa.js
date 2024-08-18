document.addEventListener("DOMContentLoaded", function() {
    const qrCodeImg = document.getElementById('qr-code');
    if (qrCodeImg) {
        // console.log('QR code src:', qrCodeImg.src);
		console.log(gettext('QR code src:'), qrCodeImg.src);  // 수정: 번역 함수 사용
        // console.log('QR code src (first 100 chars):', qrCodeImg.src.substring(0, 100));
		console.log(gettext('QR code src (first 100 chars):'), qrCodeImg.src.substring(0, 100));  // 수정: 번역 함수 사용
    } else {
        // console.log('QR code image element not found');
		console.log(gettext('QR code image element not found'));  // 수정: 번역 함수 사용
    }

    const setupModeElement = document.querySelector('h2');
    if (setupModeElement) {
        // console.log('Setup mode:', setupModeElement.textContent.includes('Setup'));
		console.log(gettext('Setup mode:'), setupModeElement.textContent.includes('Setup'));  // 수정: 번역 함수 사용
    }

    const verifyButton = document.getElementById("verify2FAButton");
    if (verifyButton) {
        verifyButton.addEventListener("click", function(event) {
            event.preventDefault();
            verify2FA();
        });
    } else {
        // console.error("Verify button not found in the DOM");
		console.error(gettext("Verify button not found in the DOM"));  // 수정: 번역 함수 사용
    }

    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        // console.log("Username from hidden input:", usernameInput.value);
		console.log(gettext("Username from hidden input:"), usernameInput.value);  // 수정: 번역 함수 사용
    } else {
        // console.error("Username input not found in the DOM");
		console.error(gettext("Username input not found in the DOM"));  // 수정: 번역 함수 사용
    }
});

// 입력 유효성 검사
function validateInputs() {
    const otpInput = document.getElementById('otp');
    const usernameInput = document.getElementById('username');

    if (!otpInput || !usernameInput) {
        console.error(gettext('OTP or username input not found'));
        alert(gettext('An error occurred. Please try refreshing the page.'));
        return null;
    }

    const otpCode = otpInput.value;
    const username = usernameInput.value;

    if (!username) {
        console.error(gettext('Username is missing or empty'));
        alert(gettext('An error occurred. Username is missing.'));
        return null;
    }

    if (!otpCode) {
        console.error(gettext('OTP is missing or empty'));
        alert(gettext('Please enter the OTP.'));
        return null;
    }

    return { otpCode, username };
}

// 2FA 검증 요청 보내기
async function send2FAVerificationRequest(otpCode, username) {
    const csrfToken = getCsrfToken();
    const requestBody = { otp_code: otpCode, username: username };

    console.log(gettext('Attempting to verify 2FA for user:'), username);
    console.log(gettext('OTP Code:'), otpCode);
    console.log(gettext('CSRF Token:'), csrfToken);
    console.log(gettext('Request body:'), JSON.stringify(requestBody));

    const response = await fetch('/verify_2fa/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    });

    console.log(gettext('Response status:'), response.status);
    console.log(gettext('Response headers:'), response.headers);
    console.log(gettext('Cookies after response:'), document.cookie);

    return response;
}

// 응답 처리
function handle2FAResponse(response, data) {
    console.log(gettext('Response data:'), data);

    if (response.ok) {
        console.log(gettext('2FA verification successful'));
        const messageElement = document.getElementById('2fa-message');
        const setupElement = document.getElementById('2fa-setup');
        if (messageElement && setupElement) {
            messageElement.style.display = 'block';
            setupElement.style.display = 'none';
        } else {
            console.error(gettext('2FA message or setup element not found'));
        }
        alert("2FA verification successful. Redirecting to main page...");
        setTimeout(() => {
            console.log(gettext('Redirecting to main page'));
            window.location.href = '/';
        }, 5000);
    } else {
        console.error(gettext('Error verifying OTP:'), data.error);
        alert(gettext('Invalid OTP. Please try again.'));
    }
}

// 메인 verify2FA 함수
async function verify2FA() {
    alert(gettext('Verifying 2FA...'));
    const inputs = validateInputs();
    if (!inputs) return;

    try {
        const response = await send2FAVerificationRequest(inputs.otpCode, inputs.username);
        const data = await response.json();
        handle2FAResponse(response, data);
    } catch (error) {
        console.error(gettext('Error:'), error);
        alert(gettext('An error occurred. Please try again.'));
    }
}

function getCsrfToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
        return metaTag.getAttribute('content');
    } else {
        // console.error('CSRF token meta tag not found');
		console.error(gettext('CSRF token meta tag not found'));  // 수정: 번역 함수 사용
        return null;
    }
}