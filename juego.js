let nave = {
     left: 280,
    top: 530
};

const aliens = [
    { left: 350, top: 200 },
    { left: 450, top: 175 },
    { left: 150, top: 300 },
    { left:  50, top:  50 },
    { left: 400, top: 400 }
];

function dibujaNave() {
    const contenido = `<div class='nave' style='left:${nave.left}px; top:${nave.top}px'></div>`;
    document.getElementById("naves").innerHTML = contenido;
}

function dibujaAliens() {
    let contenido = "";
    for (let alien of aliens) {
        contenido += `<div class='alien' style='left:${alien.left}px; top:${alien.top}px'></div>`;
    }
    document.getElementById("aliens").innerHTML = contenido;
}

function actualizar() {
    const anchoEspacio = 640;
    const tercioImagen = 200;
    const limiteArriba = anchoEspacio - tercioImagen; 
    const limiteAbajo = 620;
    const anchoNave = 100;
    const altoNave = 100;

    // Limitar movimiento vertical
    if (nave.top < limiteArriba) {
        nave.top = limiteArriba;
    } else if (nave.top > limiteAbajo - altoNave) {
        nave.top = limiteAbajo - altoNave;
    }

    // Limitar movimiento horizontal
    if (nave.left < 0) {
        nave.left = 0;
    } else if (nave.left > anchoEspacio - anchoNave) {
        nave.left = anchoEspacio - anchoNave;
    }

    dibujaNave();
}

// Movimiento automático de aliens
function moverAliens() {
    for (let alien of aliens) {
        alien.top += 1; // Mueven hacia abajo
    }
    dibujaAliens();
}

document.onkeydown = function(e) {
    if (e.keyCode === 37) { nave.left -= 10; } // Izquierda
    if (e.keyCode === 38) { nave.top -= 10; }  // Arriba
    if (e.keyCode === 39) { nave.left += 10; } // Derecha
    if (e.keyCode === 40) { nave.top += 10; }  // Abajo

    actualizar();
};

dibujaNave();
dibujaAliens();
