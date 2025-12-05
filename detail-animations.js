// Detail Page Animations
// GSAP will be registered in DOMContentLoaded

// Preloader Logic
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-animate]');

    elements.forEach((element, index) => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });
};

// Particle animation
const animateParticles = () => {
    const particles = document.querySelectorAll('.particle');

    particles.forEach((particle, index) => {
        gsap.to(particle, {
            y: 'random(-100, 100)',
            x: 'random(-100, 100)',
            duration: 'random(3, 6)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.3
        });
    });
};

// FAQ Accordion
const initFAQ = () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');

        // Initially hide answer
        gsap.set(answer, { height: 0, opacity: 0 });

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close all other FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    gsap.to(otherItem.querySelector('.faq-answer'), {
                        height: 0,
                        opacity: 0,
                        duration: 0.3
                    });
                    gsap.to(otherItem.querySelector('.faq-icon'), {
                        rotation: 0,
                        duration: 0.3
                    });
                }
            });

            // Toggle current FAQ
            if (isOpen) {
                item.classList.remove('active');
                gsap.to(answer, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3
                });
                gsap.to(icon, {
                    rotation: 0,
                    duration: 0.3
                });
            } else {
                item.classList.add('active');
                gsap.to(answer, {
                    height: 'auto',
                    opacity: 1,
                    duration: 0.4
                });
                gsap.to(icon, {
                    rotation: 180,
                    duration: 0.3
                });
            }
        });
    });
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Detail animations disabled.');
        return;
    }

    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    } else {
        console.warn('ScrollTrigger not loaded. Some animations disabled.');
        return;
    }

    animateOnScroll();
    animateParticles();
    initFAQ();

    // Scroll reveal for service cards
    ScrollTrigger.batch('.service-card-link', {
        onEnter: (elements) => {
            gsap.from(elements, {
                opacity: 0,
                y: 60,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out'
            });
        },
        once: true
    });

    // Back button animation
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        gsap.from(backButton, {
            x: -100,
            opacity: 0,
            duration: 0.8,
            delay: 0.3
        });
    }
});
