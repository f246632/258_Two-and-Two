/**
 * Two and Two - Main JavaScript
 * Handles all interactive features and animations
 */

// ===================================
// Utility Functions
// ===================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce function for performance
function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// Navigation
// ===================================

class Navigation {
    constructor() {
        this.navbar = $('#navbar');
        this.navToggle = $('#navToggle');
        this.navMenu = $('#navMenu');
        this.navLinks = $$('.nav-link');

        this.init();
    }

    init() {
        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Navbar scroll effect
        window.addEventListener('scroll', debounce(() => this.handleScroll()));

        // Active link on scroll
        window.addEventListener('scroll', debounce(() => this.updateActiveLink(), 100));

        // Close mobile menu on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.navMenu.classList.remove('active');
            }
        });
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = $(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Close mobile menu after click
            this.navMenu.classList.remove('active');
        }
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');

        // Animate hamburger icon
        const spans = this.navToggle.querySelectorAll('span');
        spans[0].style.transform = this.navMenu.classList.contains('active')
            ? 'rotate(45deg) translate(7px, 7px)'
            : 'none';
        spans[1].style.opacity = this.navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = this.navMenu.classList.contains('active')
            ? 'rotate(-45deg) translate(7px, -7px)'
            : 'none';
    }

    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    updateActiveLink() {
        const sections = $$('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ===================================
// Menu Tabs
// ===================================

class MenuTabs {
    constructor() {
        this.tabs = $$('.menu-tab');
        this.categories = $$('.menu-category');

        this.init();
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });
    }

    switchTab(clickedTab) {
        const category = clickedTab.dataset.category;

        // Update tabs
        this.tabs.forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');

        // Update categories
        this.categories.forEach(cat => {
            cat.classList.remove('active');
            if (cat.dataset.category === category) {
                cat.classList.add('active');
            }
        });
    }
}

// ===================================
// Gallery & Lightbox
// ===================================

class Gallery {
    constructor() {
        this.galleryItems = $$('.gallery-item');
        this.lightbox = $('#lightbox');
        this.lightboxImg = $('#lightboxImg');
        this.lightboxClose = $('#lightboxClose');
        this.lightboxPrev = $('#lightboxPrev');
        this.lightboxNext = $('#lightboxNext');
        this.currentIndex = 0;
        this.images = [];

        this.init();
    }

    init() {
        // Collect all image sources
        this.galleryItems.forEach((item, index) => {
            this.images.push(item.dataset.src);
            item.addEventListener('click', () => this.openLightbox(index));
        });

        // Lightbox controls
        if (this.lightboxClose) {
            this.lightboxClose.addEventListener('click', () => this.closeLightbox());
        }

        if (this.lightboxPrev) {
            this.lightboxPrev.addEventListener('click', () => this.prevImage());
        }

        if (this.lightboxNext) {
            this.lightboxNext.addEventListener('click', () => this.nextImage());
        }

        // Close lightbox on background click
        this.lightbox?.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    openLightbox(index) {
        this.currentIndex = index;
        this.lightboxImg.src = this.images[index];
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.lightboxImg.src = this.images[this.currentIndex];
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.lightboxImg.src = this.images[this.currentIndex];
    }

    handleKeyboard(e) {
        if (!this.lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.prevImage();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
        }
    }
}

// ===================================
// Contact Form
// ===================================

class ContactForm {
    constructor() {
        this.form = $('#contactForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Validate
        if (!this.validateForm(data)) {
            return;
        }

        // Show success message
        this.showMessage('Thank you for your message! We will get back to you soon.', 'success');

        // Reset form
        this.form.reset();
    }

    validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.name || data.name.trim().length < 2) {
            this.showMessage('Please enter a valid name (at least 2 characters).', 'error');
            return false;
        }

        if (!emailRegex.test(data.email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return false;
        }

        if (!data.subject || data.subject.trim().length < 3) {
            this.showMessage('Please enter a subject (at least 3 characters).', 'error');
            return false;
        }

        if (!data.message || data.message.trim().length < 10) {
            this.showMessage('Please enter a message (at least 10 characters).', 'error');
            return false;
        }

        return true;
    }

    showMessage(message, type) {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 20px 30px;
            background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(messageDiv);

        // Remove after 5 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }
}

// ===================================
// Back to Top Button
// ===================================

class BackToTop {
    constructor() {
        this.button = $('#backToTop');
        this.init();
    }

    init() {
        if (this.button) {
            // Show/hide on scroll
            window.addEventListener('scroll', debounce(() => this.toggleVisibility()));

            // Click handler
            this.button.addEventListener('click', () => this.scrollToTop());
        }
    }

    toggleVisibility() {
        if (window.scrollY > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ===================================
// Scroll Animations
// ===================================

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.init();
    }

    init() {
        // Create intersection observer
        const observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            this.observerOptions
        );

        // Observe all sections
        $$('.section').forEach(section => {
            observer.observe(section);
        });

        // Observe menu items, gallery items, review cards
        $$('.menu-item, .gallery-item, .review-card, .feature-item').forEach(item => {
            observer.observe(item);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }
}

// Add initial styles for animation
document.addEventListener('DOMContentLoaded', () => {
    $$('.menu-item, .gallery-item, .review-card, .feature-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
});

// ===================================
// Lazy Loading Images
// ===================================

class LazyLoader {
    constructor() {
        this.images = $$('img[loading="lazy"]');
        this.init();
    }

    init() {
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            return;
        }

        // Fallback for browsers that don't support lazy loading
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        this.images.forEach(img => imageObserver.observe(img));
    }
}

// ===================================
// Performance Optimization
// ===================================

// Preload critical resources
function preloadResources() {
    const links = [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
    ];

    links.forEach(({ rel, href, crossorigin }) => {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (crossorigin) link.crossOrigin = '';
        document.head.appendChild(link);
    });
}

// ===================================
// Accessibility Enhancements
// ===================================

class Accessibility {
    constructor() {
        this.init();
    }

    init() {
        // Skip to main content link
        this.addSkipLink();

        // Announce dynamic content changes to screen readers
        this.setupAriaLive();

        // Ensure all interactive elements are keyboard accessible
        this.enhanceKeyboardNav();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
        `;
        skipLink.addEventListener('focus', function() {
            this.style.top = '0';
        });
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupAriaLive() {
        const ariaLive = document.createElement('div');
        ariaLive.setAttribute('role', 'status');
        ariaLive.setAttribute('aria-live', 'polite');
        ariaLive.setAttribute('aria-atomic', 'true');
        ariaLive.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(ariaLive);

        window.announceToScreenReader = (message) => {
            ariaLive.textContent = message;
            setTimeout(() => ariaLive.textContent = '', 1000);
        };
    }

    enhanceKeyboardNav() {
        // Add visual focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }
}

// ===================================
// Initialize Everything
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    new Navigation();
    new MenuTabs();
    new Gallery();
    new ContactForm();
    new BackToTop();
    new ScrollAnimations();
    new LazyLoader();
    new Accessibility();

    // Preload resources
    preloadResources();

    // Log initialization
    console.log('Two and Two website initialized successfully! ☕');
});

// ===================================
// Service Worker Registration (Optional)
// ===================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker for offline support
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

// ===================================
// Export for potential module usage
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        MenuTabs,
        Gallery,
        ContactForm,
        BackToTop,
        ScrollAnimations,
        LazyLoader,
        Accessibility
    };
}
