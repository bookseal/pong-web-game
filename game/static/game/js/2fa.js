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

async function verify2FA() {
    const otpInput = document.getElementById('otp');
    const usernameInput = document.getElementById('username');

    if (!otpInput || !usernameInput) {
        // console.error('OTP or username input not found');
		console.error(gettext('OTP or username input not found'));  // 수정: 번역 함수 사용
        // alert('An error occurred. Please try refreshing the page.');
		alert(gettext('An error occurred. Please try refreshing the page.'));  // 수정: 번역 함수 사용
        return;
    }

    const otpCode = otpInput.value;
    const username = usernameInput.value;
    const csrfToken = getCsrfToken();

    // console.log(`Attempting to verify 2FA for user: ${username}`);
	console.log(gettext(`Attempting to verify 2FA for user: ${username}`));  // 수정: 번역 함수 사용
    // console.log(`OTP Code: ${otpCode}`);
	console.log(gettext(`OTP Code: ${otpCode}`));  // 수정: 번역 함수 사용
    // console.log(`CSRF Token: ${csrfToken}`);
	console.log(gettext(`CSRF Token: ${csrfToken}`));  // 수정: 번역 함수 사용


    if (!username) {
        // console.error('Username is missing or empty');
		console.error(gettext('Username is missing or empty'));  // 수정: 번역 함수 사용
        // alert('An error occurred. Username is missing.');
		alert(gettext('An error occurred. Username is missing.'));  // 수정: 번역 함수 사용
        return;
    }

    if (!otpCode) {
        // console.error('OTP is missing or empty');
		console.error(gettext('OTP is missing or empty'));  // 수정: 번역 함수 사용
        // alert('Please enter the OTP.');
		alert(gettext('Please enter the OTP.'));  // 수정: 번역 함수 사용
        return;
    }

    const requestBody = {
        otp_code: otpCode,
        username: username
    };
    // console.log('Request body:', JSON.stringify(requestBody));
	console.log(gettext('Request body:'), JSON.stringify(requestBody));  // 수정: 번역 함수 사용

    try {
        // console.log('Sending request to /verify_2fa/');
		console.log(gettext('Sending request to /verify_2fa/'));  // 수정: 번역 함수 사용
        const response = await fetch('/verify_2fa/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(requestBody),
            credentials: 'include'
        });

        // console.log(`Response status: ${response.status}`);
		console.log(gettext(`Response status: ${response.status}`));  // 수정: 번역 함수 사용
        const data = await response.json();
        // console.log('Response data:', data);
		console.log(gettext('Response data:'), data);  // 수정: 번역 함수 사용

        if (response.ok) {
            // console.log('2FA verification successful');
			console.log(gettext('2FA verification successful'));  // 수정: 번역 함수 사용

            const messageElement = document.getElementById('2fa-message');
            const setupElement = document.getElementById('2fa-setup');
            if (messageElement && setupElement) {
                messageElement.style.display = 'block';
                setupElement.style.display = 'none';
            } else {
                // console.error('2FA message or setup element not found');
				console.error(gettext('2FA message or setup element not found'));  // 수정: 번역 함수 사용
            }

            setTimeout(() => {
                // console.log('Redirecting to main page');
				console.log(gettext('Redirecting to main page'));  // 수정: 번역 함수 사용
                window.location.href = '/';
            }, 2000);
        } else {
            // console.error('Error verifying OTP:', data.error);
			console.error(gettext('Error verifying OTP:'), data.error);  // 수정: 번역 함수 사용
            // alert('Invalid OTP. Please try again.');
			alert(gettext('Invalid OTP. Please try again.'));  // 수정: 번역 함수 사용
        }
    } catch (error) {
        // console.error('Error:', error);
		console.error(gettext('Error:'), error);  // 수정: 번역 함수 사용
        // alert('An error occurred. Please try again.');
		alert(gettext('An error occurred. Please try again.'));  // 수정: 번역 함수 사용
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