// Live page functionality
let _countdownIntervals = [];

async function initLive() {
    const eventsGrid     = document.getElementById('events-grid');
    const pastEventsGrid = document.getElementById('past-events-grid');
    if (!eventsGrid || !pastEventsGrid) return;
    if (eventsGrid.dataset.initialized) return;
    eventsGrid.dataset.initialized = 'true';

    // Pulisci interval countdown da navigazioni precedenti
    _countdownIntervals.forEach(clearInterval);
    _countdownIntervals = [];

    try {
        const response = await fetch('data/events.json');
        const events   = await response.json();

        eventsGrid.innerHTML     = '';
        pastEventsGrid.innerHTML = '';

        const now      = new Date();
        const upcoming = events.filter(e => new Date(e.date) >= now);
        const past     = events.filter(e => new Date(e.date) <  now);

        if (upcoming.length) {
            upcoming.forEach(event => eventsGrid.appendChild(createEventCard(event, true)));
        } else {
            eventsGrid.appendChild(createComingSoon());
        }

        // La sezione // PAST compare solo quando ci sono davvero eventi passati
        const pastSection = pastEventsGrid.closest('.events-section');
        if (past.length) {
            if (pastSection) pastSection.style.display = '';
            past.forEach(event => pastEventsGrid.appendChild(createEventCard(event, false)));
        } else if (pastSection) {
            pastSection.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

function createComingSoon() {
    const el = document.createElement('div');
    el.className = 'coming-soon';
    el.innerHTML = `
        <span class="coming-soon-title">COMING SOON</span>
        <p class="coming-soon-text">Le nuove date live sono in preparazione e verranno annunciate a breve. Resta sintonizzato.</p>
        <span class="coming-soon-badge">// STAY TUNED</span>
    `;
    return el;
}

function escHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function createEventCard(event, isUpcoming) {
    const card = document.createElement('div');
    card.className = `event-card ${isUpcoming ? 'upcoming' : ''}`;

    const imageHTML    = event.image ? `<img src="${escHtml(event.image)}" alt="${escHtml(event.title)}" class="event-image">` : '';
    const countdownHTML = isUpcoming ? `<div class="countdown" data-date="${escHtml(event.date)}">Loading countdown...</div>` : '';

    card.innerHTML = `
        ${imageHTML}
        <div class="event-date">${escHtml(formatDate(event.date))}</div>
        <h3 class="event-title">${escHtml(event.title)}</h3>
        <div class="event-location">📍 ${escHtml(event.location)}</div>
        <div class="event-description">${escHtml(event.description)}</div>
        ${countdownHTML}
    `;

    if (isUpcoming) {
        const countdownEl = card.querySelector('.countdown');
        if (countdownEl) {
            updateCountdown(countdownEl, event.date);
            const id = setInterval(() => updateCountdown(countdownEl, event.date), 1000);
            _countdownIntervals.push(id);
        }
    }

    return card;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

function updateCountdown(element, dateString) {
    const diff = new Date(dateString) - new Date();
    if (diff <= 0) { element.textContent = 'EVENT STARTED!'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);
    element.textContent = `${d}d ${h}h ${m}m ${s}s`;
}

window.initLive = initLive;
document.addEventListener('DOMContentLoaded', initLive);
