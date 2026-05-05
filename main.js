/**
 * Galacosh Games - Main JavaScript Logic
 * This file contains all the custom Vanilla JS code required for the site's functionality.
 * Because there is no backend, all dynamic behaviors are handled here on the client-side.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Mobile Navigation Toggle
    // ==========================================
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // ==========================================
    // 2. Dynamic Blog Rendering (Devlog Page & Home Page)
    // ==========================================
    // Check if the devlog grid exists on the current page
    const devlogGrid = document.getElementById('devlog-grid');
    const recentPostsGrid = document.getElementById('recent-posts-grid');

    // Function to generate HTML for a single post card
    const createPostCard = (post) => {
        return `
            <div class="card blog-card">
                <img src="${post.image}" alt="${post.title}" class="blog-card-img">
                <div class="blog-card-content">
                    <div class="blog-meta">${post.date} | By ${post.author}</div>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <a href="post.html?id=${post.id}" class="read-more">Read More →</a>
                </div>
            </div>
        `;
    };

    // If devlogPosts exists (from blog-data.js)
    if (typeof devlogPosts !== 'undefined') {
        // Render all posts on the Devlog page
        if (devlogGrid) {
            let html = '';
            devlogPosts.forEach(post => {
                html += createPostCard(post);
            });
            devlogGrid.innerHTML = html;
        }

        // Render only the latest 3 posts on the Home page
        if (recentPostsGrid) {
            let html = '';
            // Get the first 3 elements
            const recent = devlogPosts.slice(0, 3);
            recent.forEach(post => {
                html += createPostCard(post);
            });
            recentPostsGrid.innerHTML = html;
        }
    }

    // ==========================================
    // 3. Lazy Loading Images via IntersectionObserver (Games Portfolio Page)
    // ==========================================
    // This improves performance by only loading images when they scroll into the viewport.
    const lazyImages = document.querySelectorAll('.gallery-img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Replace the placeholder src with the actual data-src
                    img.src = img.dataset.src;
                    
                    // Once loaded, add a class to trigger the CSS fade-in animation
                    img.onload = () => {
                        img.classList.add('loaded');
                    };
                    
                    // Stop observing the image once it's loaded
                    observer.unobserve(img);
                }
            });
        }, {
            // Options: start loading a bit before it enters the viewport
            rootMargin: "0px 0px 200px 0px"
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers: load everything immediately
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }

    // ==========================================
    // 4. Contact Form Validation & Simulated Submission
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Prevent the default form submission (page reload)
            e.preventDefault();
            
            // Clear previous errors
            document.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
            const feedback = document.getElementById('form-feedback');
            feedback.style.display = 'none';
            feedback.className = '';

            // Get form fields
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            let isValid = true;

            // 1. Validate Name
            if (nameInput.value.trim() === '') {
                document.getElementById('name-error').style.display = 'block';
                document.getElementById('name-error').innerText = 'Please enter your name.';
                isValid = false;
            }

            // 2. Validate Email (simple regex check)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                document.getElementById('email-error').style.display = 'block';
                document.getElementById('email-error').innerText = 'Please enter a valid email address.';
                isValid = false;
            }

            // 3. Validate Message
            if (messageInput.value.trim() === '') {
                document.getElementById('message-error').style.display = 'block';
                document.getElementById('message-error').innerText = 'Please enter a message.';
                isValid = false;
            }

            // If valid, simulate submission
            if (isValid) {
                // Show loader
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const loader = document.getElementById('form-loader');
                
                submitBtn.style.display = 'none';
                loader.style.display = 'block';

                // Real submission via Web3Forms
                const formData = new FormData(contactForm);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);

                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                })
                .then(async (response) => {
                    let resJson = await response.json();
                    if (response.status == 200) {
                        // Show success UI
                        feedback.style.display = 'block';
                        feedback.classList.add('feedback-success');
                        feedback.innerText = resJson.message || 'Message sent successfully! We will get back to you soon.';
                        
                        // Clear form
                        contactForm.reset();
                    } else {
                        // Show error UI
                        feedback.style.display = 'block';
                        feedback.classList.remove('feedback-success');
                        feedback.style.color = '#ef476f';
                        feedback.innerText = resJson.message || 'Something went wrong!';
                    }
                })
                .catch(error => {
                    // Show error UI
                    feedback.style.display = 'block';
                    feedback.classList.remove('feedback-success');
                    feedback.style.color = '#ef476f';
                    feedback.innerText = 'Something went wrong! Please try again.';
                })
                .finally(() => {
                    loader.style.display = 'none';
                    submitBtn.style.display = 'block';
                });
            }
        });
    }
});
