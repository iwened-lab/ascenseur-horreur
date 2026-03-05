let currentFloor = 0;
let highestClearedLevel = 0;
let gameState = 'playing';

// Un bon étage par bloc de 3
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
    const bgMusic = document.getElementById('snd-ambiance');
    if (bgMusic) bgMusic.play();
    roomText.textContent = "Trouve la sortie...";
}

function playSnd(id) {
    const audio = document.getElementById(id);
    if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
}

function updateDisplay() {
    document.getElementById('floor-display').textContent = currentFloor.toString().padStart(3, '0');
    
    // Si déjà validé, on affiche les rubans mais SEULEMENT si les portes sont fermées
    if (currentFloor > 0 && currentFloor <= highestClearedLevel) {
        if (!elevatorView.classList.contains('doors-open')) {
            policeTape.style.display = 'block';
        }
    } else {
        policeTape.style.display = 'none';
    }
}

function changeFloor(dir) {
    if (gameState !== 'playing') return;
    let target = currentFloor + dir;

    if (dir > 0 && target > highestClearedLevel + 3) {
        roomText.textContent = "Palier bloqué !";
        return; 
    }

    // On cache les rubans pendant le mouvement
    policeTape.style.display = 'none';

    if (elevatorView.classList.contains('doors-open')) {
        elevatorView.classList.remove('doors-open');
    }

    currentFloor = Math.max(0, target);
    
    // On attend la fermeture pour rafraîchir les rubans
    setTimeout(() => { updateDisplay(); }, 500);
}

function toggleDoors() {
    if (gameState !== 'playing' || currentFloor === 0) return;
    
    // Bloqué si zone condamnée
    if (currentFloor <= highestClearedLevel) {
        roomText.textContent = "Cette porte est scellée.";
        return;
    }

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
        roomText.textContent = "ÉTAGE SÉCURISÉ !";
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
