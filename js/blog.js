// Blog functionality
const Y2K_MOODS = ['creative 🎸', 'excited ✨', 'sleepy 😴', 'inspired 💫', 'chaotic 🌀', 'vibing 🎵', 'nostalgic 💾', 'caffeinated ☕'];
const Y2K_MUSIC = ['// unreleased track //', '// lo-fi beats //', '// demo session //', '// silence //', '// working on stuff //', '// old cassette //'];

async function initBlog() {
    const blogFeed = document.getElementById('blog-feed');
    if (!blogFeed) return;

    // Prevent double init
    if (blogFeed.dataset.initialized) return;
    blogFeed.dataset.initialized = 'true';

    try {
        const response = await fetch('data/blog-posts.json');
        const posts = await response.json();

        blogFeed.innerHTML = '';
        posts.forEach((post, index) => {
            const postElement = createBlogPost(post, index);
            blogFeed.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogFeed.innerHTML = '<p style="color: var(--hot-pink); padding: 20px;">// error loading entries. try refreshing. //</p>';
    }
}

function createBlogPost(post, index) {
    const postDiv = document.createElement('div');
    postDiv.className = 'blog-post';

    const mood  = post.mood  || Y2K_MOODS[index % Y2K_MOODS.length];
    const music = post.music || Y2K_MUSIC[index % Y2K_MUSIC.length];

    const imageHTML = post.image
        ? `<img src="${post.image}" alt="${post.title}" class="post-image">`
        : '';
    const tagsHTML = post.tags && post.tags.length > 0
        ? `<div class="post-tags">${post.tags.map(t => `<span class="post-tag">${t}</span>`).join('')}</div>`
        : '';

    const postCount = Math.max(1, 28 - index * 3);

    postDiv.innerHTML = `
        <div class="post-sidebar">
            <div class="post-avatar-box">🎸</div>
            <div class="post-username">pirrons</div>
            <div class="post-online-status"><span class="status-dot"></span> online</div>
            <div class="post-user-stats">posts: ${postCount}<br>☆ member ☆</div>
        </div>
        <div class="post-main">
            <div class="post-header">
                <h3 class="post-title">${post.title}</h3>
                <span class="post-date">${post.date}</span>
            </div>
            <div class="post-metadata">
                <span class="post-meta-field">mood: <em>${mood}</em></span>
                <span class="post-meta-field">♪ <em>${music}</em></span>
            </div>
            ${imageHTML}
            <div class="post-content">${post.content}</div>
            ${tagsHTML}
            <div class="post-footer-bar">
                <button class="post-btn">💬 0 comments</button>
                <button class="post-btn">♥ add to memories</button>
                <button class="post-btn">✉ email entry</button>
                <button class="post-btn">🔗 permalink</button>
            </div>
        </div>
    `;

    return postDiv;
}

window.initBlog = initBlog;
document.addEventListener('DOMContentLoaded', initBlog);
