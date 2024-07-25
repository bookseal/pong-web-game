document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("42LoginButton").addEventListener("click", function() {
        fetch42AuthUrl();
    });
});

function fetch42AuthUrl() {
    fetch('api/login/')
        .then(response => response.json())
        .then(data => {
            if (data.auth_url) {
                window.location.href = data.auth_url;
            } else {
                console.error('Error fetching auth URL');
            }
        })
        .catch(error => {
            console.error('Error:', error);
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

