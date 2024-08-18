document.addEventListener("DOMContentLoaded", function() {
    const qrCodeImg = document.getElementById('qr-code');
    if (qrCodeImg) {
		console.log(gettext('QR code src (first 100 chars):'), qrCodeImg.src.substring(0, 100));  
    } else {
		console.log(gettext('QR code image element not found'));  
    }

    const setupModeElement = document.querySelector('h2');
    if (setupModeElement) {
		console.log(gettext('Setup mode:'), setupModeElement.textContent.includes('Setup'));  
    }

    const verifyButton = document.getElementById("verify2FAButton");
    if (verifyButton) {
        verifyButton.addEventListener("click", function(event) {
            event.preventDefault();
            verify2FA();
        });
    } else {
		console.error(gettext("Verify button not found in the DOM"));  
    }

    const usernameInput = document.getElementById('username');
    if (usernameInput) {
		console.log(gettext("Username from hidden input:"), usernameInput.value);  
    } else {
		console.error(gettext("Username input not found in the DOM"));  
    }
});

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
        alert(gettext("2FA verification successful. Redirecting to main page..."));
        setTimeout(() => {
            console.log(gettext('Redirecting to main page'));
            window.location.href = '/';
        }, 5000);
    } else {
        console.error(gettext('Error verifying OTP:'), data.error);
        alert(gettext(gettext('Invalid OTP. Please try again.')));
    }
}

async function verify2FA() {
    const inputs = validateInputs();
    if (!inputs) return;

    try {
        const response = await send2FAVerificationRequest(inputs.otpCode, inputs.username);
        const data = await response.json();
        handle2FAResponse(response, data);
    } catch (error) {
        console.error(gettext('Error:'), error);
    }
}

function getCsrfToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
        return metaTag.getAttribute('content');
    } else {
		console.error(gettext('CSRF token meta tag not found'));  
        return null;
    }
}