let currentFloor = 0;
let highestClearedLevel = 0;
let gameState = 'playing';
let ambianceStarted = false;

// On génère le bon étage pour chaque palier de 3 dès le début
const safeFloors = {};
for (let i = 0; i < 100; i += 3) {
    // Choisit au hasard 1, 2 ou 3 dans chaque groupe
    const randomSafe = Math.floor(Math.random() * 3) + 1;
    safeFloors[i] = i + randomSafe;
}

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

    if (!ambianceStarted) {
        document.getElementById('snd-ambiance').play();
        ambianceStarted = true;
    }

    let targetFloor = currentFloor + dir;

    // SÉCURITÉ : On ne peut pas monter au-delà du palier de 3 actuel
    if (dir > 0 && targetFloor > highestClearedLevel + 3) {
        roomText.textContent = "Zone bloquée ! Trouvez le bon étage entre " + (highestClearedLevel + 1) + " et " + (highestClearedLevel + 3) + ".";
        return; 
    }

    if (elevatorView.classList.contains('doors-open')) {
        elevatorView.classList.remove('doors-open');
    }

    currentFloor = Math.max(0, targetFloor);
    updateDisplay();
    roomText.textContent = "Ascenseur à l'étage " + currentFloor;
}

function toggleDoors() {
    if (gameState !== 'playing') return;
    
    if (!elevatorView.classList.contains('doors-open')) {
        elevatorView.classList.add('doors-open');
        playSnd('snd-doors');
        
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

    // Si on est dans un étage déjà validé par le passé
    if (currentFloor <= highestClearedLevel) {
        roomText.textContent = "Étage déjà exploré.";
        return;
    }

    // On récupère quel est le bon étage pour le palier actuel (0, 3, 6...)
    const palierBase = Math.floor((currentFloor - 1) / 3) * 3;
    const correctFloor = safeFloors[palierBase];

    if (currentFloor === correctFloor) {
        // VICTOIRE DU PALIER
        highestClearedLevel = palierBase + 3; 
        playSnd('snd-success');
        roomText.textContent = "ÉTAGE SÉCURISÉ ! Le palier suivant est débloqué.";
    } else {
        // MONSTRE !
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
        roomText.textContent = "L'ascenseur redémarre au niveau 0.";
    }, 4000);
}

updateDisplay();

