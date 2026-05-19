// Download page functionality
let currentSongIndex = -1;
let songs = [];
let isPlaying = false;
let audio = null;
let _playbackInterval = null;

async function initDownload() {
    const songsList = document.getElementById('songs-list');
    if (!songsList) return;
    if (songsList.dataset.initialized) return;
    songsList.dataset.initialized = 'true';

    try {
        const response = await fetch('data/songs.json');
        songs = await response.json();
        songsList.innerHTML = '';
        songs.forEach((song, index) => songsList.appendChild(createSongItem(song, index)));
        setupPlayerControls();
    } catch (error) {
        console.error('Error loading songs:', error);
    }
}

function escHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function createSongItem(song, index) {
    const item = document.createElement('div');
    item.className = 'song-item';
    item.id = `song-item-${index}`;
    item.innerHTML = `
        <span class="song-track-num">${String(index + 1).padStart(2, '0')}</span>
        <div class="song-info">
            <div class="song-title">${escHtml(song.title)}</div>
            <div class="song-artist">${escHtml(song.artist)}</div>
        </div>
        <span class="song-duration">${escHtml(song.duration || '0:00')}</span>
        <div class="song-actions">
            <button class="song-action-btn" data-action="play" data-index="${index}">▶ play</button>
            <button class="song-action-btn download" data-action="dl" data-file="${escHtml(song.file)}">⬇ dl</button>
        </div>
    `;
    return item;
}

function setupPlayerControls() {
    const playBtn  = document.getElementById('btn-play');
    const pauseBtn = document.getElementById('btn-pause');
    const stopBtn  = document.getElementById('btn-stop');
    const prevBtn  = document.getElementById('btn-prev');
    const nextBtn  = document.getElementById('btn-next');
    const songsList = document.getElementById('songs-list');
    if (!playBtn) return;

    // Event delegation — niente onclick inline
    if (songsList && !songsList.dataset.delegated) {
        songsList.dataset.delegated = 'true';
        songsList.addEventListener('click', e => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            if (btn.dataset.action === 'play') playSong(Number(btn.dataset.index));
            if (btn.dataset.action === 'dl')   downloadSong(btn.dataset.file);
        });
    }

    playBtn.onclick  = () => { if (currentSongIndex >= 0) playSong(currentSongIndex); };
    pauseBtn.onclick = () => {
        if (!audio) return;
        audio.pause(); isPlaying = false;
        playBtn.style.display = 'inline-flex';
        pauseBtn.style.display = 'none';
    };
    stopBtn.onclick  = () => {
        if (!audio) return;
        audio.pause(); audio.currentTime = 0; isPlaying = false;
        playBtn.style.display = 'inline-flex';
        pauseBtn.style.display = 'none';
        updateProgress(0, 0);
    };
    prevBtn.onclick = () => { if (currentSongIndex > 0) playSong(currentSongIndex - 1); };
    nextBtn.onclick = () => { if (currentSongIndex < songs.length - 1) playSong(currentSongIndex + 1); };
}

window.playSong = function(index) {
    if (index < 0 || index >= songs.length) return;
    document.querySelectorAll('.song-item').forEach(el => el.classList.remove('playing'));
    const activeItem = document.getElementById(`song-item-${index}`);
    if (activeItem) activeItem.classList.add('playing');

    currentSongIndex = index;
    const song = songs[index];
    document.getElementById('now-playing-song').textContent = song.title;
    document.getElementById('player-artist').textContent   = song.artist;

    if (audio) audio.pause();
    audio = new Audio();

    isPlaying = true;
    document.getElementById('btn-play').style.display  = 'none';
    document.getElementById('btn-pause').style.display = 'inline-flex';
    simulatePlayback();
};

function simulatePlayback() {
    if (_playbackInterval) { clearInterval(_playbackInterval); _playbackInterval = null; }
    let currentTime = 0;
    const duration  = 180;
    document.getElementById('total-time').textContent = formatTime(duration);

    _playbackInterval = setInterval(() => {
        if (!isPlaying) { clearInterval(_playbackInterval); _playbackInterval = null; return; }
        currentTime += 1;
        if (currentTime >= duration) {
            isPlaying = false;
            clearInterval(_playbackInterval); _playbackInterval = null;
            currentTime = duration;
        }
        updateProgress(currentTime, duration);
    }, 1000);
}

function updateProgress(current, total) {
    const pct = total > 0 ? (current / total) * 100 : 0;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('current-time').textContent  = formatTime(current);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

window.downloadSong = function(filename) {
    alert(`Download: ${filename}\n(mock — nessun download reale)`);
};

window.initDownload = initDownload;
document.addEventListener('DOMContentLoaded', initDownload);
