/**
 * ==========================================
 * IATP - Main JavaScript Module
 * ==========================================
 * Modular, scalable JavaScript for IATP website
 */

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
const Utils = {
    /**
     * Debounce function to limit rate of function execution
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Smooth scroll to element
     */
    smoothScrollTo(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

// ==========================================
// COUNTER ANIMATION MODULE
// ==========================================
const CounterAnimation = {
    init() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.classList.contains('counter')) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.counter').forEach(counter => {
            counterObserver.observe(counter);
        });
    },

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target + (target >= 100 ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
};

// ==========================================
// COUNTDOWN TIMER MODULE
// ==========================================
const CountdownTimer = {
    init() {
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);
    },

    updateCountdown() {
        const conferenceDate = new Date('March 7, 2026 00:00:00').getTime();
        const now = new Date().getTime();
        const distance = conferenceDate - now;

        if (distance < 0) return;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = hours;
        if (minutesEl) minutesEl.textContent = minutes;
        if (secondsEl) secondsEl.textContent = seconds;
    }
};

// ==========================================
// SCROLL REVEAL MODULE
// ==========================================
const ScrollReveal = {
    init() {
        this.revealOnScroll();
        window.addEventListener('scroll', Utils.debounce(() => this.revealOnScroll(), 100));
    },

    revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal-up, .stagger-item');

        reveals.forEach((element, index) => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 15; // Increased from 150 to trigger earlier

            if (elementTop < windowHeight - elementVisible) {
                setTimeout(() => {
                    element.classList.add('active');
                }, index * 1);
            }
        });
    }
};

// ==========================================
// MOBILE MENU MODULE
// ==========================================
const MobileMenu = {
    init() {
        this.menuBtn = document.getElementById('mobile-menu-btn');
        this.menu = document.getElementById('mobile-menu');
        this.closeBtn = document.getElementById('mobile-menu-close');
        this.menuLinks = document.querySelectorAll('.mobile-menu-link');

        if (!this.menuBtn || !this.menu) return;

        this.menuBtn.addEventListener('click', () => this.open());
        this.closeBtn?.addEventListener('click', () => this.close());

        this.menuLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.menu.classList.contains('translate-x-full')) {
                this.close();
            }
        });
    },

    open() {
        this.menu.classList.remove('translate-x-full');
        this.menu.classList.add('animate-slide-in-right');
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.menu.classList.add('translate-x-full');
        this.menu.classList.remove('animate-slide-in-right');
        document.body.style.overflow = '';
    }
};

// ==========================================
// MOBILE DROPDOWN MODULE
// ==========================================
const MobileDropdown = {
    init() {
        const dropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');

        dropdownBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle(btn);
            });
        });
    },

    toggle(btn) {
        const dropdown = btn.parentElement;
        const content = dropdown.querySelector('.mobile-dropdown-content');
        const icon = btn.querySelector('.fa-chevron-down');

        if (!content || !icon) return;

        const isOpen = !content.classList.contains('hidden');

        if (isOpen) {
            content.classList.add('hidden');
            icon.classList.remove('rotate-180');
        } else {
            content.classList.remove('hidden');
            icon.classList.add('rotate-180');
        }
    }
};

// ==========================================
// TAB FUNCTIONALITY MODULE
// ==========================================
const TabSystem = {
    init() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');

                // Remove active class from all buttons
                tabButtons.forEach(btn => {
                    btn.classList.remove('active', 'text-white', 'bg-gradient-to-r', 'from-iatp-primary', 'to-iatp-secondary', 'shadow-lg');
                    btn.classList.add('text-gray-700', 'bg-white', 'border-2', 'border-gray-200');
                });

                // Hide all tab contents
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });

                // Activate clicked button
                button.classList.add('active', 'text-white', 'bg-gradient-to-r', 'from-iatp-primary', 'to-iatp-secondary', 'shadow-lg');
                button.classList.remove('text-gray-700', 'bg-white', 'border-2', 'border-gray-200');

                // Show corresponding content
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
};

// ==========================================
// FAQ ACCORDION MODULE
// ==========================================
const FaqAccordion = {
    init() {
        const faqQuestions = document.querySelectorAll('.faq-question');

        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                this.toggle(question);
            });
        });
    },

    toggle(question) {
        const faqItem = question.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        const icon = question.querySelector('.faq-icon');

        if (!answer || !icon) return;

        const isOpen = !answer.classList.contains('hidden');

        if (isOpen) {
            answer.classList.add('hidden');
            icon.classList.remove('rotate-180');
        } else {
            answer.classList.remove('hidden');
            icon.classList.add('rotate-180');
        }
    }
};

// ==========================================
// ACCORDION MODULE (for Terms of Reference)
// ==========================================
const Accordion = {
    init() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');

        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                this.toggle(header);
            });
        });
    },

    toggle(header) {
        const content = header.nextElementSibling;
        const icon = header.querySelector('.accordion-icon');

        if (!content || !icon) return;

        const isOpen = !content.classList.contains('hidden');

        if (isOpen) {
            content.classList.add('hidden');
            icon.classList.remove('rotate-180');
        } else {
            content.classList.remove('hidden');
            icon.classList.add('rotate-180');
        }
    }
};

// ==========================================
// SMOOTH SCROLL MODULE
// ==========================================
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    Utils.smoothScrollTo(target);
                }
            });
        });
    }
};

// ==========================================
// NAVBAR SCROLL EFFECT MODULE
// ==========================================
const NavbarScroll = {
    init() {
        window.addEventListener('scroll', Utils.debounce(() => this.handleScroll(), 10));
    },

    handleScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        if (window.scrollY > 100) {
            navbar.classList.add('shadow-xl');
        } else {
            navbar.classList.remove('shadow-xl');
        }
    }
};

// ==========================================
// IMAGE LAZY LOADING MODULE
// ==========================================
const LazyLoad = {
    init() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('animate-fade-in');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
};

// ==========================================
// INITIALIZATION
// ==========================================
class IatpApp {
    constructor() {
        this.modules = [
            CounterAnimation,
            CountdownTimer,
            ScrollReveal,
            MobileMenu,
            MobileDropdown,
            TabSystem,
            FaqAccordion,
            Accordion,
            SmoothScroll,
            NavbarScroll,
            LazyLoad
        ];
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initModules());
        } else {
            this.initModules();
        }
    }

    initModules() {
        this.modules.forEach(module => {
            try {
                module.init();
            } catch (error) {
                console.warn(`Failed to initialize module:`, error);
            }
        });

        // Initial scroll reveal
        ScrollReveal.revealOnScroll();

        console.log('IATP Website initialized successfully');
    }
}

// ==========================================
// START APPLICATION
// ==========================================
const app = new IatpApp();
app.init();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IatpApp, Utils };
}
