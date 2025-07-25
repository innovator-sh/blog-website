document.getElementById('year').textContent = new Date().getFullYear();

// for "Read more" thing
const WORD_LIMIT = 10;

const blogModal = new bootstrap.Modal(document.getElementById('blogModal'));
const blogForm = document.getElementById('blogForm');
const blogPostsContainer = document.getElementById('blogPosts');
let postCounter = 0;

// Function to truncate text for preview
function truncateText(text, wordLimit) {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
        return { preview: text, full: text, needsTruncation: false };
    }

    const previewWords = words.slice(0, wordLimit);
    return {
        preview: previewWords.join(' '),
        full: text,
        needsTruncation: true
    };
}

// Function to toggle between preview and full content
function toggleReadMore(postId) {
    const previewDiv = document.getElementById(`preview-${postId}`);
    const fullDiv = document.getElementById(`full-${postId}`);
    const button = document.getElementById(`btn-${postId}`);

    if (fullDiv.style.display === 'none' || !fullDiv.style.display) {
        // Show full content
        previewDiv.style.display = 'none';
        fullDiv.style.display = 'block';
        button.innerHTML = '<i class="bi bi-chevron-up me-1"></i>Read Less';
    } else {
        // Show preview content
        previewDiv.style.display = 'block';
        fullDiv.style.display = 'none';
        button.innerHTML = '<i class="bi bi-chevron-down me-1"></i>Read More';
    }
}

// Function to edit an existing post
function editPost(postId) {
    console.log('Edit button clicked for:', postId);
    
    const post = document.getElementById(postId);
    if (!post) {
        console.error('Post not found:', postId);
        return;
    }
    
    const titleElement = post.querySelector('.card-title');
    if (!titleElement) {
        console.error('Title element not found');
        return;
    }
    
    // Get current title
    const currentTitle = titleElement.textContent.replace(/[📄📝🗞️]/g, '').trim();
    
    // Get current content 
    let currentContent = '';
    const postNumber = postId.split('-')[1];
    
    // Check if full content exists
    let fullContentDiv = document.getElementById(`full-${postNumber}`);
    
    if (fullContentDiv) {
        // If full content exists, use it
        currentContent = fullContentDiv.innerHTML
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    } else {
        // Fallback to regular content
        const contentDiv = post.querySelector('.blog-content');
        if (contentDiv) {
            currentContent = contentDiv.innerHTML
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/&nbsp;/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        }
    }
    
    // Clean up content
    currentContent = currentContent.replace(/\n\s*\n/g, '\n').trim();
    
    // Populate modal
    document.getElementById('postTitle').value = currentTitle;
    document.getElementById('postContent').value = currentContent;
    
    // Store editing state
    blogForm.setAttribute('data-editing-post', postId);
    
    // Update modal UI
    document.getElementById('blogModalLabel').innerHTML = '<i class="bi bi-pencil-square me-2"></i>Edit Blog Post';
    
    // Find the submit button more reliably
    const submitButton = document.querySelector('#blogModal .modal-footer button[type="submit"]');
    if (submitButton) {
        submitButton.innerHTML = '<i class="bi bi-check-circle me-1"></i>Update Post';
    }
    
    // Show the modal
    blogModal.show();
}

// Function to update an existing post
function updatePost(postId, newTitle, newContent) {
    const post = document.getElementById(postId);
    const titleElement = post.querySelector('.card-title');
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Update the title
    titleElement.innerHTML = `<i class="bi bi-file-text me-2"></i>${newTitle}`;

    // Truncate content if necessary
    const { preview, full, needsTruncation } = truncateText(newContent, WORD_LIMIT);
    const cardBody = post.querySelector('.card-body');

    let contentHTML = '';
    const postNumber = postId.split('-')[1];

    if (needsTruncation) {
        contentHTML = `
            <div id="preview-${postNumber}" class="blog-content-preview">
                ${preview.replace(/\n/g, '<br>')}...
                <div class="fade-effect"></div>
            </div>
            <div id="full-${postNumber}" class="blog-content-full">
                ${full.replace(/\n/g, '<br>')}
            </div>
            <button class="read-more-btn mt-2" id="btn-${postNumber}" 
                    onclick="toggleReadMore(${postNumber})">
                <i class="bi bi-chevron-down me-1"></i>Read More
            </button>
        `;
    } else {
        contentHTML = `
            <div class="blog-content">
                ${full.replace(/\n/g, '<br>')}
            </div>
        `;
    }

    // Update content
    cardBody.innerHTML = `
        <p class="blog-meta small">
            <i class="bi bi-calendar3 me-1"></i>Updated on ${currentDate}
        </p>
        ${contentHTML}
    `;

    // Update word count
    const wordCountElement = post.querySelector('.card-footer small');
    wordCountElement.innerHTML = `<i class="bi bi-chat-text me-1"></i>${newContent.split(' ').length} words`;
}

// Function to create a new blog post
function createBlogPost(title, content) {
    postCounter++;
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const { preview, full, needsTruncation } = truncateText(content, WORD_LIMIT);

    const blogPost = document.createElement('div');
    blogPost.className = 'col-12 mb-4';
    blogPost.id = `post-${postCounter}`;

    let contentHTML = '';

    if (needsTruncation) {
        contentHTML = `
            <div id="preview-${postCounter}" class="blog-content-preview">
                ${preview.replace(/\n/g, '<br>')}...
                <div class="fade-effect"></div>
            </div>
            <div id="full-${postCounter}" class="blog-content-full">
                ${full.replace(/\n/g, '<br>')}
            </div>
            <button class="read-more-btn mt-2" id="btn-${postCounter}" 
                    onclick="toggleReadMore(${postCounter})">
                <i class="bi bi-chevron-down me-1"></i>Read More
            </button>
        `;
    } else {
        contentHTML = `
            <div class="blog-content">
                ${full.replace(/\n/g, '<br>')}
            </div>
        `;
    }

    blogPost.innerHTML = `
        <div class="card blog-card h-100"> 
            <div class="card-header bg-primary text-white" style="background: linear-gradient(135deg, #8B1538, #A1445B) !important;">
                <h5 class="card-title mb-0">
                    <i class="bi bi-file-text me-2"></i>${title}
                </h5>
            </div>
            <div class="card-body">
                <p class="blog-meta small">
                    <i class="bi bi-calendar3 me-1"></i>Posted on ${currentDate}
                </p>
                ${contentHTML}
            </div>
            <div class="card-footer bg-transparent d-flex justify-content-between align-items-center">
                <small class="text-muted">
                    <i class="bi bi-chat-text me-1"></i>${content.split(' ').length} words
                </small>
                <div>
                    <button class="btn btn-outline-primary btn-sm edit-btn-custom me-2" 
                            onclick="editPost('post-${postCounter}')">
                        <i class="bi bi-pencil me-1"></i>Edit
                    </button>
                    <button class="btn btn-outline-danger btn-sm delete-btn-custom" 
                            onclick="deletePost('post-${postCounter}')">
                        <i class="bi bi-trash me-1"></i>Delete
                    </button>
                </div>
            </div>
        </div>
    `;

    return blogPost;
}

// Function to delete a blog post
function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        const post = document.getElementById(postId);
        if (post) {
            post.style.transition = 'opacity 0.3s ease';
            post.style.opacity = '0';

            setTimeout(() => {
                post.remove();
                checkIfNoPosts();
            }, 300);
        }
    }
}

// Function to check if there are no posts and display a message
function checkIfNoPosts() {
    const posts = blogPostsContainer.querySelectorAll('.col-12');
    if (posts.length === 0) {
        blogPostsContainer.innerHTML = `
            <div class="card no-posts-card text-center py-5">
                <div class="card-body">
                    <i class="bi bi-chat-quote display-1 text-muted mb-3"></i>
                    <h3 class="card-title">Welcome to Your Blog!</h3>
                    <p class="card-text text-muted">No blog posts yet. Click the "Create Blog" button to get started!</p>
                </div>
            </div>
        `;
    }
}

// Event listener for the "Create Blog" button
blogForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const editingPostId = blogForm.getAttribute('data-editing-post');

    if (title && content) {
        if (editingPostId) {
            // Update existing post
            updatePost(editingPostId, title, content);

            // Reset form and state
            blogForm.removeAttribute('data-editing-post');
            document.getElementById('blogModalLabel').innerHTML = '<i class="bi bi-pencil-square me-2"></i>Create New Blog Post';
            
            const submitButton = document.querySelector('#blogModal .modal-footer button[type="submit"]');
            if (submitButton) {
                submitButton.innerHTML = '<i class="bi bi-check-circle me-1"></i>Publish Post';
            }

            showSuccessToast('Blog post updated successfully!');
        } else {
            // Create new post
            const noPostsMsg = blogPostsContainer.querySelector('.card.no-posts-card');
            if (noPostsMsg) {
                noPostsMsg.remove();
                blogPostsContainer.innerHTML = '<div class="row" id="postsRow"></div>';
            }

            const newPost = createBlogPost(title, content);
            const postsRow = document.getElementById('postsRow') || (() => {
                const row = document.createElement('div');
                row.className = 'row';
                row.id = 'postsRow';
                blogPostsContainer.appendChild(row);
                return row;
            })();

            postsRow.insertBefore(newPost, postsRow.firstChild);
            showSuccessToast('Blog post published successfully!');
        }

        blogModal.hide();
        blogForm.reset();
    }
});

// Function to show a success toast notification
function showSuccessToast(message) {
    const toastHTML = `
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-white">
                    <i class="bi bi-check-circle-fill me-2"></i>
                    <strong class="me-auto">Success</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.querySelector('.toast:last-child');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.parentElement.remove();
    });
}

// Make functions globally accessible
window.deletePost = deletePost;
window.toggleReadMore = toggleReadMore;
window.editPost = editPost;
