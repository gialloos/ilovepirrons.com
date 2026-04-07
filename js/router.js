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

        console.log('Router initialized 1000% smooth.');
    },

    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'router-loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="glitch-text" data-text="SYSTEM_BOOT">SYSTEM_BOOT</div>
                <div class="loading-bar-mini">
                    <div class="loading-bar-fill-mini"></div>
                </div>
                <p style="font-size: 10px; margin-top: 10px; opacity: 0.7;">LINKING TO ILOVEPIRRONS_NET...</p>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    },

    async navigate(url) {
        if (url === window.location.href) return;
        
        // Start transition
        this.loadingOverlay.classList.remove('closing');
        this.loadingOverlay.classList.add('active');
        this.contentArea.classList.add('loading');
        
        try {
            // Artificial delay for animation feel
            await new Promise(resolve => setTimeout(resolve, 600));
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
            }, 500);
        }
    },

    async loadPage(url, updateHistory = true) {
        const response = await fetch(url);
        const html = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Update Title
        document.title = doc.title;
        
        // Extract Main Content
        const newMain = doc.querySelector('main');
        if (newMain) {
            // Smooth swap
            this.contentArea.style.opacity = '0';
            
            setTimeout(() => {
                this.contentArea.innerHTML = newMain.innerHTML;
                this.contentArea.className = newMain.className;
                this.contentArea.style.opacity = '1';
                
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
        // Global scripts re-init
        if (typeof window.initWindows === 'function') window.initWindows();
        
        // Page specific scripts detection
        if (url.includes('blog.html') && typeof window.initBlog === 'function') window.initBlog();
        if (url.includes('live.html') && typeof window.initLive === 'function') window.initLive();
        if (url.includes('download.html') && typeof window.initDownload === 'function') window.initDownload();
        if (url.includes('merch.html') && typeof window.initMerch === 'function') window.initMerch();
        if (url.includes('discografia.html') && typeof window.initDiscografia === 'function') window.initDiscografia();
    }
};

document.addEventListener('DOMContentLoaded', () => Router.init());
