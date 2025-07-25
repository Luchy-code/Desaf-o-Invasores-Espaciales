let nave = { left: 280, top: 530 };

const aliens = [
    { left: 350, top: 200 },
    { left: 450, top: 175 },
    { left: 150, top: 300 },
    { left: 50, top: 50 },
    { left: 400, top: 400 }
];

let disparoActivo = false;
let laser = null;
let angulo = 0;
let radio = 60;
let velocidadAngular = 0;

let teclasPresionadas = {};
let anchoAlien = 80;
let alienDireccion = "izquierda";

const anchoNave = 100;
const anchoMax = 640;
const altoMax = 620;

function dibujaContador() {
    document.getElementById("contadorAliens").innerText = `Aliens restantes: ${aliens.length}`;
    if(aliens.length === 0) {
        document.getElementById("contadorAliens").innerText = "¡Has ganado!";
    }
}

function dibujaNave() {
    document.getElementById("naves").innerHTML =
        `<div class='nave' style='left:${nave.left}px; top:${nave.top}px'></div>`;
}

function dibujaAliens() {
    let contenido = "";
    for (let alien of aliens) {
        contenido += `<div class='alien' style='left:${alien.left}px; top:${alien.top}px'></div>`;
    }
    document.getElementById("aliens").innerHTML = contenido;
}

function dibujaDisparos() {
    let contenido = "";
    if (disparoActivo && laser) {
        contenido = `<div id="laser" class='disparo' style='left:${laser.left - 60}px; top:${laser.top - 50}px'></div>`;
    }
    document.getElementById("disparos").innerHTML = contenido;
}


function moverAliens() {
    for (let alien of aliens) {
        // Movimiento horizontal
        if (alienDireccion === "izquierda" && alien.left > 0) {
            alien.left -= 5;
            if (alien.left <= 0) alienDireccion = "derecha";
        } else if (alienDireccion === "derecha" && alien.left < anchoMax - anchoAlien) {
            alien.left += 5;
            if (alien.left >= anchoMax - anchoAlien) alienDireccion = "izquierda";
        }
        // Movimiento lento hacia abajo
        if(alien.top < altoMax - anchoAlien){
          alien.top += 0.5; 
        }else {
          alien.bottom = altoMax - anchoAlien; // Evita que se salga de la pantalla
        }
    }
    dibujaAliens();
}


function moverDisparos() {
    if (disparoActivo && laser) {
        angulo += velocidadAngular;

        const cx = nave.left + 50;
        const cy = nave.top;

        laser.left = cx + radio * Math.cos(angulo);
        laser.top = cy + radio * Math.sin(angulo);

        dibujaDisparos();
        verificarColisiones();
    } else {
        document.getElementById("disparos").innerHTML = "";
    }
}

function verificarColisiones() {
    if (!disparoActivo || !laser) return;

    const laserElement = document.getElementById("laser");
    if (!laserElement) return;

    const laserRect = laserElement.getBoundingClientRect();

    for (let j = aliens.length - 1; j >= 0; j--) {
        const alien = aliens[j];
        const tempAlien = document.createElement("div");
        tempAlien.style.position = "absolute";
        tempAlien.style.left = alien.left + "px";
        tempAlien.style.top = alien.top + "px";
        tempAlien.style.width = "60px"; 
        tempAlien.style.height = "60px"; 
        document.body.appendChild(tempAlien);
        const alienRect = tempAlien.getBoundingClientRect();
        document.body.removeChild(tempAlien);

        const colisiona =
            laserRect.left < alienRect.right &&
            laserRect.right > alienRect.left &&
            laserRect.top < alienRect.bottom &&
            laserRect.bottom > alienRect.top;

        if (colisiona) {
            aliens.splice(j, 1);
            disparoActivo = false;
            laser = null;
            break;
        }
    }
}


function actualizar() {
    if (nave.left < 0) nave.left = 0;
    if (nave.left > anchoMax - anchoNave) nave.left = anchoMax - anchoNave;
    if (nave.top < altoMax / 2) nave.top = altoMax / 2;
    if (nave.top > altoMax - anchoNave) nave.top = altoMax - anchoNave;
    dibujaNave();
}

// CONTROL DE TIEMPO
let tiempoRestante = 1000;
setInterval(() => {
    if (tiempoRestante > 0) {
        tiempoRestante--;
        document.getElementById("tiempo").innerText = `Tiempo: ${tiempoRestante}s`;
        dibujaContador();
    }
}, 1000);

// LOOP GENERAL
setInterval(() => {
    moverAliens();

    // Si el láser está activo y se presionan Space + Flechas, girar
    if (disparoActivo) {
        if (teclasPresionadas["Space"] && teclasPresionadas["ArrowLeft"]) {
            velocidadAngular = -0.1;
        } else if (teclasPresionadas["Space"] && teclasPresionadas["ArrowRight"]) {
            velocidadAngular = 0.1;
        } else {
            velocidadAngular = 0;
        }
    }

    moverDisparos();
}, 100);

// EVENTOS DE TECLADO
document.onkeydown = function (e) {
    teclasPresionadas[e.code] = true;

    // Toggle con Space (una sola vez por pulsación)
    if (e.code === "Space" && !teclasPresionadas["SpacePrev"]) {
        teclasPresionadas["SpacePrev"] = true;
        disparoActivo = !disparoActivo;
        if (disparoActivo) {
            angulo = 0;
            radio = 60;
            const cx = nave.left + 50;
            const cy = nave.top;
            laser = {
                left: cx + radio * Math.cos(angulo),
                top: cy + radio * Math.sin(angulo)
            };
        } else {
            laser = null;
            velocidadAngular = 0;
        }
    }

    // Movimiento de nave solo si el láser está inactivo
    if (!disparoActivo) {
        if (e.code === "ArrowLeft") nave.left -= 10;
        if (e.code === "ArrowRight") nave.left += 10;
        if (e.code === "ArrowUp") nave.top -= 10;
        if (e.code === "ArrowDown") nave.top += 10;
    }

    actualizar();
};

document.onkeyup = function (e) {
    delete teclasPresionadas[e.code];
    if (e.code === "Space") delete teclasPresionadas["SpacePrev"];
};

// INICIO
actualizar();
dibujaAliens();
