let currentFloor = 0;
let highestClearedLevel = 0;
let gameState = 'playing';
let ambianceStarted = false;

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

    // LANCE LA MUSIQUE UNE SEULE FOIS (sans reset à chaque étage)
    if (!ambianceStarted) {
        document.getElementById('snd-ambiance').play();
        ambianceStarted = true;
    }

    let targetFloor = currentFloor + dir;

    // SÉCURITÉ PALIER : On ne peut pas monter plus haut que 1 étage au dessus du record
    if (dir > 0 && targetFloor > highestClearedLevel + 1) {
        roomText.textContent = "Étage verrouillé ! Validez l'étage " + (highestClearedLevel + 1) + ".";
        return; 
    }

    // On ferme les portes si on bouge
    if (elevatorView.classList.contains('doors-open')) {
        elevatorView.classList.remove('doors-open');
        // On ne met pas de son ici pour éviter le "bip" à chaque mouvement
    }

    currentFloor = Math.max(0, targetFloor);
    updateDisplay();
}

function toggleDoors() {
    if (gameState !== 'playing') return;
    
    if (!elevatorView.classList.contains('doors-open')) {
        elevatorView.classList.add('doors-open');
        playSnd('snd-doors'); // Le son se joue seulement ici
        
        setTimeout(() => {
            checkFloor();
        }, 800);
    }
}

function checkFloor() {
    if (currentFloor === 0) {
        roomText.textContent = "Rez-de-chaussée.";
        return;
    }

    if (currentFloor <= highestClearedLevel) {
        roomText.textContent = "Déjà sécurisé.";
        return;
    }

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
        currentFloor = 0;
        updateDisplay();
        gameState = 'playing';
        roomText.textContent = "L'ascenseur redémarre...";
    }, 4000);
}

updateDisplay();
