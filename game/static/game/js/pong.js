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

function checkPlayer(playerNumber) {
    console.log("checkPlayer function called for player", playerNumber); // 추가
    const playerName = document.getElementById(`player${playerNumber}Name`).value;
    console.log("Player name:", playerName); // 추가

    fetch(`/check_player/${playerName}/`)
        .then(response => {
            console.log("Response received:", response); // 추가
            return response.json();
        })
        .then(data => {
            console.log("Data received:", data); // 추가
            const statsElement = document.getElementById(`player${playerNumber}Stats`);
            if (data.error) {
                statsElement.innerText = `Error: No user found`;
                statsElement.classList.add("error-message");
            } else {
                statsElement.innerText =
                    `Username: ${data.username}\nGames Played: ${data.games_played}\nGames Won: ${data.games_won}`;
                statsElement.classList.remove("error-message");
            }
        })
        .catch(error => {
            console.log("Error:", error); // 추가
            const statsElement = document.getElementById(`player${playerNumber}Stats`);
            statsElement.innerText = `Error: ${error}`;
            statsElement.classList.add("error-message");
        });
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

function checkWinner() {
    if (player1Score === 1 || player2Score === 1) {
        gameStarted = false;
        const winner = player1Score === 1 ? player1Name : player2Name;
        const loser = player1Score === 1 ? player2Name : player1Name;
        displayWinner(winner);

        updatePlayerStats(winner, loser);

        // Add this part for tournament logic
        if (currentMatch < 3) {
            winners.push(winner);
            currentMatch++;
            setTimeout(startNextMatch, 3000); // Start next match after 3 seconds
        }
    } else {
        resetBall();
    }
}

function updatePlayerStats(winner, loser) {
    fetch('/update_winner/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            winner: winner,
            loser: loser
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(`Error updating player stats: ${data.error}`);
        } else {
            displayPlayerStats(data.winner, 1);
            displayPlayerStats(data.loser, 2);
        }
    })
    .catch(error => {
        console.error('Error updating player stats:', error);
    });
}

function displayPlayerStats(player, playerNumber) {
    const statsElement = document.getElementById(`player${playerNumber}Stats`);
    statsElement.innerText =
        `Username: ${player.username}\nGames Played: ${player.games_played}\nGames Won: ${player.games_won}`;
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

    if (isTournament) {
        // 토너먼트 중에는 "Click to play again" 메시지를 표시하지 않음
        winnerText.innerHTML = `${winner} wins!`;
    } else {
        winnerText.innerHTML = `${winner} wins!<br><br>Click to play again`;
        document.getElementById('gameContainer').onclick = restartGame;
    }

    document.getElementById('gameContainer').appendChild(winnerText);
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

function resetBall(slow = false) {
    player1Name = document.getElementById('player1Name').value.trim();
    player2Name = document.getElementById('player2Name').value.trim();
    console.log("Player 1 name:", player1Name); // 추가
    console.log("Player 2 name:", player2Name); // 추가

    ball.position.set(0, 0, 0);
    if (slow) {
        ballSpeed.x = Math.random() > 0.5 ? 0.05 : -0.05; // 느린 속도 설정
        ballSpeed.y = (Math.random() - 0.5) * 0.05; // y축 속도도 느리게 설정
    } else {
        ballSpeed.x = Math.random() > 0.5 ? 0.1 : -0.1; // 일반 속도 설정
        ballSpeed.y = (Math.random() - 0.5) * 0.1; // y축 속도도 일반 속도 설정
    }
}

function startGame() {
    player1Name = document.getElementById('player1Name').value.trim();
    player2Name = document.getElementById('player2Name').value.trim();
    console.log("Player 1 name:", player1Name); // 추가
    console.log("Player 2 name:", player2Name); // 추가

    if (player1Name === '' || player2Name === '') {
        document.getElementById('nameError').textContent = 'Both player names are required.';
        return;
    }

    if (player1Name === player2Name) {
        document.getElementById('nameError').textContent = 'Player names must be different.';
        return;
    }

    checkPlayerExistence(player1Name, function(player1Exists) {
        if (!player1Exists) {
            document.getElementById('nameError').textContent = `Player 1 (${player1Name}) does not exist.`;
            return;
        }

        checkPlayerExistence(player2Name, function(player2Exists) {
            if (!player2Exists) {
                document.getElementById('nameError').textContent = `Player 2 (${player2Name}) does not exist.`;
                return;
            }

            // Both players exist, start the game
            gameStarted = true;
            document.getElementById('startButton').style.display = 'none';
            document.getElementById('startBeginnerButton').style.display = 'none';
            resetBall(); // 게임 시작 시 공 리셋

            console.log(`Game started with ${player1Name} (W/S keys) and ${player2Name} (Arrow keys)`);
        });
    });
}

function startGameForBeginner() {
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

    checkPlayerExistence(player1Name, function(player1Exists) {
        if (!player1Exists) {
            document.getElementById('nameError').textContent = `Player 1 (${player1Name}) does not exist.`;
            return;
        }

        checkPlayerExistence(player2Name, function(player2Exists) {
            if (!player2Exists) {
                document.getElementById('nameError').textContent = `Player 2 (${player2Name}) does not exist.`;
                return;
            }

            // Both players exist, start the game for beginners
            gameStarted = true;
            document.getElementById('startButton').style.display = 'none';
            document.getElementById('startBeginnerButton').style.display = 'none';
            resetBall(true); // 게임 시작 시 공 리셋 (느린 속도로)

            console.log(`Beginner game started with ${player1Name} (W/S keys) and ${player2Name} (Arrow keys)`);
        });
    });
}

function checkPlayerExistence(playerName, callback) {
    fetch(`/check_player/${playerName}/`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                callback(false);
            } else {
                callback(true);
            }
        })
        .catch(error => {
            console.error('Error checking player existence:', error);
            callback(false);
        });
}

init();
animate();

document.getElementById('startButton').addEventListener('click', startGame);

window.addEventListener('resize', function() {
    // We're not changing the size of the renderer here
    // as we've set a fixed size for the game container
});