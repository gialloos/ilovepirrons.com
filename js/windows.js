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

/* ── Hamburger menu fullscreen overlay ── */
function initHamburger() {
    const nav = document.querySelector('.main-nav .nav-container');
    if (!nav || document.querySelector('.nav-hamburger')) return;

    // Bottone hamburger
    const btn = document.createElement('button');
    btn.className = 'nav-hamburger';
    btn.setAttribute('aria-label', 'Apri menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(btn);

    // Overlay fullscreen
    const overlay = document.createElement('div');
    overlay.id = 'mobile-menu-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
        <div class="mobile-menu-frame">
            <nav class="mobile-menu-links" id="mobile-menu-links"></nav>
        </div>
    `;
    document.body.appendChild(overlay);

    // Popola i link dall'originale nav-links
    function buildLinks() {
        const mobileLinks = overlay.querySelector('#mobile-menu-links');
        mobileLinks.innerHTML = '';
        nav.querySelectorAll('.nav-link').forEach((a, i) => {
            const clone = document.createElement('a');
            clone.href      = a.href;
            clone.className = 'mobile-nav-link' + (a.classList.contains('active') ? ' active' : '');
            clone.textContent = a.textContent;
            clone.style.animationDelay = `${i * 0.07}s`;
            if (a.hasAttribute('data-no-router')) clone.setAttribute('data-no-router', '');
            mobileLinks.appendChild(clone);
        });
    }

    function openMenu() {
        buildLinks();
        overlay.classList.add('open');
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        overlay.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => overlay.classList.contains('open') ? closeMenu() : openMenu());

    overlay.addEventListener('click', e => {
        if (e.target.closest('.mobile-nav-link')) closeMenu();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('spa-navigate', closeMenu);
}

document.addEventListener('DOMContentLoaded', initHamburger);
