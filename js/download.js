// Download page functionality
let currentSongIndex = -1;
let songs = [];
let isPlaying = false;
let audio = null;

async function initDownload() {
    const songsList = document.getElementById('songs-list');
    if (!songsList) return;
    if (songsList.dataset.initialized) return;
    songsList.dataset.initialized = 'true';

    try {
        const response = await fetch('data/songs.json?v=' + Date.now());
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
            <button class="song-action-btn download" data-action="dl" data-index="${index}">⬇ dl</button>
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
    const progressBar = document.querySelector('.progress-bar');
    if (!playBtn) return;

    // Event delegation — niente onclick inline
    if (songsList && !songsList.dataset.delegated) {
        songsList.dataset.delegated = 'true';
        songsList.addEventListener('click', e => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const index = Number(btn.dataset.index);
            if (btn.dataset.action === 'play') playSong(index);
            if (btn.dataset.action === 'dl')   downloadSong(index);
        });
    }

    playBtn.onclick  = () => {
        if (audio && audio.src) { audio.play(); return; }   // resume se già caricata
        if (currentSongIndex >= 0) playSong(currentSongIndex);
        else if (songs.length) playSong(0);
    };
    pauseBtn.onclick = () => { if (audio) audio.pause(); };
    stopBtn.onclick  = () => {
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
        updateProgress(0, audio.duration || 0);
    };
    prevBtn.onclick = () => { if (currentSongIndex > 0) playSong(currentSongIndex - 1); };
    nextBtn.onclick = () => { if (currentSongIndex < songs.length - 1) playSong(currentSongIndex + 1); };

    // Seek cliccando sulla barra di avanzamento
    if (progressBar && !progressBar.dataset.seekable) {
        progressBar.dataset.seekable = 'true';
        progressBar.style.cursor = 'pointer';
        progressBar.addEventListener('click', e => {
            if (!audio || !audio.duration) return;
            const rect = progressBar.getBoundingClientRect();
            const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
            audio.currentTime = ratio * audio.duration;
        });
    }
}

function setPlayingUI(playing) {
    isPlaying = playing;
    const playBtn  = document.getElementById('btn-play');
    const pauseBtn = document.getElementById('btn-pause');
    if (playBtn)  playBtn.style.display  = playing ? 'none' : 'inline-flex';
    if (pauseBtn) pauseBtn.style.display = playing ? 'inline-flex' : 'none';
    document.querySelectorAll('.song-item.playing .song-action-btn[data-action="play"]')
        .forEach(b => b.textContent = playing ? '❚❚ pause' : '▶ play');
}

window.playSong = function(index) {
    if (index < 0 || index >= songs.length) return;
    const song = songs[index];

    // Se ri-clicco la canzone in riproduzione, faccio pause/resume
    if (index === currentSongIndex && audio && audio.src) {
        if (audio.paused) audio.play(); else audio.pause();
        return;
    }

    document.querySelectorAll('.song-item').forEach(el => el.classList.remove('playing'));
    const activeItem = document.getElementById(`song-item-${index}`);
    if (activeItem) activeItem.classList.add('playing');

    currentSongIndex = index;
    document.getElementById('now-playing-song').textContent = song.title;
    document.getElementById('player-artist').textContent   = song.artist;

    if (audio) { audio.pause(); audio.src = ''; }
    audio = new Audio(song.file);
    audio.preload = 'metadata';

    audio.addEventListener('loadedmetadata', () => {
        document.getElementById('total-time').textContent = formatTime(audio.duration);
        updateProgress(0, audio.duration);
    });
    audio.addEventListener('timeupdate', () => updateProgress(audio.currentTime, audio.duration));
    audio.addEventListener('play',  () => setPlayingUI(true));
    audio.addEventListener('pause', () => setPlayingUI(false));
    audio.addEventListener('ended', () => {
        setPlayingUI(false);
        updateProgress(0, audio.duration);
        if (currentSongIndex < songs.length - 1) playSong(currentSongIndex + 1);
    });
    audio.addEventListener('error', () => {
        console.error('Errore caricamento audio:', song.file);
        document.getElementById('now-playing-song').textContent = 'Errore: file non trovato';
        setPlayingUI(false);
    });

    audio.play().catch(err => console.error('Playback bloccato:', err));
};

function updateProgress(current, total) {
    const pct = total > 0 ? (current / total) * 100 : 0;
    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = pct + '%';
    const cur = document.getElementById('current-time');
    if (cur) cur.textContent = formatTime(current);
}

function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

window.downloadSong = async function(index) {
    const song = songs[index];
    if (!song || !song.file) return;
    const filename = `${song.artist} - ${song.title}.mp3`;
    try {
        // Scarica come blob: l'URL blob: non è same-origin per il router SPA,
        // così il click sull'anchor non viene intercettato e parte il download reale.
        const resp = await fetch(song.file);
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const blob = await resp.blob();
        const url  = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.setAttribute('data-no-router', '');   // doppia sicurezza: il router SPA ignora questo link
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 1000);
    } catch (err) {
        console.error('Download fallito:', err, song.file);
    }
};

// Ferma e rilascia l'audio quando si lascia la pagina via router SPA.
// Su mobile lo stream teneva occupata la connessione e il suono continuava
// dopo aver cambiato pagina; questo libera tutto prima della navigazione.
function stopAudioForNavigation() {
    if (audio) {
        try { audio.pause(); audio.removeAttribute('src'); audio.load(); } catch (e) {}
        audio = null;
    }
    isPlaying = false;
    currentSongIndex = -1;
}
window.addEventListener('spa-navigate', stopAudioForNavigation);

window.initDownload = initDownload;
document.addEventListener('DOMContentLoaded', initDownload);
