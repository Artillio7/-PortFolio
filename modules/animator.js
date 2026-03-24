// Gestionnaire d'animations
class Animator {
    constructor() {
        this.initFadeAnimations();
        this.initScrollAnimations();
        this.initTextAnimations();
    }

    initFadeAnimations() {
        // Sélectionner tous les éléments avec la classe fade-in
        const fadeElements = document.querySelectorAll('.fade-in');
        
        // Observer les éléments pour l'animation fade-in
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        // Observer chaque élément fade-in
        fadeElements.forEach(element => {
            fadeObserver.observe(element);
        });
    }

    initScrollAnimations() {
        // Animation au scroll pour les sections
        const scrollElements = document.querySelectorAll('[data-aos]');
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, {
            threshold: 0.1
        });

        scrollElements.forEach(element => {
            scrollObserver.observe(element);
        });
    }

    initTextAnimations() {
        // Animation du texte de présentation
        const text = document.querySelector('.text');
        if (text) {
            const content = text.textContent;
            text.textContent = '';
            
            // Créer les spans pour chaque lettre
            [...content].forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.animationDelay = `${index * 0.1}s`;
                text.appendChild(span);
            });
        }
    }
}

// Exporter la classe Animator
export { Animator };

// Initialiser l'animateur quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new Animator();
});

export class ProfileAnimator {
    constructor(element) {
        this.element = element;
        this.baseY = 0;
        this.amplitude = 15;
        this.frequency = 0.002;
        this.initFloatingEffect();
        this.addHoverEffect();
    }

    initFloatingEffect() {
        let startTime = performance.now();
        const animate = (currentTime) => {
            if (document.hidden) {
                this._rafId = requestAnimationFrame(animate);
                return;
            }
            const elapsed = currentTime - startTime;
            const yOffset = Math.sin(elapsed * this.frequency) * this.amplitude;

            this.element.style.transform = `translateY(${this.baseY + yOffset}px)`;
            this._rafId = requestAnimationFrame(animate);
        };
        this._rafId = requestAnimationFrame(animate);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this._rafId) {
                cancelAnimationFrame(this._rafId);
                this._rafId = null;
            } else if (!document.hidden && !this._rafId) {
                startTime = performance.now();
                this._rafId = requestAnimationFrame(animate);
            }
        });
    }

    addHoverEffect() {
        this.element.addEventListener('mouseenter', () => {
            this.amplitude = 25;
            this.frequency = 0.003;
        });

        this.element.addEventListener('mouseleave', () => {
            this.amplitude = 15;
            this.frequency = 0.002;
        });
    }
}

export class ScrollManager {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.navItems = document.querySelectorAll('.navlinks-container a');
        this.setupIntersectionObserver();
        this.setupScrollProgress();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.3,
            rootMargin: '-50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Activation de la section courante
                    this.activateNavItem(entry.target.id);
                    entry.target.classList.add('section-visible');
                }
            });
        }, options);

        this.sections.forEach(section => observer.observe(section));
    }

    activateNavItem(sectionId) {
        this.navItems.forEach(item => {
            const href = item.getAttribute('href').substring(1);
            item.classList.toggle('active', href === sectionId);
        });
    }

    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    const scrolled = (winScroll / height) * 100;
                    progressBar.style.width = scrolled + '%';
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });
    }
}
