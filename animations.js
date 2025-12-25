// ============================================
// MAIN ANIMATION ORCHESTRATOR
// Coordinates all robot animations
// ============================================

// Wait for full window load to ensure images and layout are ready
window.addEventListener('load', () => {
    // Small delay to ensure layout stability
    setTimeout(initializeAnimations, 100);
});

function initializeAnimations() {
    console.log('🎬 Initializing Advanced Robot Animations...');

    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP not loaded! Make sure CDN is included.');
        return;
    }

    // Get robot elements
    const robotImage = document.getElementById('robotImage');
    const robotContainer = document.getElementById('robotContainer');

    // SAFETY CHECK: Only run robot animations on pages that have robot elements
    if (!robotImage || !robotContainer) {
        console.log('ℹ️ Robot elements not found - skipping robot animations (this is normal for detail pages)');

        // Still setup basic enhancements that work on all pages
        setupServiceCardAnimations();
        setupButtonEnhancements();
        setupPerformanceOptimizations();

        console.log('✅ Basic animations initialized for detail page');
        return;
    }

    // Initialize robot animation systems (only runs on main page)
    try {
        // Create robot controller
        const robotController = new RobotController(robotImage, robotContainer);

        // Create scroll effects
        const scrollEffects = new ScrollEffects(robotController);

        // Setup additional enhancements
        setupServiceCardAnimations();
        setupButtonEnhancements();
        setupBackgroundParticles(); // Only creates particles on main page
        setupPerformanceOptimizations();

        // Make controllers globally accessible
        window.robotController = robotController;
        window.scrollEffects = scrollEffects;

        console.log('✅ All animations initialized successfully!');
        console.log('🤖 Robot Controller ready');
        console.log('📜 Scroll Effects active');

        // Welcome animation sequence
        playWelcomeSequence(robotController);

    } catch (error) {
        console.error('❌ Animation initialization failed:', error);
    }
}

// ==========================================
// WELCOME SEQUENCE
// ==========================================

function playWelcomeSequence(robotController) {
    const timeline = gsap.timeline({
        delay: 2.5, // After entry animation
        onComplete: () => {
            console.log('👋 Welcome sequence complete!');
        }
    });

    // Spin + glow pulse
    timeline.add(robotController.spin360());
    timeline.add(robotController.pulseGlow(), '-=1');

    // Small bounce
    timeline.add(robotController.bounce(), '-=0.5');
}

// ==========================================
// SERVICE CARD ANIMATIONS
// ==========================================

function setupServiceCardAnimations() {
    // Target both main service cards and detail page premium cards
    const serviceCards = gsap.utils.toArray('.service-card, .premium-card');

    serviceCards.forEach((card, index) => {
        // Staggered entrance
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            y: 100,
            rotateX: -15,
            opacity: 0,
            scale: 0.9,
            duration: 1,
            delay: index * 0.2,
            ease: 'power3.out'
        });

        // Enhanced hover with 3D tilt
        card.addEventListener('mouseenter', function (e) {
            gsap.to(card, {
                y: -30,
                rotateX: 5,
                rotateY: 3,
                scale: 1.05,
                duration: 0.6,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', function () {
            gsap.to(card, {
                y: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    });
}

// ==========================================
// BUTTON ENHANCEMENTS
// ==========================================

function setupButtonEnhancements() {
    const buttons = gsap.utils.toArray('.btn');

    buttons.forEach(button => {
        // Magnetic effect
        button.addEventListener('mouseenter', function () {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: 'back.out(2)'
            });
        });

        button.addEventListener('mousemove', function (e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(button, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        button.addEventListener('mouseleave', function () {
            gsap.to(button, {
                scale: 1,
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });

        // Click animation
        button.addEventListener('click', function () {
            gsap.timeline()
                .to(button, {
                    scale: 0.95,
                    duration: 0.1
                })
                .to(button, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: 'back.out(3)'
                })
                .to(button, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
        });
    });
}

// ==========================================
// BACKGROUND PARTICLES (Optional Enhancement)
// ==========================================

function setupBackgroundParticles() {
    // Create subtle floating particles in hero section
    const hero = document.querySelector('.hero');

    // SAFETY CHECK: Only create particles if hero section exists (main page only)
    if (!hero) {
        console.log('ℹ️ Hero section not found - skipping particle effects');
        return;
    }

    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.6), rgba(34, 211, 238, 0.4));
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            filter: blur(1px);
            opacity: 0;
        `;

        hero.appendChild(particle);

        // Animate particle
        gsap.to(particle, {
            y: `-=${Math.random() * 500 + 200}`,
            x: `+=${Math.random() * 200 - 100}`,
            opacity: Math.random() * 0.5 + 0.3,
            duration: Math.random() * 10 + 10,
            repeat: -1,
            delay: Math.random() * 5,
            ease: 'none'
        });
    }
}

// ==========================================
// PERFORMANCE OPTIMIZATIONS
// ==========================================

function setupPerformanceOptimizations() {
    // Disable animations on low-performance devices
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        console.log('⚠️ Reduced motion preferred - simplifying animations');
        gsap.globalTimeline.timeScale(0.5);
    }

    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            gsap.globalTimeline.pause();
            console.log('⏸️ Animations paused (tab hidden)');
        } else {
            gsap.globalTimeline.resume();
            console.log('▶️ Animations resumed');
        }
    });

    // Optimize for mobile
    if (window.innerWidth < 768) {
        console.log('📱 Mobile detected - optimizing animations for performance');

        // Reduce particle count significantly
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            if (index > 6) particle.remove();
        });

        // Simplify scroll effects for smoother performance
        ScrollTrigger.config({
            limitCallbacks: true,
            syncInterval: 150 // Reduce callback frequency
        });

        // Reduce GSAP animations for battery life
        gsap.globalTimeline.timeScale(0.9);

        // Disable complex hover effects - rely on CSS :active instead
        document.querySelectorAll('.service-card, .premium-card').forEach(card => {
            card.style.transition = 'transform 0.2s ease, border-color 0.2s ease';
        });
    }
}

// ==========================================
// DEBUG HELPERS
// ==========================================

// Add keyboard shortcuts for testing
document.addEventListener('keydown', (e) => {
    if (!window.robotController) return;

    switch (e.key.toLowerCase()) {
        case 's':
            window.robotController.spin360();
            break;
        case 'b':
            window.robotController.bounce();
            break;
        case 'w':
            window.robotController.wave();
            break;
        case 'g':
            window.robotController.pulseGlow();
            break;
        case 'r':
            window.scrollEffects.refresh();
            console.log('🔄 ScrollTrigger refreshed');
            break;
    }
});

console.log('💡 Debug keys: S=Spin, B=Bounce, W=Wave, G=Glow, R=Refresh');

// ==========================================
// EXPORT FOR DEBUGGING
// ==========================================

window.debugAnimations = {
    spin: () => window.robotController?.spin360(),
    bounce: () => window.robotController?.bounce(),
    wave: () => window.robotController?.wave(),
    glow: () => window.robotController?.pulseGlow(),
    refresh: () => window.scrollEffects?.refresh(),
    killAll: () => window.scrollEffects?.kill()
};
