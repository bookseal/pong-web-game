let tournamentPlayers = [];
let currentMatch = 0;
let winners = [];
// let isTournament = false; // 토너먼트 모드를 확인하는 플래그

function checkTournamentPlayer(playerNumber) {
    const playerName = document.getElementById(`tournamentPlayer${playerNumber}Name`).value;

    fetch(`/check_player/${playerName}/`)
        .then(response => response.json())
        .then(data => {
            const statsElement = document.getElementById(`tournamentPlayer${playerNumber}Stats`);
            if (data.error) {
                // statsElement.innerText = `Error: No user found`;
				statsElement.innerText = gettext('Error: No user found');  // 수정: 번역 함수 사용
                statsElement.classList.add("error-message");
            } else {
                // statsElement.innerText = `Username: ${data.username}\nGames Played: ${data.games_played}\nGames Won: ${data.games_won}`;
				statsElement.innerText = `${gettext('Username')}: ${data.username}\n${data.games_played}\n${data.games_won}`;  // 수정: 번역 함수 사용
                statsElement.classList.remove("error-message");
            }
        })
        .catch(error => {
            const statsElement = document.getElementById(`tournamentPlayer${playerNumber}Stats`);
            // statsElement.innerText = `Error: ${error}`;
			// statsElement.innerText = gettext('Error: ') + error;  // 수정: 번역 함수 사용
            statsElement.classList.add("error-message");
        });
}

function startTournament() {
    tournamentPlayers = [];

    // Check if all player names are provided
    for (let i = 1; i <= 4; i++) {
        const playerName = document.getElementById(`tournamentPlayer${i}Name`).value.trim();
        if (playerName === '') {
            // document.getElementById('tournamentError').textContent = 'All player names are required.';
			document.getElementById('tournamentError').textContent = gettext('All player names are required.');  // 수정: 번역 함수 사용
            return false;
        }
        tournamentPlayers.push(playerName);
    }

    // Check if all player names are unique
    if (new Set(tournamentPlayers).size !== tournamentPlayers.length) {
        // document.getElementById('tournamentError').textContent = 'All player names must be different.';
		document.getElementById('tournamentError').textContent = gettext('All player names must be different.');  // 수정: 번역 함수 사용
        return false;
    }

    // If we've reached this point, all checks have passed
    isTournament = true; // Start tournament mode
    currentMatch = 0;
    winners = [];
    document.getElementById('tournamentError').textContent = ''; // Clear any previous error messages
    return true;
}

function startNextMatch() {
    if (currentMatch < 2) {
        const player1 = tournamentPlayers[currentMatch * 2];
        const player2 = tournamentPlayers[currentMatch * 2 + 1];
        startTournamentGame(player1, player2);
    } else if (currentMatch === 2) {
        startTournamentGame(winners[0], winners[1]);
    } else {
        displayTournamentWinner(winners[2]);
    }
}

function startTournamentGame(player1, player2) {
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
    // winnerText.innerHTML = `Tournament Winner: ${winner}!<br><br>Click to start a new tournament`;
	// winnerText.innerHTML = interpolate(gettext('Tournament Winner: %s!<br><br>Click to start a new tournament'), [winner]);  // 수정: 번역 함수 사용
	winnerText.innerHTML = gettext('Tournament Winner: %s!<br><br>Click to start a new tournament'), [winner];  // 수정: 번역 함수 사용
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
        if (startTournament()) {
            tournamentModal.hide();
            startNextMatch();
        }
        // If startTournament() returns false, the modal will stay open
    });
});