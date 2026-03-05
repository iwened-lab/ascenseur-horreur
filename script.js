let currentFloor = 0;
let highestClearedLevel = 0;
let gameState = 'playing';

// Récupération des éléments audio
const sndAmbiance = document.getElementById('snd-ambiance');
const sndJumpscare = document.getElementById('snd-jumpscare');
const sndSuccess = document.getElementById('snd-success');
const sndDoors = document.getElementById('snd-doors');

function playSound(audio) {
    audio.currentTime = 0;
    audio.play().catch(() => console.log("L'audio attend un clic."));
}

function updateDisplay() {
    document.getElementById('floor-display').textContent = currentFloor.toString().padStart(3, '0');
}

function changeFloor(dir) {
    if (gameState !== 'playing') return;
    // Lance l'ambiance au premier mouvement
    sndAmbiance.play();
    
    currentFloor = Math.max(0, currentFloor + dir);
    updateDisplay();
}

function toggleDoors() {
    if (gameState !== 'playing') return;
    const view = document.getElementById('elevator-view');
    
    if (!view.classList.contains('doors-open')) {
        view.classList.add('doors-open');
        playSound(sndDoors);
        
        setTimeout(() => {
            // Logique de victoire ou défaite
            if (currentFloor === highestClearedLevel + 1 || currentFloor === 0) {
                if (currentFloor !== 0) {
                    highestClearedLevel = currentFloor;
                    playSound(sndSuccess);
                    document.getElementById('room-text').textContent = "Étage sécurisé...";
                }
            } else {
                triggerJumpscare();
            }
        }, 1000);
    }
}

function triggerJumpscare() {
    gameState = 'attacking';
    const monster = document.getElementById('monster-overlay');
    monster.classList.add('monster-attack');
    
    playSound(sndJumpscare);
    
    setTimeout(() => {
        monster.classList.remove('monster-attack');
        document.getElementById('elevator-view').classList.remove('doors-open');
        playSound(sndDoors);
        currentFloor = 0;
        updateDisplay();
        gameState = 'playing';
        document.getElementById('room-text').textContent = "L'ascenseur redémarre...";
    }, 3000);
}

updateDisplay();
