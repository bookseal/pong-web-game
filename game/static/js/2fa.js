// static/js/2fa.js

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("verify2FAButton").addEventListener("click", function() {
        verify2FA();
    });
});

async function verify2FA() {
    const otpCode = document.getElementById('otp').value;
    const csrfToken = getCsrfToken();

    try {
        const response = await fetch('/verify_2fa/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ otp_code: otpCode }),
            credentials: 'include'
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('2fa-message').style.display = 'block';
            document.getElementById('2fa-setup').style.display = 'none';
            setTimeout(() => {
                window.close();
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
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}