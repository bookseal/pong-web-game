let tournamentPlayers = [];
let currentMatch = 0;
let winners = [];
let isTournament = false; // 토너먼트 모드를 확인하는 플래그

function checkTournamentPlayer(playerNumber) {
    const playerName = document.getElementById(`tournamentPlayer${playerNumber}Name`).value;

    fetch(`/check_player/${playerName}/`)
        .then(response => response.json())
        .then(data => {
            const statsElement = document.getElementById(`tournamentPlayer${playerNumber}Stats`);
            if (data.error) {
                statsElement.innerText = `Error: No user found`;
                statsElement.classList.add("error-message");
            } else {
                statsElement.innerText = `Username: ${data.username}\nGames Played: ${data.games_played}\nGames Won: ${data.games_won}`;
                statsElement.classList.remove("error-message");
            }
        })
        .catch(error => {
            const statsElement = document.getElementById(`tournamentPlayer${playerNumber}Stats`);
            statsElement.innerText = `Error: ${error}`;
            statsElement.classList.add("error-message");
        });
}

function startTournament() {
    tournamentPlayers = [];
    isTournament = true; // 토너먼트 모드 시작
    for (let i = 1; i <= 4; i++) {
        const playerName = document.getElementById(`tournamentPlayer${i}Name`).value.trim();
        if (playerName === '') {
            document.getElementById('tournamentError').textContent = 'All player names are required.';
            return;
        }
        tournamentPlayers.push(playerName);
    }

    if (new Set(tournamentPlayers).size !== tournamentPlayers.length) {
        document.getElementById('tournamentError').textContent = 'All player names must be different.';
        return;
    }

    currentMatch = 0;
    winners = [];
    startNextMatch();
}

function startNextMatch() {
    if (currentMatch < 2) {
        const player1 = tournamentPlayers[currentMatch * 2];
        const player2 = tournamentPlayers[currentMatch * 2 + 1];
        startGame(player1, player2);
    } else if (currentMatch === 2) {
        startGame(winners[0], winners[1]);
    } else {
        displayTournamentWinner(winners[2]);
    }
}

function startGame(player1, player2) {
    // Update the game UI with the current players
    document.getElementById('player1Name').value = player1;
    document.getElementById('player2Name').value = player2;

    // Reset the game state
    restartGame();

    // Start the game
    gameStarted = true;
}

function displayTournamentWinner(winner) {
    isTournament = false; // 토너먼트 모드 종료
    const winnerText = document.createElement('div');
    winnerText.style.position = 'absolute';
    winnerText.style.top = '50%';
    winnerText.style.left = '50%';
    winnerText.style.transform = 'translate(-50%, -50%)';
    winnerText.style.color = 'white';
    winnerText.style.fontSize = '32px';
    winnerText.style.fontWeight = 'bold';
    winnerText.style.textAlign = 'center';
    winnerText.innerHTML = `Tournament Winner: ${winner}!<br><br>Click to start a new tournament`;
    document.getElementById('gameContainer').appendChild(winnerText);

    document.getElementById('gameContainer').onclick = () => {
        winnerText.remove();
        document.getElementById('gameContainer').onclick = null;
        const tournamentModal = new bootstrap.Modal(document.getElementById('tournamentModal'));
        tournamentModal.show();
    };
}



document.addEventListener("DOMContentLoaded", function() {
    const tournamentModal = new bootstrap.Modal(document.getElementById('tournamentModal'));

    document.getElementById("tournamentButton").addEventListener("click", function() {
        tournamentModal.show();
    });

    document.getElementById("startTournamentButton").addEventListener("click", function() {
        startTournament();
        tournamentModal.hide();
    });
});