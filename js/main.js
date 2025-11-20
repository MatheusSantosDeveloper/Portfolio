// ===== MAIN JAVASCRIPT FILE =====

// ===== MOBILE MENU FUNCTIONALITY =====
class MobileMenu {
    constructor() {
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.nav = document.querySelector('.nav');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.body = document.body;
        
        this.init();
    }

    init() {
        if (this.toggle && this.nav) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
            
            // Close menu when clicking on nav links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.nav.contains(e.target) && !this.toggle.contains(e.target)) {
                    this.closeMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMenu();
                }
            });
        }
    }

    toggleMenu() {
        this.nav.classList.toggle('active');
        this.toggle.classList.toggle('active');
        this.body.classList.toggle('menu-open');
    }

    closeMenu() {
        this.nav.classList.remove('active');
        this.toggle.classList.remove('active');
        this.body.classList.remove('menu-open');
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const nav = document.querySelector('.nav');
                    const toggle = document.querySelector('.mobile-menu-toggle');
                    if (nav && nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        toggle.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                }
            });
        });
    }
}

// ===== HEADER SCROLL EFFECTS =====
class HeaderEffects {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }

    init() {
        if (this.header) {
            window.addEventListener('scroll', () => this.handleScroll());
        }
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            this.header.style.background = 'rgba(0, 0, 0, 0.98)';
            this.header.style.backdropFilter = 'blur(20px)';
        } else {
            this.header.style.background = 'rgba(0, 0, 0, 0.95)';
            this.header.style.backdropFilter = 'blur(10px)';
        }
    }
}

// ===== ACTIVE NAVIGATION HIGHLIGHTING =====
class ActiveNavigation {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        if (this.sections.length && this.navLinks.length) {
            window.addEventListener('scroll', () => this.updateActiveLink());
        }
    }

    updateActiveLink() {
        let currentSection = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, this.observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.skill-category, .project-card, .stat, .about-text').forEach(el => {
            el.classList.add('animate-on-scroll');
            this.observer.observe(el);
        });
    }
}

// ===== PROJECT CAROUSEL FUNCTIONALITY =====
class ProjectCarousel {
    constructor(container) {
        this.container = container;
        this.slides = container.querySelectorAll('.carousel-slide');
        this.dots = container.querySelectorAll('.dot');
        this.prevBtn = container.querySelector('.carousel-prev');
        this.nextBtn = container.querySelector('.carousel-next');
        this.currentSlide = 0;
        this.autoAdvanceInterval = null;
        
        this.init();
    }
    
    init() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Touch events for mobile
        this.setupTouchEvents();
        
        // Auto-advance slides
        this.startAutoAdvance();
        
        // Pause auto-advance on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoAdvance());
        this.container.addEventListener('mouseleave', () => this.startAutoAdvance());
    }
    
    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
        this.currentSlide = index;
    }
    
    nextSlide() {
        let nextIndex = this.currentSlide + 1;
        if (nextIndex >= this.slides.length) {
            nextIndex = 0;
        }
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        let prevIndex = this.currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = this.slides.length - 1;
        }
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        this.showSlide(index);
    }
    
    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }
    
    handleSwipe(startX, endX) {
        const diff = startX - endX;
        const swipeThreshold = 50;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide(); // Swipe left
            } else {
                this.prevSlide(); // Swipe right
            }
        }
    }
    
    startAutoAdvance() {
        this.stopAutoAdvance();
        this.autoAdvanceInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    pauseAutoAdvance() {
        this.stopAutoAdvance();
    }
    
    stopAutoAdvance() {
        if (this.autoAdvanceInterval) {
            clearInterval(this.autoAdvanceInterval);
            this.autoAdvanceInterval = null;
        }
    }
    
    destroy() {
        this.stopAutoAdvance();
        // Remove event listeners
        this.prevBtn.removeEventListener('click', () => this.prevSlide());
        this.nextBtn.removeEventListener('click', () => this.nextSlide());
    }
}

// ===== CAROUSEL MANAGER =====
class CarouselManager {
    constructor() {
        this.carousels = [];
        this.init();
    }

    init() {
        const carouselContainers = document.querySelectorAll('.carousel-container');
        carouselContainers.forEach((container, index) => {
            this.carousels.push(new ProjectCarousel(container));
        });
    }

    destroyAll() {
        this.carousels.forEach(carousel => carousel.destroy());
        this.carousels = [];
    }
}

// ===== CONTACT FORM HANDLER =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        if (!this.validateForm(formData)) {
            return;
        }
        
        this.submitForm(formData);
    }

    validateForm(data) {
        // Check if all fields are filled
        if (!data.name || !data.email || !data.subject || !data.message) {
            this.showMessage('Por favor, preencha todos os campos.', 'error');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showMessage('Por favor, insira um email válido.', 'error');
            return false;
        }
        
        return true;
    }

    async submitForm(data) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showMessage('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
            this.form.reset();
        } catch (error) {
            this.showMessage('Erro ao enviar mensagem. Tente novamente.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = this.form.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        
        // Style the message
        messageEl.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 8px;
            font-weight: 500;
            text-align: center;
            ${type === 'success' 
                ? 'background: rgba(0, 188, 212, 0.1); color: #00bcd4; border: 1px solid #00bcd4;'
                : 'background: rgba(255, 107, 107, 0.1); color: #ff6b6b; border: 1px solid #ff6b6b;'
            }
        `;
        
        // Insert message
        this.form.insertBefore(messageEl, this.form.firstChild);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 5000);
    }
}

// ===== TYPING ANIMATION =====
class TypingAnimation {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }

    start() {
        this.element.textContent = '';
        this.type();
    }

    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// ===== PARALLAX EFFECTS =====
class ParallaxEffects {
    constructor() {
        this.elements = document.querySelectorAll('.parallax-element');
        this.init();
    }

    init() {
        if (this.elements.length && window.innerWidth > 768) {
            window.addEventListener('scroll', () => this.handleScroll());
        }
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        
        this.elements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Optimize animations for mobile
        this.optimizeForMobile();
        
        // Preload critical resources
        this.preloadResources();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    optimizeForMobile() {
        if (window.innerWidth <= 768) {
            // Reduce animation complexity on mobile
            document.documentElement.style.setProperty('--animation-duration', '0.3s');
        }
    }

    preloadResources() {
        // Preload critical CSS
        const criticalCSS = [
            'styles/reset.css',
            'styles/header.css',
            'styles/main.css'
        ];

        criticalCSS.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }
}

// ===== INITIALIZE ALL COMPONENTS =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new MobileMenu();
    new SmoothScroll();
    new HeaderEffects();
    new ActiveNavigation();
    new ScrollAnimations();
    new CarouselManager();
    new ContactForm();
    new ParallaxEffects();
    new PerformanceOptimizer();

    // Initialize typing animation for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            const typing = new TypingAnimation(heroTitle, originalText, 50);
            typing.start();
        }, 1000);
    }

    // Add GPU acceleration to animated elements
    document.querySelectorAll('.project-card, .skill-category, .stat').forEach(el => {
        el.classList.add('gpu-accelerated');
    });

    // Add animation classes to hero elements
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons, .hero-image');
    heroElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        setTimeout(() => {
            el.classList.add('animated');
        }, 200 * (index + 1));
    });
});

// ===== WINDOW RESIZE HANDLER =====
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (window.innerWidth > 768) {
        nav?.classList.remove('active');
        toggle?.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// ===== PAGE VISIBILITY HANDLER =====
document.addEventListener('visibilitychange', () => {
    const carousels = document.querySelectorAll('.carousel-container');
    
    if (document.hidden) {
        // Pause carousels when page is not visible
        carousels.forEach(container => {
            const carousel = container._carouselInstance;
            if (carousel) {
                carousel.pauseAutoAdvance();
            }
        });
    } else {
        // Resume carousels when page becomes visible
        carousels.forEach(container => {
            const carousel = container._carouselInstance;
            if (carousel) {
                carousel.startAutoAdvance();
            }
        });
    }
});

// ===== KEYBOARD NAVIGATION FOR CAROUSELS =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeCarousel = document.querySelector('.carousel-container:hover');
        if (activeCarousel) {
            e.preventDefault();
            const carousel = activeCarousel._carouselInstance;
            if (carousel) {
                if (e.key === 'ArrowLeft') {
                    carousel.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    carousel.nextSlide();
                }
            }
        }
    }
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MobileMenu,
        SmoothScroll,
        HeaderEffects,
        ActiveNavigation,
        ScrollAnimations,
        CarouselManager,
        ProjectCarousel,
        ContactForm,
        TypingAnimation,
        ParallaxEffects,
        PerformanceOptimizer
    };
}