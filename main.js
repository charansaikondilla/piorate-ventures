// ==================================
// AI AGENCY - MAIN UTILITIES
// UI enhancements and helper functions
// Robot animations handled by animations.js
// ==================================

// Preloader Logic
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});


// ==================================
// SCROLL REVEAL FOR SERVICE CARDS
// ==================================

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 150);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach(card => {
    observer.observe(card);
});

// ==================================
// SMOOTH SCROLL FOR NAVIGATION
// ==================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==================================
// NAVBAR SCROLL EFFECT
// ==================================

const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 5, 21, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(139, 92, 246, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 5, 21, 0.85)';
            navbar.style.boxShadow = '0 4px 30px rgba(139, 92, 246, 0.1)';
        }
    });
}

// ==================================
// BUTTON RIPPLE EFFECT
// ==================================

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
        `;

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to { transform: scale(4); opacity: 0; }
    }
    .btn { position: relative; overflow: hidden; }
`;
document.head.appendChild(style);

// ==================================
//  COUNTER ANIMATION FOR STATS
// ==================================

const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = (typeof target === 'number') ? target + '+' : target;
            clearInterval(timer);
        } else {
            if (typeof target === 'number') element.textContent = Math.floor(start);
        }
    }, 16);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent.trim();
                if (text.includes('%')) {
                    animateCounter(stat, 98);
                    stat.textContent = '98%';
                } else if (text.includes('+')) {
                    const number = parseInt(text.replace(/\D/g, ''));
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ==================================
// CONSOLE EASTER EGG
// ==================================

console.log('%c🤖 AI Agency ', 'background: linear-gradient(135deg, #8b5cf6, #d946ef); color: white; font-size: 24px; padding: 15px 30px; border-radius: 10px; font-weight: bold;');
console.log('%cTransform Your Business with AI', 'color: #8b5cf6; font-size: 16px; font-weight: bold;');
console.log('%c💡 Robot Controls: S=Spin, B=Bounce, W=Wave, G=Glow', 'color: #22d3ee; font-size: 12px;');
