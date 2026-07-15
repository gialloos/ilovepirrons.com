/**
 * router.js - SPA-lite Router for ILOVEPIRRONS
 * Handles seamless navigation without page reloads.
 */

const Router = {
    contentArea: null,
    loadingOverlay: null,

    init() {
        this.contentArea = document.querySelector('main');
        this.loadingOverlay = this.createLoadingOverlay();
        
        // Listen for internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && link.href.startsWith(window.location.origin) && !link.hasAttribute('data-no-router')) {
                e.preventDefault();
                this.navigate(link.href);
            }
        });

        // Listen for history changes (back/forward)
        window.addEventListener('popstate', () => {
            this.loadPage(window.location.href, false);
        });

        // Inizializza gli script della pagina corrente (caricamento diretto)
        this.initializeScripts(window.location.href);
        this.updateNavState();
        console.log('Router initialized 1000% smooth.');
    },

    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'router-loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <img src="visual%20sito/EXPLOSIONE.gif"
                     class="loading-explosion-gif"
                     alt="loading"
                     draggable="false">
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    },

    async navigate(url) {
        if (url === window.location.href) return;

        // Avvisa le pagine che sta per avvenire una navigazione SPA:
        // download.js ferma/rilascia l'audio, windows.js chiude il menu mobile.
        window.dispatchEvent(new CustomEvent('spa-navigate', { detail: { url } }));

        // Ricarica il GIF per resettare l'animazione ad ogni navigazione
        const gif = this.loadingOverlay.querySelector('.loading-explosion-gif');
        if (gif) { const s = gif.src; gif.src = ''; gif.src = s; }

        // Start transition
        this.loadingOverlay.classList.remove('closing');
        this.loadingOverlay.classList.add('active');
        this.contentArea.classList.add('loading');

        try {
            // Durata estesa per godersi il GIF
            await new Promise(resolve => setTimeout(resolve, 1400));
            await this.loadPage(url, true);
        } catch (error) {
            console.error('Navigation error:', error);
            window.location.href = url;
        } finally {
            // End transition
            this.loadingOverlay.classList.add('closing');
            this.contentArea.classList.remove('loading');

            setTimeout(() => {
                this.loadingOverlay.classList.remove('active');
                this.loadingOverlay.classList.remove('closing');
            }, 400);
        }
    },

    async loadPage(url, updateHistory = true) {
        // Failsafe: se il fetch si impianta (es. rete mobile + audio in streaming),
        // aborta dopo 8s → navigate() ricade su un reload hard e l'overlay non resta bloccato.
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        let html;
        try {
            const response = await fetch(url, { signal: controller.signal });
            html = await response.text();
        } finally {
            clearTimeout(timeoutId);
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Update Title
        document.title = doc.title;
        
        // Extract Main Content
        const newMain = doc.querySelector('main');
        if (newMain) {
            // Smooth swap
            this.contentArea.style.opacity = '0';

            // Aggiorna sfondo fuori dal main
            const newBg = doc.getElementById('page-bg');
            const currentBg = document.getElementById('page-bg');
            if (newBg && currentBg) {
                currentBg.className = newBg.className;
                currentBg.innerHTML = newBg.innerHTML;
                const bgVideo = currentBg.querySelector('video');
                if (bgVideo) {
                    bgVideo.muted = true;
                    bgVideo.load();
                    bgVideo.play().catch(() => {});
                }
            }

            setTimeout(() => {
                this.contentArea.innerHTML = newMain.innerHTML;
                this.contentArea.className = newMain.className;
                this.contentArea.style.opacity = '1';

                // Force-play videos injected via innerHTML (autoplay non scatta su elementi creati dinamicamente)
                this.contentArea.querySelectorAll('video').forEach(v => {
                    v.muted = true;
                    v.load();
                    v.play().catch(() => {});
                });

                // Re-initialize scripts
                this.initializeScripts(url);
                this.updateNavState();
                window.scrollTo(0, 0);
            }, 200);
        }

        if (updateHistory) {
            history.pushState(null, '', url);
        }
    },

    updateNavState() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    initializeScripts(url) {
        // Rimuovi il trailer SDM se si naviga via dalla pagina gioco
        if (!url.includes('gioco.html')) {
            var t = document.getElementById('sdm-trailer');
            if (t) t.remove();
        }

        // Global scripts re-init
        if (typeof window.initWindows === 'function') window.initWindows();
        
        // Page specific scripts detection
        if (url.includes('blog.html') && typeof window.initBlog === 'function') window.initBlog();
        if (url.includes('live.html') && typeof window.initLive === 'function') window.initLive();
        if (url.includes('download.html') && typeof window.initDownload === 'function') window.initDownload();
        if (url.includes('merch.html') && typeof window.initMerch === 'function') window.initMerch();
        if (url.includes('discografia.html') && typeof window.initDiscografia === 'function') window.initDiscografia();
        if (url.includes('gioco.html') && typeof window.initGioco === 'function') window.initGioco();
    }
};

document.addEventListener('DOMContentLoaded', () => Router.init());
