// Windows XP style window dragging functionality
function initWindows() {
    document.querySelectorAll('.xp-window').forEach(win => {
        if (win.dataset.initialized) return;
        win.dataset.initialized = 'true';

        const titlebar = win.querySelector('.window-titlebar');
        if (!titlebar) return;

        let isDragging = false, initialX, initialY, xOffset = 0, yOffset = 0;

        const rect = win.getBoundingClientRect();
        xOffset = rect.left;
        yOffset = rect.top;

        function dragStart(e) {
            if (e.target.classList.contains('window-btn')) return;
            if (!titlebar.contains(e.target)) return;
            initialX  = e.clientX - xOffset;
            initialY  = e.clientY - yOffset;
            isDragging = true;
            win.style.cursor = 'move';
            // Aggiunge i listener solo durante il drag — rimossi su mouseup
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd, { once: true });
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            xOffset = e.clientX - initialX;
            yOffset = e.clientY - initialY;
            win.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        }

        function dragEnd() {
            isDragging = false;
            win.style.cursor = 'default';
            document.removeEventListener('mousemove', drag);
        }

        titlebar.addEventListener('mousedown', dragStart);

        // Controlli finestra
        const closeBtn    = win.querySelector('.window-btn.close');
        const minimizeBtn = win.querySelector('.window-btn.minimize');
        const maximizeBtn = win.querySelector('.window-btn.maximize');

        if (closeBtn)    closeBtn.addEventListener('click',    () => { win.style.display = 'none'; });
        if (minimizeBtn) minimizeBtn.addEventListener('click', () => { win.style.opacity = '0.3'; win.style.pointerEvents = 'none'; });
        if (maximizeBtn) maximizeBtn.addEventListener('click', () => {
            if (win.style.width === '100%') {
                win.style.width = ''; win.style.height = ''; win.style.position = ''; win.style.top = ''; win.style.left = ''; win.style.zIndex = '';
            } else {
                Object.assign(win.style, { width: '100%', height: '100%', position: 'fixed', top: '0', left: '0', zIndex: '9999' });
            }
        });
    });
}

window.initWindows = initWindows;
document.addEventListener('DOMContentLoaded', initWindows);

/* ── Hamburger menu ── */
function initHamburger() {
    const nav = document.querySelector('.main-nav .nav-container');
    if (!nav || document.querySelector('.nav-hamburger')) return;

    const btn = document.createElement('button');
    btn.className = 'nav-hamburger';
    btn.setAttribute('aria-label', 'Menu');
    btn.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(btn);

    const links = nav.querySelector('.nav-links');

    btn.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
    });

    links.addEventListener('click', e => {
        if (e.target.closest('.nav-link')) {
            links.classList.remove('open');
            btn.classList.remove('open');
        }
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('.main-nav')) {
            links.classList.remove('open');
            btn.classList.remove('open');
        }
    });

    window.addEventListener('spa-navigate', () => {
        links.classList.remove('open');
        btn.classList.remove('open');
    });
}

document.addEventListener('DOMContentLoaded', initHamburger);
