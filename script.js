let currentFloor = 0;
let highestClearedLevel = 0;
let gameState = 'playing';

// Génération aléatoire : 1 bon étage par bloc de 3
const safeFloors = {};
for (let i = 0; i < 100; i += 3) {
    safeFloors[i] = i + (Math.floor(Math.random() * 3) + 1);
}

const elevatorView = document.getElementById('elevator-view');
const roomText = document.getElementById('room-text');
const monsterOverlay = document.getElementById('monster-overlay');
const policeTape = document.getElementById('police-tape');

// LANCE LE JEU
function startGame() {
    document.getElementById('story-overlay').style.display = 'none';
    const bgMusic = document.getElementById('snd-ambiance');
    if (bgMusic) bgMusic.play();
    roomText.textContent = "Trouvez le bon étage...";
}

function playSnd(id) {
    const audio = document.getElementById(id);
    if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
}

function updateDisplay() {
    document.getElementById('floor-display').textContent = currentFloor.toString().padStart(3, '0');
    
    // Si l'étage appartient à un palier déjà validé
    if (currentFloor > 0 && currentFloor <= highestClearedLevel) {
        policeTape.style.display = 'block';
        roomText.textContent = "ZONE SÉCURISÉE / CONDAMNÉE";
    } else {
        policeTape.style.display = 'none';
        if (currentFloor > 0) roomText.textContent = "Étage " + currentFloor;
    }
}

function changeFloor(dir) {
    if (gameState !== 'playing') return;
    let targetFloor = currentFloor + dir;

    // Blocage si on tente de dépasser le palier actuel
    if (dir > 0 && targetFloor > highestClearedLevel + 3) {
        roomText.textContent = "Accès refusé. Validez le palier actuel.";
        return; 
    }

    if (elevatorView.classList.contains('doors-open')) {
        elevatorView.classList.remove('doors-open');
    }

    currentFloor = Math.max(0, targetFloor);
    updateDisplay();
}

function toggleDoors() {
    if (gameState !== 'playing') return;
    if (currentFloor === 0) return;

    if (policeTape.style.display === 'block') {
        roomText.textContent = "Inutile d'ouvrir, c'est fini ici.";
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
    const correctFloor = safeFloors[palierBase];

    if (currentFloor === correctFloor) {
        highestClearedLevel = palierBase + 3; 
        playSnd('snd-success');
        roomText.textContent = "ÉTAGE CORRECT. Palier suivant débloqué.";
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
        roomText.textContent = "L'ascenseur est retombé au RDC...";
    }, 4000);
}

updateDisplay();

