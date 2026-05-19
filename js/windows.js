// Windows XP style window dragging functionality
function initWindows() {
    const windows = document.querySelectorAll('.xp-window');
    
    windows.forEach(window => {
        // Prevent double init
        if (window.dataset.initialized) return;
        window.dataset.initialized = 'true';

        const titlebar = window.querySelector('.window-titlebar');
        if (!titlebar) return;

        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        
        // Get initial position
        const rect = window.getBoundingClientRect();
        xOffset = rect.left;
        yOffset = rect.top;
        
        titlebar.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        
        function dragStart(e) {
            if (e.target.classList.contains('window-btn')) return;
            
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            if (e.target === titlebar || titlebar.contains(e.target)) {
                isDragging = true;
                window.style.cursor = 'move';
            }
        }
        
        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                xOffset = currentX;
                yOffset = currentY;
                
                window.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }
        
        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            window.style.cursor = 'default';
        }
        
        // Window controls
        const closeBtn = window.querySelector('.window-btn.close');
        const minimizeBtn = window.querySelector('.window-btn.minimize');
        const maximizeBtn = window.querySelector('.window-btn.maximize');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                window.style.display = 'none';
            });
        }
        
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                window.style.opacity = '0.3';
                window.style.pointerEvents = 'none';
            });
        }
        
        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', () => {
                if (window.style.width === '100%') {
                    window.style.width = '';
                    window.style.height = '';
                } else {
                    window.style.width = '100%';
                    window.style.height = '100%';
                    window.style.position = 'fixed';
                    window.style.top = '0';
                    window.style.left = '0';
                    window.style.zIndex = '9999';
                }
            });
        }
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

    // Chiudi cliccando un link
    links.addEventListener('click', (e) => {
        if (e.target.closest('.nav-link')) {
            links.classList.remove('open');
            btn.classList.remove('open');
        }
    });

    // Chiudi cliccando fuori
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-nav')) {
            links.classList.remove('open');
            btn.classList.remove('open');
        }
    });

    // Chiudi su navigazione SPA
    window.addEventListener('spa-navigate', () => {
        links.classList.remove('open');
        btn.classList.remove('open');
    });
}

document.addEventListener('DOMContentLoaded', initHamburger);

