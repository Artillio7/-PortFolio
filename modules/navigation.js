export class AdvancedNavigation {
    constructor() {
        this.navbar = document.querySelector('nav');
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.navlinks-container');
        this.links = document.querySelectorAll('.navlinks-container a');
        this.lastScroll = 0;
        
        this.initializeNavigation();
    }

    initializeNavigation() {
        // Gestion du menu hamburger
        this.hamburger?.addEventListener('click', () => this.toggleMenu());

        // Gestion du scroll
        window.addEventListener('scroll', () => this.handleScroll());

        // Gestion des liens
        this.links.forEach(link => {
            link.addEventListener('click', (e) => this.handleLinkClick(e));
        });

        // Observer les sections pour la navigation active
        this.setupIntersectionObserver();
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navLinks.classList.toggle('active');
        
        // Animation du menu
        if (this.navLinks.classList.contains('active')) {
            this.animateMenuItems();
        }
    }

    animateMenuItems() {
        this.links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `fadeInRight 0.5s ease forwards ${index * 0.1 + 0.2}s`;
            }
        });
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Effet de masquage/affichage de la navbar
        if (currentScroll > this.lastScroll && currentScroll > 100) {
            this.navbar.style.transform = 'translateY(-100%)';
        } else {
            this.navbar.style.transform = 'translateY(0)';
        }

        // Effet de flou progressif
        const scrolled = window.scrollY;
        const blur = Math.min(scrolled / 200, 10);
        this.navbar.style.backdropFilter = `blur(${blur}px)`;

        this.lastScroll = currentScroll;
    }

    handleLinkClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        // Fermer le menu mobile si ouvert
        if (this.hamburger.classList.contains('active')) {
            this.toggleMenu();
        }

        // Animation de défilement fluide
        const navHeight = this.navbar.offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    setupIntersectionObserver() {
        const sections = document.querySelectorAll('section[id]');
        
        const options = {
            rootMargin: '-50% 0px -50% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Mettre à jour la navigation active
                    this.links.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${entry.target.id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, options);

        sections.forEach(section => observer.observe(section));
    }
}

// Styles pour l'animation du menu
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);
