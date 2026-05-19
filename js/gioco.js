/**
 * gioco.js – Scappa dalla Major
 * Collisioni road-only generate automaticamente dalla mappa (TILE=50, 50×24).
 * Sprite ingranditi. GIF animati via <img> DOM.
 */
(function () {
    'use strict';

    // ─── VIEWPORT / MONDO ────────────────────────────────────────────────────
    const VIEW_W = 768;
    const VIEW_H = 512;
    const MAP_W  = 2500;
    const MAP_H  = 1215;

    // ─── GRIGLIA COLLISIONI 50×24 (TILE=50px) ────────────────────────────────
    // Auto-generata dal color-sampling della mappa: 0=strada, 1=muro
    const TILE     = 50;
    const MAP_COLS = 50;
    const MAP_ROWS = 24;
    const COLL = [
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
[1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
[1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
[1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
[1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
[1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
[1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
[1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],
[1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1],
[1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],
[1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],
[1,1,1,1,0,0,1,0,1,1,0,1,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
[1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    // ─── CONFIG ──────────────────────────────────────────────────────────────
    const PLAYER_SPEED       = 3.0;
    const CAR_ACCEL          = 0.45;   // accelerazione per frame
    const CAR_FRICTION       = 0.84;   // attrito (< 1 → rallenta)
    const CAR_MAX_SPD        = 9.0;    // velocità massima
    const CAR_CRASH_THRESHOLD = 2.8;   // velocità minima per fare incidente
    const CAR_SPR_W          = 100;
    const CAR_SPR_H          = 90;
    const CAR_BOARD_DIST     = 60;
    const CAR_JUNK_COL       = 6;      // colonna autodemolizione (road row16)
    const CAR_JUNK_ROW       = 16;
    const MAJOR_SPEEDS  = [1.8, 2.1, 2.45, 2.8];
    const VINYL_COUNT   = 8;
    const SCORE_VINYL   = 100;
    const LIVES_START   = 3;
    const INVINCIBLE_MS   = 2000;
    const MAJOR_STUN_MS   = 3500;
    const SCORE_RUNOVER   = 500;
    // Sprite render size (visivo) – più grande della hitbox
    const SPR_W = 72;
    const SPR_H = 72;
    // Hitbox (più piccola dello sprite, centrata)
    const HIT_W = 30;
    const HIT_H = 30;

    // ─── STATO ───────────────────────────────────────────────────────────────
    let canvas, ctx;
    let state = 'start';
    let score = 0, lives = LIVES_START, level = 1;
    let invincibleUntil = 0, majorStunnedUntil = 0;
    let animFrame, lastTime = 0, vinylsLeft = 0;
    let cam = { x: 0, y: 0 };
    const keys = {};
    let touchDir = null;

    // ─── ENTITÀ ──────────────────────────────────────────────────────────────
    let player = {}, major = {}, car = {}, npcs = [], vinyls = [], particles = [];

    // ─── SPRITE SHEET SYSTEM ─────────────────────────────────────────────────
    // Ogni GIF è stato estratto in uno sprite sheet PNG orizzontale (128px/frame).
    // L'animazione è gestita manualmente: frame corrente = floor(elapsed / duration).
    const FRAME_SIZE = 128;   // px per frame nel sheet

    const SHEET_DEFS = {
        pirrons_front:  { file: 'pirronsfront-sheet.png',      frames: 39, duration: 40 },
        pirrons_back:   { file: 'pirronsback-sheet.png',       frames: 18, duration: 40 },
        pirrons_left:   { file: 'pirronssinistra-sheet.png',   frames: 45, duration: 40 },
        pirrons_right:  { file: 'pirronsdestra-sheet.png',     frames: 45, duration: 40 },
        major_front:    { file: 'majorfront-sheet.png',        frames: 46, duration: 40 },
        major_back:     { file: 'majorback-sheet.png',         frames: 36, duration: 40 },
        major_left:     { file: 'majorsinistra-sheet.png',     frames: 43, duration: 40 },
        major_right:    { file: 'majordestra-sheet.png',       frames: 43, duration: 40 },
        soldato:        { file: 'soldato-sheet.png',           frames: 50, duration: 40 },
        gestore:        { file: 'gestorepub-sheet.png',        frames: 39, duration: 40 },
        npc1:           { file: 'npconcerto1-sheet.png',       frames: 40, duration: 40 },
        npc2:           { file: 'npconcerto2-sheet.png',       frames: 72, duration: 40 },
        npc3:           { file: 'npconcerto3-sheet.png',       frames: 56, duration: 40 },
        npc_coppia:     { file: 'npconcertocoppia-sheet.png',  frames: 56, duration: 40 },
        npc_gruppo:     { file: 'npconcertogruppo-sheet.png',  frames: 50, duration: 40 },
        macchina1:      { file: 'macchina1-sheet.png',         frames: 19, duration: 60 },
        macchina2:      { file: 'macchina2-sheet.png',         frames: 43, duration: 35 },
        frontcar:       { file: 'frontcar-sheet.png',          frames:  1, duration: 1000 },
        retrocar:       { file: 'retrocar-sheet.png',          frames:  1, duration: 1000 },
    };

    // sheet img elements e timer globale
    const SHEETS = {};     // key → HTMLImageElement
    let animClock = 0;     // ms totali dall'avvio (avanza in update)
    let mapImg = null;

    // ─── INIT ─────────────────────────────────────────────────────────────────
    function init() {
        canvas = document.getElementById('gameCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        canvas.width  = VIEW_W;
        canvas.height = VIEW_H;

        // Carica tutti gli sprite sheet PNG
        const loads = [];

        const mapLoad = new Promise(res => {
            mapImg = new Image();
            mapImg.onload = mapImg.onerror = res;
            mapImg.src = 'mappa-gioco-stitched.png';
        });
        loads.push(mapLoad);

        for (const [key, def] of Object.entries(SHEET_DEFS)) {
            const img = new Image();
            const p = new Promise(res => { img.onload = img.onerror = res; });
            img.src = 'sprites/' + def.file;
            SHEETS[key] = img;
            loads.push(p);
        }

        Promise.all(loads).then(() => {
            bindEvents();
            cam = { x: 0, y: 0 };
            animClock = 0;
            showOverlay('start');
            idleLoop();
        });
    }

    // Restituisce il frame corrente da disegnare per una data chiave sprite
    function currentFrame(key) {
        const def = SHEET_DEFS[key];
        if (!def) return 0;
        return Math.floor(animClock / def.duration) % def.frames;
    }

    // Disegna uno sprite sheet al frame corretto, centrato su (sx, sy) schermo
    function blitSprite(key, sx, sy, w, h) {
        const img = SHEETS[key];
        if (!img || !img.naturalWidth) return;
        const frame = currentFrame(key);
        const fx    = frame * FRAME_SIZE;
        ctx.drawImage(img, fx, 0, FRAME_SIZE, FRAME_SIZE,
                      sx - w / 2, sy - h / 2, w, h);
    }

    // ─── SETUP ────────────────────────────────────────────────────────────────
    // Tutti gli spawn calcolati su celle COLL=0 (strada)
    // cell center = col*TILE + TILE/2,  row*TILE + TILE/2
    function roadCenter(col, row) {
        return { x: col * TILE + TILE / 2 - HIT_W / 2,
                 y: row * TILE + TILE / 2 - HIT_H / 2 };
    }

    function setupGame() {
        // Pirrons: strada principale orizz. row4, col6
        const ps = roadCenter(6, 4);
        player = { x: ps.x, y: ps.y, w: HIT_W, h: HIT_H, dir: 'front', moving: false,
                   inCar: false, _eWasDown: false };

        // Macchina: parcheggiata su row4, col15 (stessa strada orizzontale)
        const cs = roadCenter(15, 4);
        car = { x: cs.x, y: cs.y, w: HIT_W, h: HIT_H, vx: 0, vy: 0 };

        // Major: strada verticale top-right row1, col25
        const ms = roadCenter(25, 1);
        major = { x: ms.x, y: ms.y, w: HIT_W, h: HIT_H, dir: 'front',
                  speed: MAJOR_SPEEDS[Math.min(level - 1, MAJOR_SPEEDS.length - 1)] };

        buildNPCs();
        spawnVinyls();
        vinylsLeft      = VINYL_COUNT;
        invincibleUntil   = 0;
        majorStunnedUntil = 0;
        particles         = [];
        centerCamera();
    }

    function buildNPCs() {
        npcs = [
            // ── Palco concerto top-right (ANGOLODESTROALTO) ──────────────────
            // Stage a y≈40-270, pubblico davanti a y≈280-480
            { x: 1280, y: 310, sprite: 'npc_gruppo'  },
            { x: 1380, y: 290, sprite: 'npc_coppia'  },
            { x: 1480, y: 320, sprite: 'npc1'        },
            { x: 1560, y: 300, sprite: 'npc2'        },
            { x: 1650, y: 315, sprite: 'npc3'        },
            { x: 1320, y: 390, sprite: 'npc1'        },
            { x: 1450, y: 410, sprite: 'npc_coppia'  },
            { x: 1580, y: 380, sprite: 'npc2'        },
            { x: 1700, y: 340, sprite: 'npc_gruppo'  },
            { x: 1240, y: 370, sprite: 'npc3'        },

            // ── Palco concerto bottom-center (CENTRALEBASSO) ─────────────────
            // Stage a y≈820-960, pubblico sopra a y≈700-820
            { x: 710,  y: 730, sprite: 'npc_gruppo'  },
            { x: 810,  y: 710, sprite: 'npc1'        },
            { x: 910,  y: 745, sprite: 'npc_coppia'  },
            { x: 1010, y: 720, sprite: 'npc2'        },
            { x: 1100, y: 755, sprite: 'npc3'        },
            { x: 770,  y: 800, sprite: 'npc1'        },
            { x: 870,  y: 785, sprite: 'npc2'        },
            { x: 970,  y: 810, sprite: 'npc_coppia'  },
            { x: 1060, y: 800, sprite: 'npc_gruppo'  },

            // ── NPC generici sulla mappa ──────────────────────────────────────
            { x: 470,  y: 430, sprite: 'soldato'     },  // vicino al venue
            { x: 700,  y: 645, sprite: 'gestore'     },  // vicino al pub
            { x: 920,  y: 215, sprite: 'soldato'     },  // strada principale
            { x: 340,  y: 555, sprite: 'npc3'        },  // incrocio sinistra
        ];
    }

    function spawnVinyls() {
        // Tutti su celle COLL=0 verificate
        const roadCells = [
            roadCenter(8,  4),   // strada orizz. principale
            roadCenter(12, 4),
            roadCenter(16, 4),
            roadCenter(20, 4),
            roadCenter(25, 0),   // strada verticale top-right
            roadCenter(25, 3),
            roadCenter(17, 8),   // strada verticale sx
            roadCenter(22, 8),   // incrocio centro
            roadCenter(25,13),   // boulevard bottom
            roadCenter(30,13),
        ];
        shuffle(roadCells);
        vinyls = roadCells.slice(0, VINYL_COUNT).map(c => ({
            x: c.x + HIT_W / 2,  // centro cella
            y: c.y + HIT_H / 2,
            collected: false, angle: 0
        }));
    }

    // ─── CAMERA ──────────────────────────────────────────────────────────────
    function centerCamera() {
        cam.x = player.x + player.w / 2 - VIEW_W / 2;
        cam.y = player.y + player.h / 2 - VIEW_H / 2;
        clampCam();
    }

    function clampCam() {
        cam.x = Math.max(0, Math.min(MAP_W - VIEW_W, cam.x));
        cam.y = Math.max(0, Math.min(MAP_H - VIEW_H, cam.y));
    }

    function ws(wx, wy) { return { x: wx - cam.x, y: wy - cam.y }; }

    // ─── LOOP ────────────────────────────────────────────────────────────────
    function startLoop() {
        lastTime = performance.now();
        cancelAnimationFrame(animFrame);
        animFrame = requestAnimationFrame(loop);
    }

    function loop(ts) {
        const dt = Math.min(ts - lastTime, 50);
        lastTime = ts;
        update(dt);
        draw();
        if (state === 'playing') animFrame = requestAnimationFrame(loop);
    }

    function idleLoop() {
        if (state === 'playing') return;
        animClock += 16;   // ~60fps tick anche da fermo (per NPC visibili nell'overlay)
        drawIdle();
        requestAnimationFrame(idleLoop);
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────
    function update(dt) {
        animClock += dt;   // avanza il clock per l'animazione sprite sheet
        updatePlayer();
        smoothCamera();
        updateMajor();
        updateVinyls();
        updateParticles(dt);
        updateHUD();
    }

    function updatePlayer() {
        // ── E key: sali / scendi dalla macchina ─────────────────────────────
        const eDown = keys['e'] || keys['E'];
        if (eDown && !player._eWasDown) {
            if (player.inCar) {
                player.inCar = false;
                player.x = car.x + car.w + 4;
                player.y = car.y;
                car.vx = 0; car.vy = 0;
            } else if (dist2d(player, car) < CAR_BOARD_DIST) {
                player.inCar = true;
                player.x = car.x; player.y = car.y;
            }
        }
        player._eWasDown = eDown;

        // ── Leggi input ──────────────────────────────────────────────────────
        let dx = 0, dy = 0;
        if (touchDir) { dx = touchDir.x; dy = touchDir.y; }
        else {
            if (keys['ArrowLeft']  || keys['a'] || keys['A']) dx -= 1;
            if (keys['ArrowRight'] || keys['d'] || keys['D']) dx += 1;
            if (keys['ArrowUp']    || keys['w'] || keys['W']) dy -= 1;
            if (keys['ArrowDown']  || keys['s'] || keys['S']) dy += 1;
        }
        if (dx && dy) { dx *= 0.707; dy *= 0.707; }

        if (player.inCar) {
            // ── Fisica macchina: inerzia + attrito ───────────────────────────
            car.vx = car.vx * CAR_FRICTION + dx * CAR_ACCEL;
            car.vy = car.vy * CAR_FRICTION + dy * CAR_ACCEL;

            const spd = Math.sqrt(car.vx * car.vx + car.vy * car.vy);
            if (spd > CAR_MAX_SPD) { car.vx *= CAR_MAX_SPD / spd; car.vy *= CAR_MAX_SPD / spd; }

            // Collisione X → incidente se velocità sufficiente
            const nx = player.x + car.vx;
            if (!wallAt(nx, player.y, player.w, player.h)) {
                player.x = nx;
            } else {
                if (Math.abs(car.vx) > CAR_CRASH_THRESHOLD) { onCarCrash(); return; }
                car.vx *= -0.35;
            }

            // Collisione Y → incidente se velocità sufficiente
            const ny = player.y + car.vy;
            if (!wallAt(player.x, ny, player.w, player.h)) {
                player.y = ny;
            } else {
                if (Math.abs(car.vy) > CAR_CRASH_THRESHOLD) { onCarCrash(); return; }
                car.vy *= -0.35;
            }

            player.x = Math.max(0, Math.min(MAP_W - player.w, player.x));
            player.y = Math.max(0, Math.min(MAP_H - player.h, player.y));
            car.x = player.x; car.y = player.y;

            // Direzione basata sulla velocità reale (non sull'input)
            player.moving = spd > 0.5;
            if (Math.abs(car.vx) > Math.abs(car.vy)) player.dir = car.vx < 0 ? 'left' : 'right';
            else if (Math.abs(car.vy) > 0.2)          player.dir = car.vy < 0 ? 'back' : 'front';

        } else {
            // ── A piedi ──────────────────────────────────────────────────────
            player.moving = dx !== 0 || dy !== 0;
            const nx = player.x + dx * PLAYER_SPEED;
            const ny = player.y + dy * PLAYER_SPEED;
            if (!wallAt(nx, player.y, player.w, player.h)) player.x = nx;
            if (!wallAt(player.x, ny, player.w, player.h)) player.y = ny;
            player.x = Math.max(0, Math.min(MAP_W - player.w, player.x));
            player.y = Math.max(0, Math.min(MAP_H - player.h, player.y));
            if      (Math.abs(dx) > Math.abs(dy)) player.dir = dx < 0 ? 'left' : 'right';
            else if (dy !== 0)                    player.dir = dy < 0 ? 'back' : 'front';
        }
    }

    function smoothCamera() {
        const tx = player.x + player.w / 2 - VIEW_W / 2;
        const ty = player.y + player.h / 2 - VIEW_H / 2;
        cam.x += (tx - cam.x) * 0.12;
        cam.y += (ty - cam.y) * 0.12;
        clampCam();
    }

    function updateMajor() {
        const now = Date.now();

        // Stordita: non si muove e non può prendere il player
        if (now < majorStunnedUntil) return;

        const px = player.x + player.w / 2, py = player.y + player.h / 2;
        const mx = major.x + major.w / 2,   my = major.y + major.h / 2;

        // Punto target = posizione DIETRO al player rispetto alla sua direzione.
        // "dietro" = opposto della direzione in cui il player sta guardando.
        const BEHIND = TILE * 2.2;
        let targetX = px, targetY = py;
        switch (player.dir) {
            case 'front': targetY -= BEHIND; break;  // player guarda giù → dietro è sopra
            case 'back':  targetY += BEHIND; break;  // player guarda su  → dietro è sotto
            case 'left':  targetX += BEHIND; break;  // player guarda sx  → dietro è dx
            case 'right': targetX -= BEHIND; break;  // player guarda dx  → dietro è sx
        }

        let dx = targetX - mx, dy = targetY - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 1) {
            dx /= dist; dy /= dist;
            const spd = major.speed;
            const nx = major.x + dx * spd;
            const ny = major.y + dy * spd;
            if (!wallAt(nx, major.y, major.w, major.h)) major.x = nx;
            if (!wallAt(major.x, ny, major.w, major.h)) major.y = ny;
            if (Math.abs(dx) > Math.abs(dy)) major.dir = dx < 0 ? 'left' : 'right';
            else                             major.dir = dy < 0 ? 'back' : 'front';
        }

        if (now > invincibleUntil && rectOverlap(player, major, 6)) {
            if (player.inCar) onMajorRunOver();
            else              onCaught();
        }
    }

    function onCaught() {
        lives--;
        spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#ff1493', 24);
        invincibleUntil = Date.now() + INVINCIBLE_MS;
        updateHUD();
        if (lives <= 0) gameOver();
    }

    function onMajorRunOver() {
        const mx = major.x + major.w / 2, my = major.y + major.h / 2;
        spawnParticles(mx, my, '#ffcc00', 32);
        spawnParticles(mx, my, '#ff6600', 20);
        score += SCORE_RUNOVER;
        majorStunnedUntil = Date.now() + MAJOR_STUN_MS;
        showLevelFlash('+' + SCORE_RUNOVER + ' INVESTITA!');
        updateHUD();
    }

    function onCarCrash() {
        const cx = player.x + player.w / 2, cy = player.y + player.h / 2;
        spawnParticles(cx, cy, '#ff6600', 30);
        spawnParticles(cx, cy, '#ffcc00', 20);
        spawnParticles(cx, cy, '#ff0000', 18);
        lives--;
        player.inCar = false;
        car.vx = 0; car.vy = 0;
        invincibleUntil = Date.now() + INVINCIBLE_MS;
        // La macchina va all'autodemolizione
        const junk = roadCenter(CAR_JUNK_COL, CAR_JUNK_ROW);
        car.x = junk.x; car.y = junk.y;
        showLevelFlash('INCIDENTE!');
        updateHUD();
        if (lives <= 0) gameOver();
    }

    function updateVinyls() {
        const cx = player.x + player.w / 2, cy = player.y + player.h / 2;
        for (const v of vinyls) {
            if (v.collected) continue;
            v.angle += 0.04;
            const dx = v.x - cx, dy = v.y - cy;
            if (Math.sqrt(dx * dx + dy * dy) < TILE * 0.7) {
                v.collected = true; score += SCORE_VINYL; vinylsLeft--;
                spawnParticles(v.x, v.y, '#00ffff', 16);
                updateHUD();
                if (vinylsLeft <= 0) nextLevel();
            }
        }
    }

    function updateParticles(dt) {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx; p.y += p.vy; p.vy += 0.07; p.life -= dt;
            if (p.life <= 0) particles.splice(i, 1);
        }
    }

    function nextLevel() {
        level++;
        score += level * 200;
        major.speed = MAJOR_SPEEDS[Math.min(level - 1, MAJOR_SPEEDS.length - 1)];
        spawnVinyls();
        vinylsLeft = VINYL_COUNT;
        showLevelFlash('LIVELLO ' + level + '!');
        updateHUD();
    }

    function gameOver() {
        state = 'dead'; cancelAnimationFrame(animFrame);
        const el = document.getElementById('go-score');
        if (el) el.textContent = 'PUNTEGGIO: ' + score;
        showOverlay('gameover'); idleLoop();
    }

    // ─── DRAW ────────────────────────────────────────────────────────────────
    function draw() {
        ctx.clearRect(0, 0, VIEW_W, VIEW_H);
        drawMapBg();
        drawVinyls();
        drawCar();
        drawNPCs();
        drawMajor();
        drawPlayer();
        drawParticles();
        drawDangerVignette();
    }

    function drawIdle() {
        ctx.clearRect(0, 0, VIEW_W, VIEW_H);
        if (mapImg && mapImg.naturalWidth) {
            ctx.drawImage(mapImg, -cam.x, -cam.y, MAP_W, MAP_H);
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(0, 0, VIEW_W, VIEW_H);
        } else {
            ctx.fillStyle = '#0a0612'; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
        }
    }

    function drawMapBg() {
        if (mapImg && mapImg.naturalWidth) {
            ctx.drawImage(mapImg, -cam.x, -cam.y, MAP_W, MAP_H);
        } else {
            ctx.fillStyle = '#c8934a'; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
        }
    }

    function drawVinyls() {
        for (const v of vinyls) {
            if (v.collected) continue;
            const s = ws(v.x, v.y);
            if (outOfView(s.x, s.y, 30)) continue;
            ctx.save();
            ctx.translate(s.x, s.y); ctx.rotate(v.angle);
            ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.fillStyle = '#111'; ctx.fill();
            ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 2.5; ctx.stroke();
            ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#ff1493'; ctx.fill();
            ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#000'; ctx.fill();
            ctx.restore();
            // glow
            ctx.save();
            ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 14;
            ctx.beginPath(); ctx.arc(s.x, s.y, 15, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0,255,255,0.25)'; ctx.lineWidth = 5; ctx.stroke();
            ctx.restore();
        }
    }

    // Disegna uno sprite centrato su (wx, wy) con dimensioni w×h
    function drawSprite(key, wx, wy, w, h, alpha) {
        const s   = ws(wx, wy);
        if (outOfView(s.x, s.y, Math.max(w, h))) return;
        const img = SPR[key];
        if (!img || !img.naturalWidth) return;
        ctx.save();
        if (alpha !== undefined) ctx.globalAlpha = alpha;
        ctx.drawImage(img, s.x - w / 2, s.y - h / 2, w, h);
        ctx.restore();
    }

    function drawCar() {
        const cx = car.x + car.w / 2;
        const cy = car.y + car.h / 2;
        const s  = ws(cx, cy);
        if (outOfView(s.x, s.y, CAR_SPR_W)) return;

        if (!player.inCar) {
            // Macchina parcheggiata
            blitSprite('macchina1', s.x, s.y, CAR_SPR_W, CAR_SPR_H);

            // Prompt "[ E ] SALI" quando il player è vicino
            const d = dist2d(player, car);
            if (d < CAR_BOARD_DIST + 20) {
                const t = Math.min(1, (CAR_BOARD_DIST + 20 - d) / 40);
                ctx.save();
                ctx.globalAlpha = t;
                ctx.font = 'bold 12px monospace';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#fff';
                ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
                ctx.fillText('[ E ] SALI', s.x, s.y - CAR_SPR_H / 2 - 6);
                ctx.restore();
            }
        }
    }

    function drawNPCs() {
        for (const npc of npcs) {
            const cx = npc.x + SPR_W / 2;
            const cy = npc.y + SPR_H / 2;
            const s  = ws(cx, cy);
            if (outOfView(s.x, s.y, SPR_W)) continue;
            blitSprite(npc.sprite, s.x, s.y, SPR_W, SPR_H);
        }
    }

    function drawMajor() {
        const now  = Date.now();
        const cx   = major.x + major.w / 2;
        const cy   = major.y + major.h / 2;
        const key  = 'major_' + major.dir;
        const s    = ws(cx, cy);

        // Stordita: lampeggia velocemente
        const stunned = now < majorStunnedUntil;
        if (stunned && Math.floor(now / 80) % 2 === 0) return;

        const near = !stunned && dist2d(player, major) < TILE * 4;
        ctx.save();
        if (stunned) ctx.globalAlpha = 0.7;
        ctx.shadowColor = stunned ? '#ffcc00' : (near ? '#ff0000' : 'rgba(255,0,0,0.4)');
        ctx.shadowBlur  = stunned ? 24 : (near ? 20 + Math.sin(now * 0.01) * 8 : 6);
        blitSprite(key, s.x, s.y, SPR_W, SPR_H);
        ctx.restore();
    }

    function drawPlayer() {
        if (Date.now() < invincibleUntil && Math.floor(Date.now() / 120) % 2 === 0) return;
        const cx = player.x + player.w / 2;
        const cy = player.y + player.h / 2;
        const s  = ws(cx, cy);

        if (player.inCar) {
            // Sceglie sprite in base alla direzione / velocità reale
            const absVX = Math.abs(car.vx), absVY = Math.abs(car.vy);
            const moving = absVX > 0.5 || absVY > 0.5;
            let carKey, flipH = false;
            if (!moving) {
                carKey = 'macchina1';
            } else if (absVX >= absVY) {
                carKey = 'macchina2';
                flipH  = car.vx > 0;   // macchina2 guarda a sinistra → flip per andare a destra
            } else {
                carKey = car.vy > 0 ? 'frontcar' : 'retrocar';
            }

            ctx.save();
            ctx.shadowColor = '#ff1493'; ctx.shadowBlur = 16;
            if (flipH) {
                ctx.translate(s.x, s.y);
                ctx.scale(-1, 1);
                blitSprite(carKey, 0, 0, CAR_SPR_W, CAR_SPR_H);
            } else {
                blitSprite(carKey, s.x, s.y, CAR_SPR_W, CAR_SPR_H);
            }
            ctx.restore();
            // Prompt "[ E ] ESCI"
            ctx.save();
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
            ctx.fillText('[ E ] ESCI', s.x, s.y - CAR_SPR_H / 2 - 6);
            ctx.restore();
            return;
        }

        const key = 'pirrons_' + player.dir;
        ctx.save();
        ctx.shadowColor = '#ff1493'; ctx.shadowBlur = 12;
        blitSprite(key, s.x, s.y, SPR_W, SPR_H);
        ctx.restore();
    }

    function drawParticles() {
        for (const p of particles) {
            const s = ws(p.x, p.y);
            ctx.globalAlpha = Math.max(0, p.life / 700);
            ctx.fillStyle   = p.color;
            ctx.beginPath(); ctx.arc(s.x, s.y, p.size, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function drawDangerVignette() {
        const d = dist2d(player, major);
        if (d < TILE * 3) {
            const alpha = (1 - d / (TILE * 3)) * 0.22;
            ctx.fillStyle = `rgba(255,0,0,${alpha})`;
            ctx.fillRect(0, 0, VIEW_W, VIEW_H);
        }
    }

    // ─── COLLISIONI ──────────────────────────────────────────────────────────
    function wallAt(x, y, w, h) {
        const pts = [
            [x + 2,     y + 2    ],
            [x + w - 2, y + 2    ],
            [x + 2,     y + h - 2],
            [x + w - 2, y + h - 2],
            [x + w / 2, y + h / 2],  // centro
        ];
        for (const [px, py] of pts) {
            const c = Math.floor(px / TILE);
            const r = Math.floor(py / TILE);
            if (r < 0 || r >= MAP_ROWS || c < 0 || c >= MAP_COLS) return true;
            if (COLL[r][c] === 1) return true;
        }
        return false;
    }

    function rectOverlap(a, b, sh = 0) {
        return a.x + sh < b.x + b.w - sh && a.x + a.w - sh > b.x + sh &&
               a.y + sh < b.y + b.h - sh && a.y + a.h - sh > b.y + sh;
    }

    function dist2d(a, b) {
        const dx = (a.x + a.w / 2) - (b.x + b.w / 2);
        const dy = (a.y + a.h / 2) - (b.y + b.h / 2);
        return Math.sqrt(dx * dx + dy * dy);
    }

    function outOfView(sx, sy, margin) {
        return sx < -margin || sx > VIEW_W + margin || sy < -margin || sy > VIEW_H + margin;
    }

    function spawnParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2, spd = 1.5 + Math.random() * 3;
            particles.push({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
                color, size: 3 + Math.random() * 4, life: 400 + Math.random() * 300 });
        }
    }

    // ─── HUD ─────────────────────────────────────────────────────────────────
    function updateHUD() {
        const $ = id => document.getElementById(id);
        if ($('hud-score'))  $('hud-score').textContent  = String(score).padStart(6, '0');
        if ($('hud-level'))  $('hud-level').textContent  = level;
        if ($('hud-vinyls')) $('hud-vinyls').textContent = vinylsLeft;
        const livesEl = $('hud-lives');
        if (livesEl) {
            livesEl.innerHTML = '';
            for (let i = 0; i < LIVES_START; i++) {
                const sp = document.createElement('span');
                sp.className  = 'life-icon' + (i < lives ? '' : ' lost');
                sp.textContent = '♥';
                livesEl.appendChild(sp);
            }
        }
    }

    // ─── OVERLAY ─────────────────────────────────────────────────────────────
    function showOverlay(which) {
        ['start','gameover','paused'].forEach(id => {
            const el = document.getElementById('overlay-' + id);
            if (el) el.classList.toggle('hidden', id !== which);
        });
    }

    function hideAllOverlays() {
        ['start','gameover','paused'].forEach(id => {
            const el = document.getElementById('overlay-' + id);
            if (el) el.classList.add('hidden');
        });
    }

    function showLevelFlash(text) {
        const el = document.getElementById('level-flash');
        if (!el) return;
        el.textContent = text; el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 1500);
    }

    // ─── EVENTI ──────────────────────────────────────────────────────────────
    function bindEvents() {
        document.addEventListener('keydown', e => {
            keys[e.key] = true;
            if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
                if (state === 'playing') pauseGame();
                else if (state === 'paused') resumeGame();
            }
            if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','e','E'].includes(e.key)) e.preventDefault();
        });
        document.addEventListener('keyup', e => { keys[e.key] = false; });

        bindBtn('btn-start',   startGame);
        bindBtn('btn-restart', startGame);
        bindBtn('btn-resume',  resumeGame);

        bindMobile('mbtn-up',    { x:  0, y: -1 });
        bindMobile('mbtn-down',  { x:  0, y:  1 });
        bindMobile('mbtn-left',  { x: -1, y:  0 });
        bindMobile('mbtn-right', { x:  1, y:  0 });
    }

    function bindBtn(id, fn) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', fn);
    }

    function bindMobile(id, dir) {
        const el = document.getElementById(id);
        if (!el) return;
        const on  = e => { e.preventDefault(); touchDir = dir; };
        const off = e => { e.preventDefault(); if (touchDir === dir) touchDir = null; };
        el.addEventListener('touchstart', on,  { passive: false });
        el.addEventListener('touchend',   off, { passive: false });
        el.addEventListener('mousedown', on);
        el.addEventListener('mouseup',   off);
        el.addEventListener('mouseleave',off);
    }

    // ─── FLUSSO ──────────────────────────────────────────────────────────────
    function startGame() {
        score = 0; lives = LIVES_START; level = 1;
        setupGame(); hideAllOverlays(); updateHUD();
        state = 'playing'; startLoop();
    }

    function pauseGame() {
        state = 'paused'; cancelAnimationFrame(animFrame);
        showOverlay('paused'); idleLoop();
    }

    function resumeGame() {
        if (state !== 'paused') return;
        hideAllOverlays(); state = 'playing'; startLoop();
    }

    // ─── UTILS ───────────────────────────────────────────────────────────────
    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // ─── TRAILER ─────────────────────────────────────────────────────────────
    function initTrailer() {
        // Rimuovi eventuale trailer precedente
        var old = document.getElementById('sdm-trailer');
        if (old) old.remove();

        // Costruisci il trailer direttamente su <body> (fuori da <main>)
        // così position:fixed funziona sempre e z-index 10001 batte il router overlay (10000)
        var trailer = document.createElement('div');
        trailer.id = 'sdm-trailer';
        trailer.style.cssText = [
            'position:fixed', 'inset:0', 'z-index:10001',
            'background:#000', 'display:flex',
            'align-items:center', 'justify-content:center'
        ].join(';');

        var video = document.createElement('video');
        video.src = 'visual%20sito/semideef.mp4';
        video.playsInline = true;
        video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;';

        var skipBtn = document.createElement('button');
        skipBtn.textContent = 'SALTA ▶';
        skipBtn.style.cssText = [
            'position:absolute', 'top:70px', 'right:20px', 'z-index:3',
            'background:rgba(0,0,0,0.65)', 'border:1px solid rgba(255,255,255,0.25)',
            'color:rgba(255,255,255,0.6)', 'font-size:11px',
            'padding:6px 14px', 'cursor:pointer',
            'text-transform:uppercase', 'letter-spacing:1px'
        ].join(';');

        var cta = document.createElement('div');
        cta.style.cssText = [
            'opacity:0', 'pointer-events:none',
            'position:absolute', 'inset:0', 'display:flex',
            'align-items:center', 'justify-content:center',
            'background:rgba(0,0,0,0.75)', 'z-index:2',
            'transition:opacity 0.5s ease'
        ].join(';');

        var startImg = document.createElement('img');
        startImg.src = 'visual%20sito/start_button.gif';
        startImg.alt = 'START';
        startImg.style.cssText = 'max-width:min(420px,75vw);width:100%;cursor:pointer;display:block;';

        cta.appendChild(startImg);
        trailer.appendChild(video);
        trailer.appendChild(skipBtn);
        trailer.appendChild(cta);
        document.body.appendChild(trailer);

        var ctaShown = false;

        function showCta() {
            if (ctaShown) return;
            ctaShown = true;
            video.pause();
            skipBtn.style.display = 'none';
            cta.style.opacity = '1';
            cta.style.pointerEvents = 'auto';
        }

        function launchGame() {
            trailer.style.transition = 'opacity 0.4s ease';
            trailer.style.opacity = '0';
            trailer.style.pointerEvents = 'none';
            setTimeout(function () {
                trailer.remove();
                var btn = document.getElementById('btn-start');
                if (btn) btn.click();
            }, 400);
        }

        video.addEventListener('ended', showCta);
        video.addEventListener('timeupdate', function () {
            if (!ctaShown && video.duration > 0 && !isNaN(video.duration) &&
                video.currentTime >= video.duration - 0.4) {
                showCta();
            }
        });

        skipBtn.addEventListener('click', showCta);
        startImg.addEventListener('click', launchGame);

        // Prova con audio; se bloccato, riprova muted (il video deve girare)
        var p = video.play();
        if (p !== undefined) {
            p.catch(function () {
                video.muted = true;
                video.play().catch(function () {
                    // Anche muted bloccato: mostra direttamente il CTA
                    showCta();
                });
            });
        }
    }

// ─── EXPORT ──────────────────────────────────────────────────────────────
    window.initGioco = function () {
        cancelAnimationFrame(animFrame);
        state = 'start'; score = 0; lives = LIVES_START; level = 1;
        cam = { x: 0, y: 0 };
        init();
    };

    document.addEventListener('DOMContentLoaded', window.initGioco);
})();
