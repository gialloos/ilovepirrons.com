// Blog functionality
async function initBlog() {
    const blogFeed = document.getElementById('blog-feed');
    if (!blogFeed) return;
    
    // Prevent double init
    if (blogFeed.dataset.initialized) return;
    blogFeed.dataset.initialized = 'true';

    try {
        const response = await fetch('data/blog-posts.json');
        const posts = await response.json();
        
        blogFeed.innerHTML = ''; // Clear existing
        posts.forEach(post => {
            const postElement = createBlogPost(post);
            blogFeed.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogFeed.innerHTML = '<p style="color: var(--hot-pink);">Error loading blog posts. Check console for details.</p>';
    }
}

function createBlogPost(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'blog-post';
    
    const imageHTML = post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image">` : '';
    const tagsHTML = post.tags && post.tags.length > 0 ? `<div class="post-tags">${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}</div>` : '';
    
    postDiv.innerHTML = `
        <div class="post-header">
            <h3 class="post-title">${post.title}</h3>
            <span class="post-date">${post.date}</span>
        </div>
        ${imageHTML}
        <div class="post-content">${post.content}</div>
        ${tagsHTML}
    `;
    
    return postDiv;
}

window.initBlog = initBlog;
document.addEventListener('DOMContentLoaded', initBlog);
