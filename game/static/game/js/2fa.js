document.addEventListener("DOMContentLoaded", function() {
    const verifyButton = document.getElementById("verify2FAButton");
    if (verifyButton) {
        verifyButton.addEventListener("click", function(event) {
            event.preventDefault();
            verify2FA();
        });
    } else {
        console.error("Verify button not found in the DOM");
    }

    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        console.log("Username from hidden input:", usernameInput.value);
    } else {
        console.error("Username input not found in the DOM");
    }
});

async function verify2FA() {
    const otpInput = document.getElementById('otp');
    const usernameInput = document.getElementById('username');

    if (!otpInput || !usernameInput) {
        console.error('OTP or username input not found');
        alert('An error occurred. Please try refreshing the page.');
        return;
    }

    const otpCode = otpInput.value;
    const username = usernameInput.value;
    const csrfToken = getCsrfToken();

    console.log(`Attempting to verify 2FA for user: ${username}`);
    console.log(`OTP Code: ${otpCode}`);
    console.log(`CSRF Token: ${csrfToken}`);

    if (!username) {
        console.error('Username is missing or empty');
        alert('An error occurred. Username is missing.');
        return;
    }

    if (!otpCode) {
        console.error('OTP is missing or empty');
        alert('Please enter the OTP.');
        return;
    }

    const requestBody = {
        otp_code: otpCode,
        username: username
    };
    console.log('Request body:', JSON.stringify(requestBody));

    try {
        console.log('Sending request to /verify_2fa/');
        const response = await fetch('/verify_2fa/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(requestBody),
            credentials: 'include'
        });

        console.log(`Response status: ${response.status}`);
        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok) {
            console.log('2FA verification successful');

            const messageElement = document.getElementById('2fa-message');
            const setupElement = document.getElementById('2fa-setup');
            if (messageElement && setupElement) {
                messageElement.style.display = 'block';
                setupElement.style.display = 'none';
            } else {
                console.error('2FA message or setup element not found');
            }

            setTimeout(() => {
                console.log('Redirecting to main page');
                window.location.href = '/';
            }, 2000);
        } else {
            console.error('Error verifying OTP:', data.error);
            alert('Invalid OTP. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

function getCsrfToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
        return metaTag.getAttribute('content');
    } else {
        console.error('CSRF token meta tag not found');
        return null;
    }
}