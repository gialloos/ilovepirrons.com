// Discografia page functionality (Genius-style annotations)
let albums = [];
let currentSong = null;

async function initDiscografia() {
    const albumsGrid = document.getElementById('albums-grid');
    const backBtn = document.getElementById('back-btn');
    const songDetail = document.getElementById('song-detail');
    const albumsSection = document.querySelector('.albums-section');
    
    if (!albumsGrid) return;

    // Prevent double init
    if (albumsGrid.dataset.initialized) return;
    albumsGrid.dataset.initialized = 'true';

    try {
        if (window.DISCOGRAFIA_DATA) {
            albums = window.DISCOGRAFIA_DATA;
        } else {
            const response = await fetch('data/discografia.json?v=' + new Date().getTime());
            albums = await response.json();
        }
        
        displayAlbums();
    } catch (error) {
        console.error('Error loading albums:', error);
    }
    
    if (backBtn) {
        backBtn.onclick = () => {
            if (songDetail) songDetail.style.display = 'none';
            if (albumsSection) albumsSection.style.display = 'block';
            currentSong = null;
        };
    }
    
    const annotationPopup = document.getElementById('annotation-popup');
    const annotationClose = document.getElementById('annotation-close');
    
    if (annotationClose) {
        annotationClose.onclick = () => {
            annotationPopup.classList.remove('active');
        };
    }
    
    if (annotationPopup) {
        annotationPopup.onclick = (e) => {
            if (e.target === annotationPopup) {
                annotationPopup.classList.remove('active');
            }
        };
    }
}

function displayAlbums() {
    const albumsGrid = document.getElementById('albums-grid');
    if (!albumsGrid) return;
    
    albumsGrid.innerHTML = '';
    albums.forEach(album => {
        const albumElement = createAlbumCard(album);
        albumsGrid.appendChild(albumElement);
    });
}

function createAlbumCard(album) {
    const card = document.createElement('div');
    card.className = 'album-card';
    
    card.innerHTML = `
        <img src="${album.cover || 'assets/common/placeholder.png'}" alt="${album.title}" class="album-cover">
        <h3 class="album-title">${album.title}</h3>
        <div class="album-year">${album.year}</div>
        <div class="album-tracks-count">${album.tracks.length === 1 ? 'Singolo' : album.tracks.length + ' brani'}</div>
    `;
    
    card.addEventListener('click', () => {
        showAlbumTracks(album);
    });
    
    return card;
}

function showAlbumTracks(album) {
    const albumsSection = document.querySelector('.albums-section');
    const songDetail = document.getElementById('song-detail');
    const lyricsContainer = document.getElementById('lyrics-container');
    
    window.currentAlbum = album;
    
    if (albumsSection) albumsSection.style.display = 'none';
    if (songDetail) songDetail.style.display = 'block';

    if (album.tracks.length === 1) {
        loadSong(album.id, 0);
        return;
    }
    
    if (lyricsContainer) {
        lyricsContainer.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: var(--hot-pink); margin-bottom: 20px;">${album.title}</h2>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${album.tracks.map((track, index) => `
                        <div class="song-item" style="cursor: pointer;" onclick="loadSong(${album.id}, ${index})">
                            <div class="song-info">
                                <div class="song-title">${index + 1}. ${track.title}</div>
                                <div class="song-artist">${track.duration || ''}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

window.loadSong = function(albumId, trackIndex) {
    const album = albums.find(a => a.id === albumId);
    if (!album || !album.tracks[trackIndex]) return;
    
    const track = album.tracks[trackIndex];
    currentSong = {
        ...track,
        album: album.title,
        artist: album.artist,
        lyrics: track.lyrics || []
    };
    
    const elements = {
        title: document.getElementById('song-title'),
        artist: document.getElementById('song-artist'),
        album: document.getElementById('song-album'),
        about: document.getElementById('song-about'),
        funFacts: document.getElementById('fun-facts'),
        credits: document.getElementById('credits')
    };

    if (elements.title) elements.title.textContent = track.title;
    if (elements.artist) elements.artist.textContent = album.artist;
    if (elements.album) elements.album.textContent = album.title;
    if (elements.about) elements.about.textContent = track.about || 'No description available.';
    
    if (elements.funFacts) {
        if (track.funFacts && track.funFacts.length > 0) {
            elements.funFacts.innerHTML = track.funFacts.map(fact => `<li>${fact}</li>`).join('');
        } else {
            elements.funFacts.innerHTML = '<li>No fun facts available.</li>';
        }
    }
    
    if (elements.credits) {
        if (track.credits) {
            elements.credits.innerHTML = Object.entries(track.credits)
                .map(([key, value]) => `<div class="credit-item"><span class="credit-label">${key}:</span> ${value}</div>`)
                .join('');
        } else {
            elements.credits.innerHTML = '<div class="credit-item">No credits available.</div>';
        }
    }
    
    renderAnnotatedLyrics(track.lyrics || []);
};

function renderAnnotatedLyrics(lyrics) {
    const lyricsContainer = document.getElementById('lyrics-container');
    if (!lyricsContainer) return;
    
    lyricsContainer.innerHTML = lyrics.map((line, index) => {
        let className = 'lyrics-line';
        let annotationId = null;
        
        if (line.annotation) {
            className += ' annotated';
            annotationId = `annotation-${index}`;
        }
        
        return `
            <div class="${className}" 
                 data-annotation-id="${annotationId || ''}"
                 onclick="${line.annotation ? `showAnnotation(${index})` : ''}"
                 onmouseenter="highlightLine(this)"
                 onmouseleave="unhighlightLine(this)">
                ${line.text}
            </div>
        `;
    }).join('');
}

window.highlightLine = function(element) {
    if (!element.classList.contains('annotated')) {
        element.classList.add('highlighted');
    }
};

window.unhighlightLine = function(element) {
    if (!element.classList.contains('annotated')) {
        element.classList.remove('highlighted');
    }
};

window.showAnnotation = function(index) {
    if (!currentSong || !currentSong.lyrics || !currentSong.lyrics[index]) return;
    
    const line = currentSong.lyrics[index];
    if (!line.annotation) return;
    
    const popup = document.getElementById('annotation-popup');
    const title = document.getElementById('annotation-title');
    const text = document.getElementById('annotation-text');
    
    if (title) title.textContent = line.annotation.title || 'Annotation';
    if (text) text.textContent = line.annotation.text;
    
    if (popup) popup.classList.add('active');
};

window.initDiscografia = initDiscografia;
document.addEventListener('DOMContentLoaded', initDiscografia);

