function navigateTo(page) {
    const content = document.getElementById('content');
    switch(page) {
        case 'home':
            content.innerHTML = '<h1>Welcome to Pong Game</h1>';
            break;
        case 'rooms':
            showRooms();
            break;
        case 'game':
            content.innerHTML = '<h1>Game</h1><div id="gameCanvas"></div>';
            initGame();
            break;
        case 'tournament':
            content.innerHTML = '<h1>Tournament</h1><p>Tournament feature coming soon!</p>';
            break;
        default:
            content.innerHTML = '<h1>404 - Page Not Found</h1>';
    }
    history.pushState(null, '', '/' + page);
}

function showRooms() {
    let html = `
        <h2>Game Rooms</h2>
        <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Room 1
                <span class="badge bg-primary rounded-pill">1/2</span>
                <button class="btn btn-success btn-sm" onclick="joinRoom(1)">Join</button>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Room 2
                <span class="badge bg-primary rounded-pill">0/2</span>
                <button class="btn btn-success btn-sm" onclick="joinRoom(2)">Join</button>
            </li>
        </ul>
        <button class="btn btn-primary mt-3" onclick="showCreateRoomForm()">Create New Room</button>
    `;
    document.getElementById('content').innerHTML = html;
}

function showCreateRoomForm() {
    let html = `
        <h2>Create New Room</h2>
        <form onsubmit="createRoom(event)">
            <div class="mb-3">
                <label for="roomName" class="form-label">Room Name</label>
                <input type="text" class="form-control" id="roomName" required>
            </div>
            <div class="mb-3">
                <label for="maxPlayers" class="form-label">Max Players</label>
                <input type="number" class="form-control" id="maxPlayers" value="2" min="2" max="4" required>
            </div>
            <button type="submit" class="btn btn-primary">Create Room</button>
        </form>
    `;
    document.getElementById('content').innerHTML = html;
}

function createRoom(event) {
    event.preventDefault();
    alert('Room creation functionality will be implemented soon!');
    showRooms();
}

function joinRoom(roomId) {
    alert('Joining room ' + roomId + '. This functionality will be implemented soon!');
}

function initGame() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('gameCanvas').appendChild(renderer.domElement);

    // TODO: Implement game logic using ThreeJS
}

// Handle browser back/forward buttons
window.onpopstate = function() {
    navigateTo(window.location.pathname.substr(1) || 'home');
};

// Initial page load
document.addEventListener('DOMContentLoaded', function() {
    navigateTo(window.location.pathname.substr(1) || 'home');
});