// Parallax Text Animation Controller
document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Parallax animations disabled.');
        return;
    }

    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    } else {
        console.warn('ScrollTrigger not loaded. Some animations disabled.');
    }

    initPremiumMarquees();
    initFadeAnimations();
    initRevealText();
    initBgColorChange();
});

// ==================================
// Premium Infinite Marquee Effect
// ==================================
function initPremiumMarquees() {
    // 1. Hero Background Text Marquee
    const heroBgText = document.querySelector('.hero-bg-text');
    if (heroBgText) {
        // Reduced speed for premium feel
        createMarquee(heroBgText, 0.2, 'marquee-item');
    }

    // 2. Parallax Section Text Marquee
    const parallaxContainer = document.querySelector('.text-parallax-container');
    if (parallaxContainer) {
        const originalText = parallaxContainer.querySelector('.parallax-text-layer');
        if (originalText) {
            let wrapper = document.createElement('div');
            wrapper.className = 'parallax-text-wrapper';

            originalText.parentNode.insertBefore(wrapper, originalText);
            wrapper.appendChild(originalText);

            createMarquee(wrapper.parentNode, 0.3, 'parallax-text-layer');
        }
    }
}

function createMarquee(container, speed = 1, itemClass) {
    const originalItem = container.querySelector(`.${itemClass}`) || container.firstElementChild;
    if (!originalItem) return;

    const textContent = originalItem.textContent;
    // IMPORTANT: Get the computed style BEFORE clearing the container
    const itemFont = getComputedStyle(originalItem).font;

    // Clear container
    container.innerHTML = '';

    // Create a wrapper for the loop
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexWrap = 'nowrap';
    wrapper.style.width = 'max-content';
    container.appendChild(wrapper);

    // Calculate copies needed
    const itemWidth = measureTextWidth(textContent, itemFont);
    const screenWidth = window.innerWidth;

    // DESKTOP PARITY: Use generous buffer for all devices
    const buffer = 4;

    // Always use standard density logic
    const copies = Math.ceil((screenWidth * 2) / itemWidth) + buffer;

    const items = [];
    for (let i = 0; i < copies; i++) {
        const item = document.createElement('div');
        item.className = itemClass;
        item.textContent = textContent;
        if (itemClass === 'parallax-text-layer' && i % 2 !== 0) {
            item.classList.add('filled');
        }
        wrapper.appendChild(item);
        items.push(item);
    }

    // GSAP Horizontal Loop
    const tl = gsap.to(wrapper, {
        x: "-=50%",
        duration: 20 / speed,
        ease: "none",
        repeat: -1,
        modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % (wrapper.offsetWidth / 2))
        }
    });

    // Velocity Effect
    ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            const velocity = self.getVelocity();
            const timeScale = 1 + (Math.abs(velocity) / 300); // Sensitivity
            gsap.to(tl, { timeScale: timeScale, duration: 0.5, overwrite: true });
            gsap.to(tl, { timeScale: 1, duration: 1, delay: 0.5 });
        }
    });
}

function measureTextWidth(text, font) {
    const canvas = measureTextWidth.canvas || (measureTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

// ==================================
// Fade Up Animation
// ==================================
function initFadeAnimations() {
    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => {
        gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });
}

// ==================================
// Reveal Text Animation
// ==================================
function initRevealText() {
    const revealTextElements = document.querySelectorAll('.reveal-text');
    revealTextElements.forEach(el => {
        gsap.from(el, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
                trigger: el,
                start: "top 80%"
            }
        });
    });
}

// ==================================
// Background Color Change
// ==================================
function initBgColorChange() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.hasAttribute('data-bgcolor')) {
            ScrollTrigger.create({
                trigger: section,
                start: "top 50%",
                end: "bottom 50%",
                onEnter: () => gsap.to('body', { backgroundColor: section.getAttribute('data-bgcolor'), duration: 1 }),
                onEnterBack: () => gsap.to('body', { backgroundColor: section.getAttribute('data-bgcolor'), duration: 1 })
            });
        }
    });
}
