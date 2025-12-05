/* ==========================================================================
   Portfolio Animations & Interactions
   GSAP ScrollTrigger, 3D Tilt Effects, Modal Controller
   ========================================================================== */

// Wait for DOM and GSAP to be ready
// Wait for window load to ensure all assets are ready
window.addEventListener('load', function () {

    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded. Portfolio animations disabled.');
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    /* ==========================================================================
       Scroll Animations
       ========================================================================== */

    // Portfolio Hero Animation
    const portfolioHero = document.querySelector('.portfolio-hero');
    if (portfolioHero) {
        gsap.from('.portfolio-hero-content h2', {
            scrollTrigger: {
                trigger: '.portfolio-hero',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.portfolio-hero-content p', {
            scrollTrigger: {
                trigger: '.portfolio-hero',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out'
        });
    }

    // Project Cards Stagger Animation
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
        // Set initial state
        gsap.set(projectCards, { autoAlpha: 0, y: 60 });

        ScrollTrigger.batch(projectCards, {
            start: 'top 85%',
            onEnter: batch => gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out',
                overwrite: true
            }),
            once: true
        });

        // Failsafe: Force visibility after 3 seconds if they are in viewport but hidden
        setTimeout(() => {
            projectCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight && getComputedStyle(card).opacity === '0') {
                    card.classList.add('visible');
                    gsap.to(card, { autoAlpha: 1, y: 0, duration: 0.5 });
                }
            });
        }, 3000);
    }

    // Why Section Cards Animation
    const whyCards = document.querySelectorAll('.why-card');
    if (whyCards.length > 0) {
        gsap.from(whyCards, {
            scrollTrigger: {
                trigger: '.why-section',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    // Refresh ScrollTrigger to ensure correct positions
    ScrollTrigger.refresh();

    /* ==========================================================================
       3D Tilt Effect on Mouse Move
       ========================================================================== */

    projectCards.forEach(card => {
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
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        });

        card.addEventListener('mouseleave', function () {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });

    /* ==========================================================================
       Case Study Modal Controller
       ========================================================================== */

    const modal = document.querySelector('.case-study-modal');
    const modalClose = document.querySelector('.modal-close');
    const viewCaseBtns = document.querySelectorAll('.view-case-btn');

    // Project data matching the actual HTML project IDs
    const projectData = {
        'mrandmrspopcorn': {
            title: 'Modern Popcorn Business Platform',
            client: 'MR&MRSPOPCORN',
            image: '',
            summary: 'A modern e-commerce website that increased sales from day 1 and boosted bookings for birthday parties and events. Beautiful design with seamless booking functionality.',
            deliverables: [
                'Custom E-Commerce Platform',
                'Event Booking System',
                'Modern UI/UX Design',
                'Mobile-Responsive Layout',
                'SEO Optimization',
                'Contact Integration'
            ],
            results: [
                { number: 'Day 1', label: 'Sales Generated' },
                { number: '100%', label: 'Booking Increase' },
                { number: '5/5', label: 'Client Satisfaction' }
            ],
            tech: [
                'HTML5 & CSS3',
                'JavaScript',
                'Responsive Design',
                'SEO Best Practices',
                'Performance Optimization'
            ]
        },
        'chaiclub': {
            title: 'Digital Menu Experience',
            client: 'ChaiClub',
            image: '',
            summary: 'A modern digital menu solution that transforms the traditional cafe experience with elegant design and smooth navigation. Created to enhance customer experience with beautiful visuals.',
            deliverables: [
                'Digital Menu System',
                'Modern UI/UX Design',
                'Smooth Navigation',
                'Mobile-First Approach',
                'Fast Loading Times',
                'Easy Updates'
            ],
            results: [
                { number: 'Modern', label: 'User Experience' },
                { number: 'Fast', label: 'Page Load Speed' },
                { number: '100%', label: 'Mobile Compatible' }
            ],
            tech: [
                'HTML5 & CSS3',
                'JavaScript',
                'Responsive Framework',
                'Modern Web Standards',
                'UI/UX Best Practices'
            ]
        },
        'techmans': {
            title: 'Automation Solutions Platform',
            client: 'Techmans',
            image: '',
            summary: 'A comprehensive automation platform showcasing cutting-edge solutions. In every step we make a forward. Built to showcase automation capabilities and technology expertise.',
            deliverables: [
                'Corporate Website',
                'Services Showcase',
                'Modern Design System',
                'Responsive Layout',
                'Professional Branding',
                'Contact Integration'
            ],
            results: [
                { number: 'Premium', label: 'Design Quality' },
                { number: 'Fast', label: 'Performance' },
                { number: 'Modern', label: 'Technology Stack' }
            ],
            tech: [
                'HTML5 & CSS3',
                'JavaScript',
                'Modern Web Design',
                'Responsive Framework',
                'Performance Optimization'
            ]
        }
    };

    // Open modal when clicking card (but not the button)
    projectCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // If clicking the "Visit Website" button or its children, allow default behavior
            if (e.target.closest('.view-case-btn')) {
                return; // Let the link work normally
            }

            const projectId = card.dataset.project;
            const project = projectData[projectId];

            if (project && modal) {
                e.preventDefault();
                e.stopPropagation();
                populateModal(project);
                openModal();
            }
        });
    });

    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close on click outside
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close on ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Populate modal with project data
    function populateModal(project) {
        const modalContent = modal.querySelector('.modal-content');
        if (!modalContent) return;

        // Update title
        const titleEl = modalContent.querySelector('.modal-project-title');
        if (titleEl) titleEl.textContent = project.title;

        // Update summary
        const summaryEl = modalContent.querySelector('.modal-project-summary');
        if (summaryEl) summaryEl.textContent = project.summary;

        // Update deliverables
        const deliverablesEl = modalContent.querySelector('.modal-deliverables ul');
        if (deliverablesEl && project.deliverables) {
            deliverablesEl.innerHTML = project.deliverables.map(item =>
                `<li>${item}</li>`
            ).join('');
        }

        // Update results
        const resultsEl = modalContent.querySelector('.results-stats');
        if (resultsEl && project.results) {
            resultsEl.innerHTML = project.results.map(stat => `
                <div class="stat-item">
                    <div class="stat-number">${stat.number}</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
            `).join('');
        }

        // Update tech stack
        const techEl = modalContent.querySelector('.modal-tech ul');
        if (techEl && project.tech) {
            techEl.innerHTML = project.tech.map(tech =>
                `<li>${tech}</li>`
            ).join('');
        }
    }

    // Open modal function
    function openModal() {
        if (!modal) return;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate modal content
        gsap.from('.modal-content', {
            scale: 0.9,
            opacity: 0,
            duration: 0.4,
            ease: 'power3.out'
        });
    }

    // Close modal function
    function closeModal() {
        if (!modal) return;

        gsap.to('.modal-content', {
            scale: 0.9,
            opacity: 0,
            duration: 0.3,
            ease: 'power3.in',
            onComplete: () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});
