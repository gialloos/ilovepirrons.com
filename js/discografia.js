// Discografia page functionality (Genius-style annotations)
let albums = [];
let currentSong = null;

function escHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function initDiscografia() {
    const albumsGrid    = document.getElementById('albums-grid');
    const backBtn       = document.getElementById('back-btn');
    const songDetail    = document.getElementById('song-detail');
    const albumsSection = document.querySelector('.albums-section');

    if (!albumsGrid) return;
    if (albumsGrid.dataset.initialized) return;
    albumsGrid.dataset.initialized = 'true';

    try {
        albums = window.DISCOGRAFIA_DATA
            || await fetch('data/discografia.json?v=' + Date.now()).then(r => r.json());
        displayAlbums();
    } catch (error) {
        console.error('Error loading albums:', error);
    }

    if (backBtn) {
        backBtn.onclick = () => {
            if (songDetail)    songDetail.style.display    = 'none';
            if (albumsSection) albumsSection.style.display = 'block';
            currentSong = null;
        };
    }

    const annotationPopup = document.getElementById('annotation-popup');
    const annotationClose = document.getElementById('annotation-close');
    if (annotationClose) annotationClose.onclick = () => annotationPopup.classList.remove('active');
    if (annotationPopup) annotationPopup.onclick  = e => { if (e.target === annotationPopup) annotationPopup.classList.remove('active'); };
}

function displayAlbums() {
    const albumsGrid = document.getElementById('albums-grid');
    if (!albumsGrid) return;
    albumsGrid.innerHTML = '';
    albums.forEach(album => albumsGrid.appendChild(createAlbumCard(album)));
}

function createAlbumCard(album) {
    const card = document.createElement('div');
    card.className = 'album-card';
    card.innerHTML = `
        <img src="${escHtml(album.cover || 'assets/common/placeholder.png')}" alt="${escHtml(album.title)}" class="album-cover">
        <h3 class="album-title">${escHtml(album.title)}</h3>
        <div class="album-year">${escHtml(String(album.year))}</div>
        <div class="album-tracks-count">${album.tracks.length === 1 ? 'Singolo' : album.tracks.length + ' brani'}</div>
    `;
    card.addEventListener('click', () => showAlbumTracks(album));
    return card;
}

function showAlbumTracks(album) {
    const albumsSection  = document.querySelector('.albums-section');
    const songDetail     = document.getElementById('song-detail');
    const lyricsContainer = document.getElementById('lyrics-container');

    window.currentAlbum = album;
    if (albumsSection) albumsSection.style.display = 'none';
    if (songDetail)    songDetail.style.display    = 'block';

    if (album.tracks.length === 1) { loadSong(album.id, 0); return; }

    if (lyricsContainer) {
        // Usa event delegation invece di onclick inline
        lyricsContainer.innerHTML = `
            <div style="text-align:center;margin-bottom:30px;">
                <h2 style="color:var(--hot-pink);margin-bottom:20px;">${escHtml(album.title)}</h2>
                <div style="display:flex;flex-direction:column;gap:10px;">
                    ${album.tracks.map((track, index) => `
                        <div class="song-item track-select" data-album="${escHtml(String(album.id))}" data-index="${index}" style="cursor:pointer;">
                            <div class="song-info">
                                <div class="song-title">${index + 1}. ${escHtml(track.title)}</div>
                                <div class="song-artist">${escHtml(track.duration || '')}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        lyricsContainer.addEventListener('click', e => {
            const row = e.target.closest('.track-select');
            if (row) loadSong(Number(row.dataset.album), Number(row.dataset.index));
        });
    }
}

window.loadSong = function(albumId, trackIndex) {
    const album = albums.find(a => a.id === albumId);
    if (!album || !album.tracks[trackIndex]) return;

    const track = album.tracks[trackIndex];
    currentSong = { ...track, album: album.title, artist: album.artist, lyrics: track.lyrics || [] };

    const els = {
        title:    document.getElementById('song-title'),
        artist:   document.getElementById('song-artist'),
        album:    document.getElementById('song-album'),
        about:    document.getElementById('song-about'),
        funFacts: document.getElementById('fun-facts'),
        credits:  document.getElementById('credits')
    };

    if (els.title)  els.title.textContent  = track.title;
    if (els.artist) els.artist.textContent = album.artist;
    if (els.album)  els.album.textContent  = album.title;
    if (els.about)  els.about.textContent  = track.about || 'No description available.';

    if (els.funFacts) {
        els.funFacts.innerHTML = track.funFacts && track.funFacts.length > 0
            ? track.funFacts.map(f => `<li>${escHtml(f)}</li>`).join('')
            : '<li>No fun facts available.</li>';
    }

    if (els.credits) {
        els.credits.innerHTML = track.credits
            ? Object.entries(track.credits).map(([k, v]) =>
                `<div class="credit-item"><span class="credit-label">${escHtml(k)}:</span> ${escHtml(v)}</div>`
              ).join('')
            : '<div class="credit-item">No credits available.</div>';
    }

    renderAnnotatedLyrics(track.lyrics || []);
};

function renderAnnotatedLyrics(lyrics) {
    const lyricsContainer = document.getElementById('lyrics-container');
    if (!lyricsContainer) return;

    lyricsContainer.innerHTML = lyrics.map((line, index) => {
        const cls = 'lyrics-line' + (line.annotation ? ' annotated' : '');
        return `<div class="${cls}" data-index="${index}">${escHtml(line.text)}</div>`;
    }).join('');

    // Event delegation per hover e click — niente onclick inline
    lyricsContainer.addEventListener('mouseover', e => {
        const el = e.target.closest('.lyrics-line');
        if (el && !el.classList.contains('annotated')) el.classList.add('highlighted');
    });
    lyricsContainer.addEventListener('mouseout', e => {
        const el = e.target.closest('.lyrics-line');
        if (el) el.classList.remove('highlighted');
    });
    lyricsContainer.addEventListener('click', e => {
        const el = e.target.closest('.annotated');
        if (el) showAnnotation(Number(el.dataset.index));
    });
}

window.showAnnotation = function(index) {
    if (!currentSong?.lyrics?.[index]?.annotation) return;
    const ann   = currentSong.lyrics[index].annotation;
    const popup = document.getElementById('annotation-popup');
    const title = document.getElementById('annotation-title');
    const text  = document.getElementById('annotation-text');
    if (title) title.textContent = ann.title || 'Annotation';
    if (text)  text.textContent  = ann.text;
    if (popup) popup.classList.add('active');
};

window.initDiscografia = initDiscografia;
document.addEventListener('DOMContentLoaded', initDiscografia);
