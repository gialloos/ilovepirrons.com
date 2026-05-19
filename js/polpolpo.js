/**
 * polpolpo.js
 * Polpo + farfalle vaganti — solo nella homepage.
 * Nascosti su tutte le altre pagine.
 */

/* ── Utility ── */
function isHomePage() {
    const p = window.location.pathname;
    return p === '/' || p.endsWith('index.html') || p.endsWith('/');
}

function isGamePage() {
    return window.location.pathname.includes('gioco') ||
           !!document.querySelector('.gioco-container');
}

/* ── Wanderer class ── */
class Wanderer {
    constructor({ src, size, speed, opacity = 1, zIndex = 500, startX = null, startY = null }) {
        this.size          = size;
        this.speed         = speed;
        this.targetOpacity = opacity;

        this.el = document.createElement('div');
        this.el.style.cssText = `
            position:fixed; top:0; left:0;
            pointer-events:none; user-select:none;
            z-index:${zIndex}; opacity:0;
            will-change:transform;
            transition:opacity 1.4s ease;
        `;
        const img = document.createElement('img');
        img.src = src;
        img.draggable = false;
        img.style.cssText = `
            width:${size}px; height:auto; display:block;
            image-rendering:pixelated;
        `;
        this.el.appendChild(img);
        document.body.appendChild(this.el);

        const navH = 72;
        const half = size / 2;
        this.x = startX !== null ? startX : half + Math.random() * (window.innerWidth  - size);
        this.y = startY !== null ? startY : navH + half + Math.random() * (window.innerHeight - navH - size);

        const a = Math.random() * Math.PI * 2;
        this.vx = Math.cos(a) * speed;
        this.vy = Math.sin(a) * speed;

        this.lastTurn  = 0;
        this.TURN_MS   = 4000 + Math.random() * 4000;
    }

    move(ts) {
        const navH = 72;
        const half = this.size / 2;
        const W    = window.innerWidth;
        const H    = window.innerHeight;

        /* cambio di direzione casuale */
        if (ts - this.lastTurn > this.TURN_MS + Math.random() * 3000) {
            this.lastTurn = ts;
            this.TURN_MS  = 3000 + Math.random() * 5000;
            const a = Math.random() * Math.PI * 2;
            this.vx += Math.cos(a) * 0.3;
            this.vy += Math.sin(a) * 0.3;
            const spd    = Math.hypot(this.vx, this.vy) || 1;
            const target = this.speed * (0.5 + Math.random() * 1.0);
            this.vx = (this.vx / spd) * target;
            this.vy = (this.vy / spd) * target;
        }

        this.x += this.vx;
        this.y += this.vy;

        /* rimbalzo sui bordi */
        if (this.x < half)        { this.x = half;        this.vx =  Math.abs(this.vx); }
        if (this.x > W - half)    { this.x = W - half;    this.vx = -Math.abs(this.vx); }
        if (this.y < navH + half) { this.y = navH + half; this.vy =  Math.abs(this.vy); }
        if (this.y > H - half)    { this.y = H - half;    this.vy = -Math.abs(this.vy); }

        this.el.style.transform = `translate(${this.x - half}px, ${this.y - half}px)`;
    }

    show(visible) { this.el.style.display = visible ? 'block' : 'none'; }
    remove()      { this.el.remove(); }
}

/* ── Main controller ── */
const HomeCreatures = {
    wanderers: [],
    running:   false,

    init() {
        if (!isHomePage()) return;   // solo homepage
        this._spawn();
        this._startLoop();
        this._fadeIn();
        this._listenNav();
    },

    _fadeIn() {
        /* piccolo delay per far sì che siano già posizionati prima di apparire */
        setTimeout(() => {
            this.wanderers.forEach(w => {
                w.el.style.opacity = w.targetOpacity;
            });
        }, 120);
    },

    _spawn() {
        const POLPO_SRC    = 'visual%20sito/POLPOLPO.gif';
        const FARFALLA_SRC = 'visual%20sito/FARFALLA.gif';

        const polpoSize = window.innerWidth < 480 ? 150
                        : window.innerWidth < 768 ? 210
                        : 340;

        const OCCHIO_SRC = 'visual%20sito/OCCHIO.gif';

        /* 4 polpi */
        this.wanderers.push(new Wanderer({ src: POLPO_SRC, size: polpoSize,        speed: 0.60, opacity: 0.88, zIndex: 2 }));
        this.wanderers.push(new Wanderer({ src: POLPO_SRC, size: polpoSize * 0.62, speed: 0.45, opacity: 0.70, zIndex: 2 }));
        this.wanderers.push(new Wanderer({ src: POLPO_SRC, size: polpoSize * 0.48, speed: 0.55, opacity: 0.65, zIndex: 2 }));
        this.wanderers.push(new Wanderer({ src: POLPO_SRC, size: polpoSize * 0.35, speed: 0.70, opacity: 0.55, zIndex: 2 }));

        /* 6 occhi di dimensioni diverse */
        this.wanderers.push(new Wanderer({ src: OCCHIO_SRC, size: 120, speed: 0.45, opacity: 0.82, zIndex: 2 }));
        this.wanderers.push(new Wanderer({ src: OCCHIO_SRC, size: 90,  speed: 0.55, opacity: 0.72, zIndex: 2 }));
        this.wanderers.push(new Wanderer({ src: OCCHIO_SRC, size: 110, speed: 0.50, opacity: 0.78, zIndex: 2 }));
        this.wanderers.push(new Wanderer({ src: OCCHIO_SRC, size: 70,  speed: 0.65, opacity: 0.68, zIndex: 2 }));
        this.wanderers.push(new Wanderer({ src: OCCHIO_SRC, size: 55,  speed: 0.75, opacity: 0.60, zIndex: 2 }));
        this.wanderers.push(new Wanderer({ src: OCCHIO_SRC, size: 40,  speed: 0.85, opacity: 0.55, zIndex: 2 }));

        /* 35 farfalle distribuite su una griglia 5×7 per coprire tutta la pagina */
        const COLS = 5, ROWS = 7;
        const navH = 72;
        const cellW = window.innerWidth  / COLS;
        const cellH = (window.innerHeight - navH) / ROWS;

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const size  = 30 + Math.random() * 75;   /* 30–105 px */
                const speed = 0.35 + Math.random() * 0.75;
                const half  = size / 2;

                /* posizione iniziale al centro della cella + jitter */
                const jX = (Math.random() - 0.5) * (cellW * 0.6);
                const jY = (Math.random() - 0.5) * (cellH * 0.6);
                const sx  = Math.max(half, Math.min(window.innerWidth  - half, cellW * (c + 0.5) + jX));
                const sy  = Math.max(navH + half, Math.min(window.innerHeight - half, navH + cellH * (r + 0.5) + jY));

                this.wanderers.push(new Wanderer({
                    src:     FARFALLA_SRC,
                    size,    speed,
                    opacity: 0.50 + Math.random() * 0.40,
                    zIndex:  2,
                    startX:  sx,
                    startY:  sy,
                }));
            }
        }
    },

    _startLoop() {
        if (this.running) return;
        this.running = true;
        const tick = (ts) => {
            if (isHomePage() && !isGamePage()) {
                this.wanderers.forEach(w => w.move(ts));
            }
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    },

    _setVisible(visible) {
        this.wanderers.forEach(w => w.show(visible));
    },

    _listenNav() {
        const update = () => {
            setTimeout(() => this._setVisible(isHomePage() && !isGamePage()), 200);
        };
        window.addEventListener('popstate',     update);
        window.addEventListener('spa-navigate', update);
        document.addEventListener('click', (e) => {
            if (e.target.closest('a[href]')) update();
        });
    }
};

document.addEventListener('DOMContentLoaded', () => HomeCreatures.init());
