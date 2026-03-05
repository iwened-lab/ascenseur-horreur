let currentFloor = 0;
let highestClearedLevel = 0;
let gameState = 'playing';

// Sélection des éléments
const elevatorView = document.getElementById('elevator-view');
const roomText = document.getElementById('room-text');
const monsterOverlay = document.getElementById('monster-overlay');

// Gestion des sons avec sécurité
function playSnd(id) {
    const audio = document.getElementById(id);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => console.log("Son bloqué par le navigateur (cliquez d'abord sur la page)"));
    }
}

function updateDisplay() {
    document.getElementById('floor-display').textContent = currentFloor.toString().padStart(3, '0');
}

function changeFloor(dir) {
    if (gameState !== 'playing') return;
    
    // Fermer les portes si on bouge
    if (elevatorView.classList.contains('doors-open')) {
        elevatorView.classList.remove('doors-open');
        playSnd('snd-doors');
    }

    // L'ambiance se lance au premier mouvement
    playSnd('snd-ambiance');

    currentFloor = Math.max(0, currentFloor + dir);
    updateDisplay();
    roomText.textContent = "L'ascenseur se déplace...";
}

function toggleDoors() {
    if (gameState !== 'playing') return;
    
    if (!elevatorView.classList.contains('doors-open')) {
        elevatorView.classList.add('doors-open');
        playSnd('snd-doors');
        
        // On attend que les portes soient ouvertes pour juger
        setTimeout(() => {
            checkFloor();
        }, 1000);
    }
}

function checkFloor() {
    // Étage 0 ou étage déjà réussi : OK
    if (currentFloor === 0 || currentFloor <= highestClearedLevel) {
        roomText.textContent = "Rien ici... Tout est calme.";
        return;
    }

    // La règle : On doit trouver l'étage juste après le dernier réussi
    if (currentFloor === highestClearedLevel + 1) {
        highestClearedLevel = currentFloor;
        playSnd('snd-success');
        roomText.textContent = "Étage " + currentFloor + " sécurisé ! Continuez.";
    } else {
        // MAUVAIS ÉTAGE = MONSTRE
        triggerJumpscare();
    }
}

function triggerJumpscare() {
    gameState = 'attacking';
    roomText.textContent = "MAUVAIS ÉTAGE.";
    
    monsterOverlay.classList.add('monster-attack');
    playSnd('snd-jumpscare');
    
    setTimeout(() => {
        // Reset après l'attaque
        monsterOverlay.classList.remove('monster-attack');
        elevatorView.classList.remove('doors-open');
        playSnd('snd-doors');
        currentFloor = 0;
        updateDisplay();
        gameState = 'playing';
        roomText.textContent = "L'ascenseur redémarre au rez-de-chaussée...";
    }, 3000);
}

updateDisplay();
