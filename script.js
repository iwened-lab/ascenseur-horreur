let currentFloor = 0;
let doorsOpen = false;
let maxAccessibleFloor = 3; 
let validatedGroups = []; 

// LA LISTE FIXE : Le joueur doit apprendre cette suite (1 chance sur 3 à chaque fois)
const SAFE_FLOORS = [
    2, 5, 9, 11, 13, 17, 20, 24, 26, 30, 
    31, 35, 38, 41, 44, 46, 50, 52, 55, 59,
    62, 64, 67, 70, 75, 76, 80, 84, 85, 89,
    91, 95, 98, 100
];

function changeFloor(val) {
    if (doorsOpen) return;
    let target = currentFloor + val;
    
    // Règle du mur invisible
    if (val > 0 && target > maxAccessibleFloor) {
        alert("BLOQUÉ ! Trouve d'abord le bon étage du palier actuel.");
        return;
    }
    
    currentFloor = Math.max(0, Math.min(100, target));
    document.getElementById('floor-display').innerText = currentFloor.toString().padStart(3, '0');
}

function toggleDoors() {
    const view = document.getElementById('elevator-view');
    const roomText = document.getElementById('room-text');
    const monster = document.getElementById('monster-overlay');
    
    if (doorsOpen) {
        closeElevator();
        return;
    }

    // Vérifier si l'étage est déjà validé
    let groupID = Math.floor((currentFloor - 1) / 3);
    if (validatedGroups.includes(groupID) && currentFloor !== 0) {
        alert("ÉTAGE DÉJÀ VALIDÉ : Monte plus haut !");
        return;
    }

    doorsOpen = true;
    view.classList.add('open');
    
    if (currentFloor === 0) {
        roomText.innerText = "Rez-de-chaussée.";
        setTimeout(closeElevator, 2000);
        return;
    }

    // Vérification du bon étage
    let safe = SAFE_FLOORS[groupID];
    
    if (currentFloor === safe) {
        roomText.innerText = "ÉTAGE SÛR ! Palier suivant débloqué.";
        if (!validatedGroups.includes(groupID)) {
            validatedGroups.push(groupID);
            maxAccessibleFloor = (groupID + 1) * 3 + 3;
        }
        setTimeout(closeElevator, 3000);
    } else {
        // ATTAQUE MONSTRE
        view.classList.add('flash-red');
        monster.classList.add('monster-attack');
        roomText.innerText = "MAUVAIS ÉTAGE !";

        setTimeout(() => {
            alert("👹 LE MONSTRE VOUS RENVOIE AU RDC ! Retenez le chemin...");
            // RESET COMPLET AU RDC
            currentFloor = 0;
            maxAccessibleFloor = 3;
            validatedGroups = []; 
            document.getElementById('floor-display').innerText = "000";
            closeElevator();
        }, 1200);
    }
}

function closeElevator() {
    const view = document.getElementById('elevator-view');
    const roomText = document.getElementById('room-text');
    const monster = document.getElementById('monster-overlay');
    doorsOpen = false;
    view.classList.remove('open', 'flash-red');
    monster.classList.remove('monster-attack');
    setTimeout(() => { if (!doorsOpen) roomText.innerText = "L'ascenseur attend..."; }, 800);
}