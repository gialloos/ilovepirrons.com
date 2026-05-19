// Download page functionality
let currentSongIndex = -1;
let songs = [];
let isPlaying = false;
let audio = null;

async function initDownload() {
    const songsList = document.getElementById('songs-list');
    if (!songsList) return;

    // Prevent double init
    if (songsList.dataset.initialized) return;
    songsList.dataset.initialized = 'true';
    
    try {
        const response = await fetch('data/songs.json');
        songs = await response.json();
        
        songsList.innerHTML = '';
        songs.forEach((song, index) => {
            const songElement = createSongItem(song, index);
            songsList.appendChild(songElement);
        });
        
        setupPlayerControls();
    } catch (error) {
        console.error('Error loading songs:', error);
    }
}

function createSongItem(song, index) {
    const item = document.createElement('div');
    item.className = 'song-item';
    item.id = `song-item-${index}`;

    const duration = song.duration || '0:00';

    item.innerHTML = `
        <span class="song-track-num">${String(index + 1).padStart(2, '0')}</span>
        <div class="song-info">
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
        </div>
        <span class="song-duration">${duration}</span>
        <div class="song-actions">
            <button class="song-action-btn" onclick="playSong(${index})">▶ play</button>
            <button class="song-action-btn download" onclick="downloadSong('${song.file}')">⬇ dl</button>
        </div>
    `;

    return item;
}

function setupPlayerControls() {
    const playBtn = document.getElementById('btn-play');
    const pauseBtn = document.getElementById('btn-pause');
    const stopBtn = document.getElementById('btn-stop');
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    
    if (!playBtn) return;

    playBtn.onclick = () => {
        if (currentSongIndex >= 0) {
            playSong(currentSongIndex);
        }
    };
    
    pauseBtn.onclick = () => {
        if (audio) {
            audio.pause();
            isPlaying = false;
            playBtn.style.display = 'inline-flex';
            pauseBtn.style.display = 'none';
        }
    };
    
    stopBtn.onclick = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            isPlaying = false;
            playBtn.style.display = 'inline-flex';
            pauseBtn.style.display = 'none';
            updateProgress(0, 0);
        }
    };
    
    prevBtn.onclick = () => {
        if (currentSongIndex > 0) {
            playSong(currentSongIndex - 1);
        }
    };
    
    nextBtn.onclick = () => {
        if (currentSongIndex < songs.length - 1) {
            playSong(currentSongIndex + 1);
        }
    };
}

// Global scope functions for onclick
window.playSong = function(index) {
    if (index < 0 || index >= songs.length) return;

    // Update playing highlight
    document.querySelectorAll('.song-item').forEach(el => el.classList.remove('playing'));
    const activeItem = document.getElementById(`song-item-${index}`);
    if (activeItem) activeItem.classList.add('playing');

    currentSongIndex = index;
    const song = songs[index];

    document.getElementById('now-playing-song').textContent = song.title;
    document.getElementById('player-artist').textContent = song.artist;
    
    if (audio) {
        audio.pause();
    }
    
    audio = new Audio();
    audio.addEventListener('loadedmetadata', () => {
        document.getElementById('total-time').textContent = formatTime(audio.duration);
    });
    
    if (isPlaying) {
        simulatePlayback();
    } else {
        isPlaying = true;
        document.getElementById('btn-play').style.display = 'none';
        document.getElementById('btn-pause').style.display = 'inline-flex';
        simulatePlayback();
    }
};

function simulatePlayback() {
    let currentTime = 0;
    const duration = 180;
    
    document.getElementById('total-time').textContent = formatTime(duration);
    
    const interval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(interval);
            return;
        }
        
        currentTime += 1;
        if (currentTime >= duration) {
            currentTime = duration;
            isPlaying = false;
            clearInterval(interval);
        }
        
        updateProgress(currentTime, duration);
    }, 1000);
}

function updateProgress(current, total) {
    const percentage = (current / total) * 100;
    document.getElementById('progress-fill').style.width = percentage + '%';
    document.getElementById('current-time').textContent = formatTime(current);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

window.downloadSong = function(filename) {
    alert(`Download would start for: ${filename}\n(This is a mock - no actual download)`);
};

window.showLyrics = function(index) {
    alert(`Lyrics for: ${songs[index].title}\n\n(This would show lyrics in a popup)`);
};

window.rateSong = function(index) {
    const rating = prompt(`Rate "${songs[index].title}" (1-5 stars):`);
    if (rating) {
        alert(`Thanks for rating! You gave ${rating} stars.`);
    }
};

window.commentSong = function(index) {
    const comment = prompt(`Leave a comment for "${songs[index].title}":`);
    if (comment) {
        alert(`Comment posted: "${comment}"`);
    }
};

window.initDownload = initDownload;
document.addEventListener('DOMContentLoaded', initDownload);

