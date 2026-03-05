let currentFloor = 0;
let highestClearedLevel = 0;
let gameState = 'playing';

// Génère la liste des étages sûrs
const safeFloors = {};
for (let i = 0; i < 100; i += 3) {
    safeFloors[i] = i + (Math.floor(Math.random() * 3) + 1);
}

const elevatorView = document.getElementById('elevator-view');
const roomText = document.getElementById('room-text');
const monsterOverlay = document.getElementById('monster-overlay');
const policeTape = document.getElementById('police-tape');

function startGame() {
    document.getElementById('story-overlay').style.display = 'none';
    document.getElementById('snd-ambiance').play();
    roomText.textContent = "Trouve tes parents...";
}

function playSnd(id) {
    const audio = document.getElementById(id);
    if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
}

function updateDisplay() {
    document.getElementById('floor-display').textContent = currentFloor.toString().padStart(3, '0');
    if (currentFloor > 0 && currentFloor <= highestClearedLevel) {
        policeTape.style.display = 'block';
    } else {
        policeTape.style.display = 'none';
    }
}

function changeFloor(dir) {
    if (gameState !== 'playing') return;
    let target = currentFloor + dir;
    if (dir > 0 && target > highestClearedLevel + 3) {
        roomText.textContent = "Palier verrouillé !";
        return; 
    }
    if (elevatorView.classList.contains('doors-open')) elevatorView.classList.remove('doors-open');
    currentFloor = Math.max(0, target);
    updateDisplay();
}

function toggleDoors() {
    if (gameState !== 'playing' || currentFloor === 0) return;
    if (policeTape.style.display === 'block') return;

    if (!elevatorView.classList.contains('doors-open')) {
        elevatorView.classList.add('doors-open');
        playSnd('snd-doors');
        setTimeout(() => { checkFloor(); }, 800);
    }
}

function checkFloor() {
    const palierBase = Math.floor((currentFloor - 1) / 3) * 3;
    if (currentFloor === safeFloors[palierBase]) {
        highestClearedLevel = palierBase + 3; 
        playSnd('snd-success');
        roomText.textContent = "ÉTAGE SÉCURISÉ.";
        policeTape.style.display = 'block';
    } else {
        triggerJumpscare();
    }
}

function triggerJumpscare() {
    gameState = 'attacking';
    monsterOverlay.classList.add('monster-attack');
    playSnd('snd-jumpscare');
    setTimeout(() => {
        monsterOverlay.classList.remove('monster-attack');
        elevatorView.classList.remove('doors-open');
        currentFloor = 0;
        updateDisplay();
        gameState = 'playing';
        roomText.textContent = "Retour au RDC...";
    }, 4000);
}

updateDisplay();
