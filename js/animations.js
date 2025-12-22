/**
 * IATP Revolutionary Animation System
 * Handles scroll reveals, magnetic buttons, cursor effects, and kinetic interactions
 */

class IATPAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAll());
        } else {
            this.setupAll();
        }
    }

    setupAll() {
        this.setupScrollReveal();
        this.setupMagneticButtons();
        this.setupCursorGlow();
        this.setupCounterAnimations();
        this.setupParallax();
        this.setupNavigation();
        this.setupSmoothScroll();
    }

    /**
     * SCROLL REVEAL ANIMATIONS
     * Elements fade and slide in when scrolled into view
     */
    setupScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal, .stagger-item');

        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Stagger delay for sequential items
                        setTimeout(() => {
                            entry.target.classList.add('active');
                        }, index * 100);

                        // Unobserve after animation to improve performance
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        revealElements.forEach((el) => observer.observe(el));
    }

    /**
     * MAGNETIC BUTTON EFFECT
     * Buttons pull toward cursor when nearby
     */
    setupMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.magnetic, .btn-primary, .magnetic-btn');

        magneticButtons.forEach((button) => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Calculate distance from center
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = 100; // pixels

                if (distance < maxDistance) {
                    const strength = (maxDistance - distance) / maxDistance;
                    const moveX = x * strength * 0.3;
                    const moveY = y * strength * 0.3;

                    button.style.transform = `translate(${moveX}px, ${moveY}px)`;
                }
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    /**
     * CURSOR GLOW EFFECT
     * Glowing effect follows cursor on interactive elements
     */
    setupCursorGlow() {
        const glowElements = document.querySelectorAll('.cursor-glow, .card-glass, .card-elevated');

        glowElements.forEach((element) => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                element.style.setProperty('--mouse-x', `${x}px`);
                element.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    /**
     * ANIMATED COUNTERS
     * Numbers count up when scrolled into view
     */
    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach((counter) => counterObserver.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000; // 2 seconds
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        const increment = target / totalFrames;

        let currentValue = 0;
        let frame = 0;

        const counter = setInterval(() => {
            frame++;
            currentValue += increment;

            if (frame >= totalFrames) {
                currentValue = target;
                clearInterval(counter);
            }

            // Format number with commas
            const displayValue = Math.floor(currentValue).toLocaleString();
            element.textContent = displayValue;

            // Add suffix if exists
            const suffix = element.getAttribute('data-suffix');
            if (suffix && frame >= totalFrames) {
                element.textContent += suffix;
            }
        }, frameDuration);
    }

    /**
     * PARALLAX SCROLL EFFECT
     * Elements move at different speeds for depth
     */
    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        if (parallaxElements.length === 0) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateParallax(parallaxElements);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateParallax(elements) {
        const scrollY = window.pageYOffset;

        elements.forEach((element) => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    /**
     * NAVIGATION SCROLL BEHAVIOR
     * Hide/show nav on scroll, add shadow when scrolled
     */
    setupNavigation() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        let lastScrollY = window.pageYOffset;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.pageYOffset;

                    // Add scrolled class for styling
                    if (currentScrollY > 100) {
                        nav.classList.add('scrolled');
                    } else {
                        nav.classList.remove('scrolled');
                    }

                    // Hide/show on scroll direction
                    if (currentScrollY > lastScrollY && currentScrollY > 200) {
                        nav.style.transform = 'translateY(-100%)';
                    } else {
                        nav.style.transform = 'translateY(0)';
                    }

                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /**
     * SMOOTH SCROLL FOR ANCHOR LINKS
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // Ignore empty hash or just #
                if (!href || href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

/**
 * UTILITY FUNCTIONS
 */

// Throttle function for performance
function throttle(func, wait) {
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

// Debounce function for performance
function debounce(func, wait) {
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

/**
 * WEIGHT MORPHING TYPOGRAPHY
 * Animates font weight from light to black
 */
class WeightMorph {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.setup();
    }

    setup() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.morphWeight(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        this.elements.forEach((el) => observer.observe(el));
    }

    morphWeight(element) {
        let weight = 300;
        const targetWeight = 900;
        const duration = 1200;
        const increment = (targetWeight - weight) / (duration / 16);

        const animate = () => {
            weight += increment;
            if (weight >= targetWeight) {
                weight = targetWeight;
                element.style.fontVariationSettings = `'wght' ${weight}`;
                return;
            }
            element.style.fontVariationSettings = `'wght' ${weight}`;
            requestAnimationFrame(animate);
        };

        animate();
    }
}

/**
 * 3D CARD TILT EFFECT
 * Cards tilt toward cursor position
 */
class CardTilt {
    constructor(selector, maxTilt = 10) {
        this.cards = document.querySelectorAll(selector);
        this.maxTilt = maxTilt;
        this.setup();
    }

    setup() {
        this.cards.forEach((card) => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
        });
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * this.maxTilt;
        const rotateY = ((centerX - x) / centerX) * this.maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    handleMouseLeave(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
}

/**
 * GRADIENT ANIMATION
 * Animates background gradients
 */
function animateGradient(selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
        el.style.backgroundSize = '200% 200%';
        el.style.animation = 'gradientShift 10s ease infinite';
    });
}

/**
 * INITIALIZE ALL ANIMATIONS
 */
document.addEventListener('DOMContentLoaded', () => {
    // Core animation system
    new IATPAnimations();

    // Weight morphing for hero text
    new WeightMorph('.weight-morph, .hero-title');

    // 3D card tilt effect
    new CardTilt('.card-tilt, .service-card, .bento-card');

    // Animated gradients
    animateGradient('.gradient-animated');

    console.log('🚀 IATP Animation System Loaded');
});

/**
 * EXPORT FOR MODULE USE
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        IATPAnimations,
        WeightMorph,
        CardTilt,
        animateGradient,
        throttle,
        debounce
    };
}
