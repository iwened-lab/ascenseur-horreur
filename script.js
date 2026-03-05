let currentFloor = 0;
let highestClearedLevel = 0;
let gameState = 'playing';

const safeFloors = {};
for (let i = 0; i < 100; i += 3) {
    safeFloors[i] = i + (Math.floor(Math.random() * 3) + 1);
}

const movingPart = document.getElementById('moving-part');
const elevatorView = document.getElementById('elevator-view');
const roomText = document.getElementById('room-text');
const monsterOverlay = document.getElementById('monster-overlay');
const policeTape = document.getElementById('police-tape');

function startGame() {
    document.getElementById('story-overlay').style.display = 'none';
    document.getElementById('snd-ambiance').play();
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
        roomText.textContent = "Palier bloqué !";
        return; 
    }
    
    gameState = 'moving';
    elevatorView.classList.remove('doors-open');
    
    // Animation : les portes s'en vont
    movingPart.classList.add(dir > 0 ? 'slide-up' : 'slide-down');

    setTimeout(() => {
        currentFloor = Math.max(0, target);
        updateDisplay();
        
        // Reset position sans animation (pour revenir de l'autre côté)
        movingPart.style.transition = 'none';
        movingPart.classList.remove('slide-up', 'slide-down');
        movingPart.classList.add(dir > 0 ? 'slide-down' : 'slide-up');
        
        setTimeout(() => {
            movingPart.style.transition = 'transform 0.6s ease-in-out';
            movingPart.classList.remove('slide-up', 'slide-down');
            gameState = 'playing';
            roomText.textContent = "Étage " + currentFloor;
        }, 50);
    }, 600);
}

function toggleDoors() {
    if (gameState !== 'playing' || currentFloor === 0) return;
    if (currentFloor <= highestClearedLevel) {
        roomText.textContent = "Porte scellée.";
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
