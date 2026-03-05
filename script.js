let currentFloor = 0;
let highestClearedLevel = 0;
let gameState = 'playing';

const elevatorView = document.getElementById('elevator-view');
const roomText = document.getElementById('room-text');
const monsterOverlay = document.getElementById('monster-overlay');

function playSnd(id) {
    const audio = document.getElementById(id);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}

function updateDisplay() {
    document.getElementById('floor-display').textContent = currentFloor.toString().padStart(3, '0');
}

function changeFloor(dir) {
    if (gameState !== 'playing') return;

    let targetFloor = currentFloor + dir;

    // SÉCURITÉ PALIER : Empêche de monter plus haut que le prochain étage à valider
    if (dir > 0 && targetFloor > highestClearedLevel + 1) {
        roomText.textContent = "Étage verrouillé ! Validez d'abord l'étage précédent.";
        return; 
    }

    if (elevatorView.classList.contains('doors-open')) {
        elevatorView.classList.remove('doors-open');
        playSnd('snd-doors');
    }

    playSnd('snd-ambiance');
    currentFloor = Math.max(0, targetFloor);
    updateDisplay();
}

function toggleDoors() {
    if (gameState !== 'playing') return;
    
    if (!elevatorView.classList.contains('doors-open')) {
        elevatorView.classList.add('doors-open');
        playSnd('snd-doors');
        
        setTimeout(() => {
            checkFloor();
        }, 1000);
    }
}

function checkFloor() {
    if (currentFloor === 0) {
        roomText.textContent = "Rez-de-chaussée. Prêt à monter ?";
        return;
    }

    if (currentFloor <= highestClearedLevel) {
        roomText.textContent = "Étage déjà sécurisé.";
        return;
    }

    // Le bon chemin (1 par 1)
    if (currentFloor === highestClearedLevel + 1) {
        highestClearedLevel = currentFloor;
        playSnd('snd-success');
        roomText.textContent = "ÉTAGE " + currentFloor + " SÉCURISÉ !";
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
        playSnd('snd-doors');
        currentFloor = 0;
        updateDisplay();
        gameState = 'playing';
        roomText.textContent = "L'ascenseur redémarre...";
    }, 3000);
}

updateDisplay();

