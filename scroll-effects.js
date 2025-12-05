// ============================================
// SCROLL-TRIGGERED EFFECTS
// Advanced ScrollTrigger animations for robot
// ============================================

class ScrollEffects {
    constructor(robotController) {
        this.robotController = robotController;
        this.robot = robotController.robot;
        this.container = robotController.container;

        // Animation configuration
        this.config = {
            parallaxSpeed: 0.6,
            rotationMultiplier: 360,
            scaleRange: 0.3,
        };

        this.init();
    }

    init() {
        gsap.registerPlugin(ScrollTrigger);

        // Setup all scroll-driven animations
        this.setupDramaticEntry();
        this.setupScrollRotation();
        this.setupParallaxEffect();
        this.setupMilestoneAnimations();
        this.setupFloatingIconAnimations();
        this.setupVelocityGlow();

        console.log('📜 Scroll Effects Initialized');
    }

    // ==========================================
    // DRAMATIC ENTRY ANIMATION
    // ==========================================

    setupDramaticEntry() {
        // Initial state is now handled in CSS to prevent FOUC
        // #robotImage { transform: translateY(-200vh)... }

        // Robot drops from sky with physics-based bounce
        const entryAnimation = gsap.timeline({
            onComplete: () => {
                console.log('🎬 Entry animation complete!');
                this.entryComplete = true; // Flag to enable velocity glow
            }
        });

        // Main drop animation
        entryAnimation.to(this.robot, {
            y: 0,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1,
            opacity: 1,
            duration: 2.5,
            ease: 'elastic.out(1, 0.5)',
            delay: 0.5
        });

        // NO filter animation during entry - causes disappearing bug
        // Filter is set by CSS and maintained throughout
    }

    // ==========================================
    // SCROLL-DRIVEN 3D ROTATION
    // ==========================================

    setupScrollRotation() {
        // Create a ScrollTrigger for continuous rotation
        ScrollTrigger.create({
            trigger: this.container,
            start: 'top top',
            end: 'bottom top',
            scrub: 1, // Smooth scrubbing
            onUpdate: (self) => {
                // Skip during entry to avoid conflicts
                if (!this.entryComplete) return;

                const progress = self.progress;

                // Update robot controller
                this.robotController.updateScrollProgress(progress);

                // Complex rotation based on scroll
                const rotateY = progress * this.config.rotationMultiplier;
                const rotateX = Math.sin(progress * Math.PI * 2) * 20;
                const scale = 1 + (Math.sin(progress * Math.PI * 4) * this.config.scaleRange);

                // Apply scroll-based transforms (additive to mouse tracking)
                gsap.to(this.robot, {
                    '--scroll-rotate-y': rotateY,
                    '--scroll-rotate-x': rotateX,
                    '--scroll-scale': scale,
                    duration: 0.5,
                    overwrite: false // Don't overwrite mouse tracking
                });
            }
        });
    }

    // ==========================================
    // PARALLAX DEPTH EFFECT
    // ==========================================

    setupParallaxEffect() {
        // Robot parallax
        gsap.to(this.robot, {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            y: `${this.config.parallaxSpeed * 50}%`,
            ease: 'none'
        });

        // Floating icons - faster parallax
        gsap.utils.toArray('.float-icon').forEach((icon, index) => {
            const speed = 1.2 + (index * 0.2); // Different speeds

            gsap.to(icon, {
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                y: `-${speed * 50}%`,
                rotateZ: index % 2 === 0 ? 180 : -180,
                ease: 'none'
            });
        });
    }

    // ==========================================
    // SCROLL MILESTONE ANIMATIONS
    // ==========================================

    setupMilestoneAnimations() {
        // 25% - Spin celebration
        ScrollTrigger.create({
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            onUpdate: (self) => {
                // Skip during entry
                if (!this.entryComplete) return;

                if (self.progress >= 0.25 && self.progress < 0.26) {
                    this.robotController.spin360();
                    this.robotController.pulseGlow();
                }
            }
        });

        // 50% - Bounce
        ScrollTrigger.create({
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            onUpdate: (self) => {
                if (self.progress >= 0.5 && self.progress < 0.51) {
                    this.robotController.bounce();
                }
            }
        });

        // 75% - Wave
        ScrollTrigger.create({
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            onUpdate: (self) => {
                if (self.progress >= 0.75 && self.progress < 0.76) {
                    this.robotController.wave();
                }
            }
        });

        // Services section - Shrink and move to corner
        ScrollTrigger.create({
            trigger: '.services',
            start: 'top center',
            end: 'bottom center',
            onEnter: () => {
                gsap.to(this.container, {
                    scale: 0.6,
                    x: window.innerWidth > 768 ? '200px' : '50px',
                    y: '-100px',
                    duration: 1,
                    ease: 'power2.out'
                });
            },
            onLeaveBack: () => {
                gsap.to(this.container, {
                    scale: 1,
                    x: 0,
                    y: 0,
                    duration: 1,
                    ease: 'power2.out'
                });
            }
        });

        // Contact section - Return and greet
        ScrollTrigger.create({
            trigger: '.contact',
            start: 'top center',
            onEnter: () => {
                gsap.to(this.container, {
                    scale: 1,
                    x: 0,
                    y: 0,
                    duration: 1,
                    ease: 'back.out(1.4)'
                });

                // Wave greeting
                setTimeout(() => {
                    this.robotController.wave();
                }, 500);
            }
        });
    }

    // ==========================================
    // FLOATING ICON ANIMATIONS
    // ==========================================

    setupFloatingIconAnimations() {
        const icons = gsap.utils.toArray('.float-icon');

        icons.forEach((icon, index) => {
            // Orbital rotation animation
            const duration = 15 + (index * 3);

            gsap.to(icon, {
                rotateZ: 360,
                duration: duration,
                repeat: -1,
                ease: 'none',
                transformOrigin: '50% 50%'
            });

            // Pulsing glow
            gsap.to(icon.querySelector('.icon-glow'), {
                opacity: 0.8,
                scale: 1.2,
                duration: 2 + index,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut'
            });

            // Icon hover effects enhanced
            icon.addEventListener('mouseenter', () => {
                gsap.to(icon, {
                    scale: 1.3,
                    rotateY: 180,
                    duration: 0.6,
                    ease: 'back.out(2)'
                });
            });

            icon.addEventListener('mouseleave', () => {
                gsap.to(icon, {
                    scale: 1,
                    rotateY: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
        });
    }

    // ==========================================
    // VELOCITY-BASED GLOW
    // ==========================================

    setupVelocityGlow() {
        // Initialize flag
        this.entryComplete = false;

        // Wait for entry to complete before enabling
        setTimeout(() => {
            this.entryComplete = true;
        }, 5000); // Entry takes ~3s, add buffer

        ScrollTrigger.create({
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                // SKIP during entry animation to avoid filter conflicts
                if (!this.entryComplete) return;

                // Get scroll velocity
                const velocity = Math.abs(self.getVelocity());
                const normalizedVelocity = Math.min(velocity / 2000, 1);

                // Intensify glow based on scroll speed
                const glowSize = 30 + (normalizedVelocity * 100);
                const glowOpacity = 0.6 + (normalizedVelocity * 0.4);

                gsap.to(this.robot, {
                    filter: `drop-shadow(0 0 ${glowSize}px rgba(139, 92, 246, ${glowOpacity})) drop-shadow(0 0 ${glowSize * 1.5}px rgba(34, 211, 238, ${glowOpacity * 0.6}))`,
                    duration: 0.3,
                    overwrite: 'auto'
                });
            }
        });
    }

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    refresh() {
        ScrollTrigger.refresh();
    }

    kill() {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
}

// Export for global use
window.ScrollEffects = ScrollEffects;
