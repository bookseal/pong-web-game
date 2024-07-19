let scene, camera, renderer, paddle1, paddle2, ball, light;
let gameStarted = false;
let player1Name, player2Name;
let player1Score = 0, player2Score = 0;
let ballSpeed = {x: 0.05, y: 0.02};

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(800, 600);
    document.getElementById('gameContainer').appendChild(renderer.domElement);

    const paddleGeometry = new THREE.BoxGeometry(0.2, 2, 1);
    const paddleMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
    paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle1.position.x = -7;
    paddle2.position.x = 7;
    scene.add(paddle1);
    scene.add(paddle2);

    const ballGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const ballMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);

    light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 0, 10);
    scene.add(light);

    camera.position.z = 10;

    document.addEventListener('keydown', onKeyDown);
}

function onKeyDown(event) {
    if (!gameStarted) return;

    switch(event.keyCode) {
        case 87: // W key
            if (paddle1.position.y < 4) paddle1.position.y += 0.5;
            break;
        case 83: // S key
            if (paddle1.position.y > -4) paddle1.position.y -= 0.5;
            break;
        case 38: // Up arrow
            if (paddle2.position.y < 4) paddle2.position.y += 0.5;
            break;
        case 40: // Down arrow
            if (paddle2.position.y > -4) paddle2.position.y -= 0.5;
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);
    updateBall();
    renderer.render(scene, camera);
}

function checkPlayer(playerNumber) {
    // const playerName = document.getElementById(`player${playerNumber}Name`).value.trim();
    // if (playerName === '') {
    //     alert('Please enter a player name');
    //     return;
    // }
    //
    // fetch('/api/check_player/', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'X-CSRFToken': getCookie('csrftoken')
    //     },
    //     body: JSON.stringify({ player_name: playerName })
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.status === 'success') {
    //         document.getElementById(`player${playerNumber}Stats`).innerHTML = `
    //             Games Played: ${data.games_played}<br>
    //             Games Won: ${data.games_won}
    //         `;
    //         if (playerNumber === 1) {
    //             player1Name = playerName;
    //         } else {
    //             player2Name = playerName;
    //         }
    //         checkBothPlayersReady();
    //     } else {
    //         alert('Error: ' + data.message);
    //     }
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    //     alert('An error occurred while checking the player');
    // });
}

function checkBothPlayersReady() {
    if (player1Name && player2Name) {
        document.getElementById('startButton').style.display = 'block';
    }
}

// CSRF token 가져오기 함수
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

function updateBall() {
    if (!gameStarted) return;

    ball.position.x += ballSpeed.x;
    ball.position.y += ballSpeed.y;

    if (ball.position.y > 4.5 || ball.position.y < -4.5) {
        ballSpeed.y = -ballSpeed.y;
    }

    if (
        (ball.position.x < -6.8 && ball.position.y < paddle1.position.y + 1 && ball.position.y > paddle1.position.y - 1) ||
        (ball.position.x > 6.8 && ball.position.y < paddle2.position.y + 1 && ball.position.y > paddle2.position.y - 1)
    ) {
        ballSpeed.x = -ballSpeed.x;
    }

    if (ball.position.x < -8) {
        player2Score++;
        checkWinner();
    } else if (ball.position.x > 8) {
        player1Score++;
        checkWinner();
    }
}

function resetBall() {
    ball.position.set(0, 0, 0);
    ballSpeed.x = Math.random() > 0.5 ? 0.1 : -0.1; // 속도를 증가시킴
    ballSpeed.y = (Math.random() - 0.5) * 0.1; // y축 속도도 증가시킴
}

function checkWinner() {
    if (player1Score === 1 || player2Score === 1) {
        gameStarted = false;
        const winner = player1Score === 1 ? player1Name : player2Name;
        displayWinner(winner);
    } else {
        resetBall();
    }
}

function displayWinner(winner) {
    const winnerText = document.createElement('div');
    winnerText.style.position = 'absolute';
    winnerText.style.top = '50%';
    winnerText.style.left = '50%';
    winnerText.style.transform = 'translate(-50%, -50%)';
    winnerText.style.color = 'white';
    winnerText.style.fontSize = '32px';
    winnerText.style.fontWeight = 'bold';
    winnerText.style.textAlign = 'center';
    winnerText.innerHTML = `${winner} wins!<br><br>Click to play again`;
    document.getElementById('gameContainer').appendChild(winnerText);

    document.getElementById('gameContainer').onclick = restartGame;
}

function restartGame() {
    player1Score = 0;
    player2Score = 0;
    resetBall();
    gameStarted = true;
    const winnerText = document.querySelector('#gameContainer div');
    if (winnerText) {
        winnerText.remove();
    }
    document.getElementById('gameContainer').onclick = null;
}

function startGame() {
    player1Name = document.getElementById('player1Name').value.trim();
    player2Name = document.getElementById('player2Name').value.trim();

    if (player1Name === '' || player2Name === '') {
        document.getElementById('nameError').textContent = 'Both player names are required.';
        return;
    }

    if (player1Name === player2Name) {
        document.getElementById('nameError').textContent = 'Player names must be different.';
        return;
    }

    gameStarted = true;
    document.getElementById('startButton').style.display = 'none';
    resetBall(); // 게임 시작 시 공 리셋

    console.log(`Game started with ${player1Name} (W/S keys) and ${player2Name} (Arrow keys)`);
}
init();
animate();

document.getElementById('startButton').addEventListener('click', startGame);

window.addEventListener('resize', function() {
    // We're not changing the size of the renderer here
    // as we've set a fixed size for the game container
});