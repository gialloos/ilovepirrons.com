// Live page functionality
async function initLive() {
    const eventsGrid = document.getElementById('events-grid');
    const pastEventsGrid = document.getElementById('past-events-grid');
    if (!eventsGrid || !pastEventsGrid) return;

    // Prevent double init
    if (eventsGrid.dataset.initialized) return;
    eventsGrid.dataset.initialized = 'true';

    try {
        const response = await fetch('data/events.json');
        const events = await response.json();
        
        eventsGrid.innerHTML = '';
        pastEventsGrid.innerHTML = '';

        const upcoming = events.filter(e => new Date(e.date) >= new Date());
        const past = events.filter(e => new Date(e.date) < new Date());
        
        upcoming.forEach(event => {
            const eventElement = createEventCard(event, true);
            eventsGrid.appendChild(eventElement);
        });
        
        past.forEach(event => {
            const eventElement = createEventCard(event, false);
            pastEventsGrid.appendChild(eventElement);
        });
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

function createEventCard(event, isUpcoming) {
    const card = document.createElement('div');
    card.className = `event-card ${isUpcoming ? 'upcoming' : ''}`;
    
    const imageHTML = event.image ? `<img src="${event.image}" alt="${event.title}" class="event-image">` : '';
    const countdownHTML = isUpcoming ? `<div class="countdown" data-date="${event.date}">Loading countdown...</div>` : '';
    
    card.innerHTML = `
        ${imageHTML}
        <div class="event-date">${formatDate(event.date)}</div>
        <h3 class="event-title">${event.title}</h3>
        <div class="event-location">📍 ${event.location}</div>
        <div class="event-description">${event.description}</div>
        ${countdownHTML}
    `;
    
    if (isUpcoming) {
        const countdownEl = card.querySelector('.countdown');
        if (countdownEl) {
            updateCountdown(countdownEl, event.date);
            setInterval(() => updateCountdown(countdownEl, event.date), 1000);
        }
    }
    
    return card;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
}

function updateCountdown(element, dateString) {
    const now = new Date();
    const eventDate = new Date(dateString);
    const diff = eventDate - now;
    
    if (diff <= 0) {
        element.textContent = 'EVENT STARTED!';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    element.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

window.initLive = initLive;
document.addEventListener('DOMContentLoaded', initLive);

