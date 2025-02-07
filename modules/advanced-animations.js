export class AdvancedAnimations {
    constructor() {
        this.initializeParticles();
        this.initializeTextEffects();
        this.initializeScrollAnimations();
    }

    initializeParticles() {
        const canvas = document.createElement('canvas');
        canvas.classList.add('particle-canvas');
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.size = Math.random() * 3;
                this.alpha = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    initializeTextEffects() {
        const texts = document.querySelectorAll('.animated-text');
        texts.forEach(text => {
            const content = text.textContent;
            text.textContent = '';
            
            [...content].forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.animationDelay = `${index * 0.1}s`;
                span.classList.add('char-animation');
                text.appendChild(span);
            });
        });
    }

    initializeScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('skill-bar')) {
                        entry.target.style.width = entry.target.dataset.progress + '%';
                    }
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        document.querySelectorAll('.skill-bar').forEach(el => observer.observe(el));
    }
}

class TitleAnimator {
    constructor() {
        this.title = document.getElementById('mainTitle');
        this.originalText = this.title.textContent;
        this.letters = [];
        this.init();
    }

    init() {
        // Vider le titre
        this.title.textContent = '';
        
        // Créer un wrapper pour l'effet de profondeur
        const wrapper = document.createElement('div');
        wrapper.className = 'title-wrapper';
        this.title.appendChild(wrapper);

        // Créer les spans pour chaque lettre
        [...this.originalText].forEach((char, index) => {
            const letter = document.createElement('span');
            letter.className = 'animated-letter';
            letter.textContent = char;
            letter.style.setProperty('--index', index);
            
            // Ajouter des data attributes pour l'animation
            letter.dataset.char = char;
            letter.dataset.index = index;
            
            // Stocker la référence
            this.letters.push(letter);
            wrapper.appendChild(letter);

            // Ajouter les événements
            this.addLetterEvents(letter);
        });

        // Démarrer l'animation initiale
        this.startEntryAnimation();
        
        // Ajouter l'effet de suivi de souris
        this.addMouseTracking();
    }

    addLetterEvents(letter) {
        letter.addEventListener('mouseover', () => {
            this.animateLetter(letter);
            this.createGlowEffect(letter);
        });

        letter.addEventListener('mouseout', () => {
            this.resetLetter(letter);
        });
    }

    animateLetter(letter) {
        letter.style.animation = 'none';
        letter.offsetHeight; // Forcer le reflow
        letter.classList.add('letter-hover');
        
        // Effet de vague sur les lettres voisines
        const index = parseInt(letter.dataset.index);
        this.letters.forEach((l, i) => {
            const distance = Math.abs(i - index);
            if (distance < 3 && l !== letter) {
                l.style.transform = `translateY(${-5 + distance * 2}px)`;
                l.style.transition = 'transform 0.3s ease';
            }
        });
    }

    resetLetter(letter) {
        letter.classList.remove('letter-hover');
        
        // Réinitialiser les lettres voisines
        this.letters.forEach(l => {
            l.style.transform = '';
        });
    }

    createGlowEffect(letter) {
        const glow = document.createElement('div');
        glow.className = 'letter-glow';
        letter.appendChild(glow);
        
        setTimeout(() => glow.remove(), 500);
    }

    startEntryAnimation() {
        this.letters.forEach((letter, index) => {
            letter.style.animation = `
                fadeInUp 0.6s ease-out ${index * 0.05}s forwards,
                float 3s ease-in-out ${index * 0.05}s infinite
            `;
        });
    }

    addMouseTracking() {
        const wrapper = this.title.querySelector('.title-wrapper');
        
        document.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) / 30;
            const deltaY = (e.clientY - centerY) / 30;
            
            this.letters.forEach((letter, index) => {
                const depth = 1 - Math.min(0.5, index * 0.02);
                letter.style.transform = `
                    translate(${deltaX * depth}px, ${deltaY * depth}px)
                    rotateX(${-deltaY}deg)
                    rotateY(${deltaX}deg)
                `;
            });
        });
    }
}

class NavbarAnimator {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.magneticItems = document.querySelectorAll('.magnetic');
        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupMagneticEffect();
        this.setupLinkAnimations();
    }

    setupScrollEffect() {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const scrollDelta = currentScroll - lastScroll;
            
            // Ajoute/retire la classe scrolled
            if (currentScroll > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            // Effet de masquage/affichage de la navbar
            if (scrollDelta > 0 && currentScroll > 100) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        });
    }

    setupMagneticEffect() {
        this.magneticItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const bounds = item.getBoundingClientRect();
                const mouseX = e.clientX - bounds.left;
                const mouseY = e.clientY - bounds.top;
                const centerX = bounds.width / 2;
                const centerY = bounds.height / 2;
                const deltaX = mouseX - centerX;
                const deltaY = mouseY - centerY;
                const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
                const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
                const strength = 0.4;

                const x = (deltaX / maxDistance) * strength * 20;
                const y = (deltaY / maxDistance) * strength * 20;

                item.style.transform = `translate(${x}px, ${y}px)`;
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translate(0, 0)';
            });
        });
    }

    setupLinkAnimations() {
        this.navLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const letters = link.textContent.split('');
                link.textContent = '';
                letters.forEach((letter, i) => {
                    const span = document.createElement('span');
                    span.textContent = letter;
                    span.style.animationDelay = `${i * 0.05}s`;
                    link.appendChild(span);
                });
            });
        });
    }
}

class WelcomeAnimator {
    constructor() {
        this.container = document.querySelector('.text-welcome');
        this.text = document.querySelector('.text');
        this.init();
    }

    init() {
        this.setupParticleEffect();
        this.setupTextAnimation();
        this.setupMouseTracking();
    }

    setupParticleEffect() {
        const canvas = document.createElement('canvas');
        canvas.classList.add('particles-canvas');
        this.container.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        const particles = [];

        const resizeCanvas = () => {
            canvas.width = this.container.offsetWidth;
            canvas.height = this.container.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3;
                this.speedX = (Math.random() - 0.5) * 2;
                this.speedY = (Math.random() - 0.5) * 2;
                this.opacity = Math.random() * 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.fillStyle = `rgba(74, 144, 226, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animate);
        };
        animate();
    }

    setupTextAnimation() {
        const spans = this.text.querySelectorAll('span');
        spans.forEach((span, i) => {
            span.style.animationDelay = `${i * 0.1}s`;
            span.addEventListener('mouseover', () => {
                span.style.transform = 'translateZ(50px) rotateY(10deg)';
                span.style.color = '#4a90e2';
            });
            span.addEventListener('mouseout', () => {
                span.style.transform = 'translateZ(0) rotateY(0)';
                span.style.color = '';
            });
        });
    }

    setupMouseTracking() {
        this.container.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = this.container.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            this.text.style.transform = `
                perspective(1000px)
                rotateX(${y * 10}deg)
                rotateY(${x * 10}deg)
                translateZ(20px)
            `;
        });

        this.container.addEventListener('mouseleave', () => {
            this.text.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new TitleAnimator();
    new NavbarAnimator();
    new WelcomeAnimator();
});
