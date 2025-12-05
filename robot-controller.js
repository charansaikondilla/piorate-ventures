// ============================================
// ROBOT 3D CONTROLLER
// Advanced mouse tracking and 3D transformations
// ============================================

class RobotController {
    constructor(robotElement, containerElement) {
        this.robot = robotElement;
        this.container = containerElement;

        // Mouse tracking state
        this.mouse = { x: 0, y: 0 };
        this.target = { rotateX: 0, rotateY: 0, rotateZ: 0 };
        this.current = { rotateX: 0, rotateY: 0, rotateZ: 0 };

        // Animation state
        this.isHovered = false;
        this.scrollProgress = 0;

        // Configuration
        this.config = {
            mouseInfluence: 25,        // Max rotation degrees from mouse
            smoothness: 0.15,          // Lerp smoothness (0-1)
            magneticRange: 300,        // Pixels for magnetic effect
            floatAmplitude: 30,        // Floating motion range
            floatSpeed: 3,             // Floating animation speed
        };

        this.init();
    }

    init() {
        // Register GSAP plugin
        gsap.registerPlugin(ScrollTrigger);

        // Setup event listeners
        this.setupMouseTracking();
        this.setupContinuousFloating();

        console.log('🤖 Robot Controller Initialized');
    }

    // ==========================================
    // MOUSE TRACKING & GYROSCOPIC RESPONSE
    // ==========================================

    setupMouseTracking() {
        // Track mouse movement globally
        document.addEventListener('mousemove', (e) => {
            this.updateMousePosition(e);
        });

        // Container hover effects
        this.container.addEventListener('mouseenter', () => {
            this.isHovered = true;
            this.onRobotHover();
        });

        this.container.addEventListener('mouseleave', () => {
            this.isHovered = false;
            this.onRobotLeave();
        });

        // Start animation loop
        this.startTrackingLoop();
    }

    updateMousePosition(e) {
        const rect = this.container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from center
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Normalize to -1 to 1 range
        this.mouse.x = deltaX / (rect.width / 2);
        this.mouse.y = deltaY / (rect.height / 2);

        // Apply magnetic effect if within range
        if (distance < this.config.magneticRange) {
            const magneticStrength = 1 - (distance / this.config.magneticRange);
            this.target.rotateY = this.mouse.x * this.config.mouseInfluence * magneticStrength;
            this.target.rotateX = -this.mouse.y * this.config.mouseInfluence * magneticStrength;
            this.target.rotateZ = this.mouse.x * 5 * magneticStrength; // Slight tilt
        } else {
            // Return to neutral when far away
            if (!this.isHovered) {
                this.target.rotateX = 0;
                this.target.rotateY = 0;
                this.target.rotateZ = 0;
            }
        }
    }

    startTrackingLoop() {
        // Use GSAP ticker for smooth 60fps updates
        gsap.ticker.add(() => {
            this.updateRobotRotation();
        });
    }

    updateRobotRotation() {
        // Smooth lerp interpolation
        this.current.rotateX += (this.target.rotateX - this.current.rotateX) * this.config.smoothness;
        this.current.rotateY += (this.target.rotateY - this.current.rotateY) * this.config.smoothness;
        this.current.rotateZ += (this.target.rotateZ - this.current.rotateZ) * this.config.smoothness;

        // Apply transformation
        gsap.set(this.robot, {
            rotateX: this.current.rotateX,
            rotateY: this.current.rotateY,
            rotateZ: this.current.rotateZ,
            transformPerspective: 1500
        });
    }

    // ==========================================
    // HOVER EFFECTS
    // ==========================================

    onRobotHover() {
        gsap.to(this.robot, {
            scale: 1.1,
            duration: 0.6,
            ease: 'power2.out'
        });

        // Don't touch filter - it's managed by velocity glow
    }

    onRobotLeave() {
        gsap.to(this.robot, {
            scale: 1,
            duration: 0.6,
            ease: 'power2.out'
        });

        // Don't touch filter - it's managed by velocity glow
    }

    // ==========================================
    // CONTINUOUS FLOATING ANIMATION
    // ==========================================

    setupContinuousFloating() {
        // Infinite figure-8 floating motion
        // Delay start until after entry animation completes
        const floatTimeline = gsap.timeline({
            repeat: -1,
            delay: 3 // Wait for entry animation to complete
        });

        floatTimeline.to(this.robot, {
            y: `+=${this.config.floatAmplitude}`,
            x: '+=15',
            rotateZ: 3,
            duration: this.config.floatSpeed,
            ease: 'sine.inOut'
        });

        floatTimeline.to(this.robot, {
            y: `-=${this.config.floatAmplitude}`,
            x: '-=15',
            rotateZ: -3,
            duration: this.config.floatSpeed,
            ease: 'sine.inOut'
        });
    }

    // ==========================================
    // SCROLL INTEGRATION
    // ==========================================

    updateScrollProgress(progress) {
        this.scrollProgress = progress;

        // Modify behavior based on scroll position
        if (progress > 0.5) {
            // Reduce mouse influence when scrolled down
            this.config.mouseInfluence = 15;
        } else {
            this.config.mouseInfluence = 25;
        }
    }

    // ==========================================
    // SPECIAL ANIMATIONS
    // ==========================================

    spin360() {
        return gsap.to(this.robot, {
            rotateY: '+=360',
            duration: 1.5,
            ease: 'power2.inOut'
        });
    }

    bounce() {
        return gsap.to(this.robot, {
            y: '-=100',
            duration: 0.6,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1
        });
    }

    wave() {
        const waveTimeline = gsap.timeline();

        waveTimeline.to(this.robot, {
            rotateZ: 15,
            duration: 0.3,
            ease: 'power2.out'
        });

        waveTimeline.to(this.robot, {
            rotateZ: -15,
            duration: 0.3,
            ease: 'power2.inOut',
            repeat: 2,
            yoyo: true
        });

        waveTimeline.to(this.robot, {
            rotateZ: 0,
            duration: 0.3,
            ease: 'power2.in'
        });

        return waveTimeline;
    }

    pulseGlow() {
        return gsap.to(this.robot, {
            filter: 'drop-shadow(0 0 100px rgba(139, 92, 246, 1)) drop-shadow(0 0 150px rgba(34, 211, 238, 0.8))',
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    }
}

// Export for global use
window.RobotController = RobotController;
