// Menu hamburger avec animations avancées et accessibilité
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    let menuOpen = false;

    // Accessibilité du bouton hamburger
    if (hamburger) {
        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('tabindex', '0');
        hamburger.setAttribute('aria-controls', 'nav-menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Ouvrir le menu');
    }

    if (!hamburger || !navMenu) return;

    function openMenu() {
        menuOpen = true;
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        body.style.overflow = 'hidden';
        hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        menuOpen = false;
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
    }

    // Event listener pour le hamburger - un seul clic
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Activation clavier (Enter / Espace)
    hamburger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (menuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        }
    });

    // Fermer le menu avec Echap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuOpen) {
            closeMenu();
        }
    });

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            closeMenu();
            
            // Scroll vers la section
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', function(e) {
        if (menuOpen && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });
});

// Gestion des descriptions de projet
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.card');
    
    projectCards.forEach(card => {
        const descriptionBtn = card.querySelector('.btn-primary');
        const description = card.querySelector('.collapse');
        
        if (descriptionBtn && description) {
            descriptionBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Ferme toutes les autres cartes
                projectCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('flipped');
                        const otherDescription = otherCard.querySelector('.collapse');
                        if (otherDescription) {
                            otherDescription.classList.remove('show');
                            otherDescription.style.opacity = '0';
                        }
                    }
                });
                
                // Gestion de la carte actuelle
                card.classList.toggle('flipped');
                
                // Si la carte est retournée, affiche la description
                if (card.classList.contains('flipped')) {
                    description.classList.add('show');
                    // Petit délai pour l'animation
                    setTimeout(() => {
                        description.style.opacity = '1';
                    }, 150);
                } else {
                    description.style.opacity = '0';
                    // Attend la fin de l'animation de fade out
                    setTimeout(() => {
                        description.classList.remove('show');
                    }, 300);
                }
            });
        }
    });
    
    // Ferme les descriptions si on clique en dehors
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.card')) {
            projectCards.forEach(card => {
                card.classList.remove('flipped');
                const description = card.querySelector('.collapse');
                if (description) {
                    description.style.opacity = '0';
                    setTimeout(() => {
                        description.classList.remove('show');
                    }, 300);
                }
            });
        }
    });
});

// Navbar Scroll Effect
(function initNavbarScroll() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    let navTicking = false;
    window.addEventListener('scroll', () => {
        if (!navTicking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                navTicking = false;
            });
            navTicking = true;
        }
    }, { passive: true });
})();

const descriptionButtons = document.querySelectorAll('[data-toggle="modal"]');
descriptionButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const description =
      this.closest(".card-body").querySelector(".collapse").textContent;
    document.querySelector(".modal-body").textContent = description;
  });
});

// Chargement dynamique d'AOS via CDN si non présent
(function ensureAOS() {
  if (window.AOS) {
    try {
      window.AOS.init({ once: true, duration: 700, easing: 'ease-out-quart' });
    } catch (e) { console.error('Erreur init AOS:', e); }
    return;
  }
  if (window.__aosLoading) return; // éviter double chargement
  window.__aosLoading = true;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/aos@2.3.4/dist/aos.css';
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/aos@2.3.4/dist/aos.js';
  script.defer = true;
  script.onload = () => {
    window.__aosLoading = false;
    if (window.AOS) {
      try { window.AOS.init({ once: true, duration: 700, easing: 'ease-out-quart' }); } catch (e) { console.error('Erreur init AOS:', e); }
    }
  };
  script.onerror = () => {
    window.__aosLoading = false;
    console.warn('Impossible de charger AOS depuis le CDN');
  };
  document.head.appendChild(script);
})();

new ResizeObserver((entries) => {
  if (entries[0].contentRect.width <= 900) {
    document.getElementById('nav-menu').style.transition = "transform 0.4s ease-out";
  } else {
    document.getElementById('nav-menu').style.transition = "none";
  }
}).observe(document.body);

// ============================================
// CYBER PROFILE - Animations Interactives Avancées
// ============================================
(function initCyberProfile() {
    const cyberProfile = document.getElementById('cyber-profile');
    const profileImg = document.querySelector('.profile-img');

    if (!cyberProfile || !profileImg) return;

    let profileRect = cyberProfile.getBoundingClientRect();
    let isHovering = false;

    // Animation d'entrée spectaculaire
    profileImg.style.opacity = '0';
    profileImg.style.transform = 'scale(0.8) rotateY(-30deg)';

    setTimeout(() => {
        profileImg.style.transition = 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        profileImg.style.opacity = '1';
        profileImg.style.transform = 'scale(1) rotateY(0deg)';
    }, 300);

    // Effet parallaxe 3D au mouvement de souris
    document.addEventListener('mousemove', (e) => {
        if (!isHovering) {
            // Effet global subtil
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const deltaX = (e.clientX - centerX) / centerX;
            const deltaY = (e.clientY - centerY) / centerY;

            cyberProfile.style.transform = `
                translateY(${Math.sin(Date.now() / 1000) * 10}px)
                rotateY(${deltaX * 5}deg)
                rotateX(${-deltaY * 5}deg)
            `;
        }
    });

    // Effet intensif au survol du profil
    cyberProfile.addEventListener('mouseenter', () => {
        isHovering = true;
        profileRect = cyberProfile.getBoundingClientRect();

    });

    cyberProfile.addEventListener('mousemove', (e) => {
        if (!isHovering) return;

        const x = e.clientX - profileRect.left;
        const y = e.clientY - profileRect.top;
        const centerX = profileRect.width / 2;
        const centerY = profileRect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        // Transformation 3D dynamique
        cyberProfile.style.transform = `
            perspective(1000px)
            rotateY(${deltaX * 15}deg)
            rotateX(${-deltaY * 15}deg)
            scale(1.05)
        `;

        // Déplacer la lumière sur l'image
        profileImg.style.background = `
            radial-gradient(
                circle at ${x}px ${y}px,
                rgba(74, 144, 226, 0.15) 0%,
                transparent 50%
            )
        `;
    });

    cyberProfile.addEventListener('mouseleave', () => {
        isHovering = false;
        cyberProfile.style.transform = '';
        profileImg.style.background = '';
    });

    // Effet de clic - pulse énergétique
    cyberProfile.addEventListener('click', () => {
        cyberProfile.style.animation = 'none';
        cyberProfile.offsetHeight; // Reflow

        // Créer une onde de choc
        const shockwave = document.createElement('div');
        shockwave.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background: transparent;
            border: 2px solid rgba(74, 144, 226, 0.8);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: shockwave 0.8s ease-out forwards;
            pointer-events: none;
            z-index: 20;
        `;
        cyberProfile.appendChild(shockwave);

        setTimeout(() => shockwave.remove(), 800);


        cyberProfile.style.animation = 'profile-float 6s ease-in-out infinite';
    });

    // Ajouter le keyframe shockwave dynamiquement
    if (!document.getElementById('cyber-profile-keyframes')) {
        const style = document.createElement('style');
        style.id = 'cyber-profile-keyframes';
        style.textContent = `
            @keyframes shockwave {
                0% {
                    width: 10px;
                    height: 10px;
                    opacity: 1;
                }
                100% {
                    width: 400px;
                    height: 400px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Mise à jour de la position au resize
    window.addEventListener('resize', () => {
        profileRect = cyberProfile.getBoundingClientRect();
    });
})();

// Back to top button
(function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    let ticking = false;

    function updateButtonVisibility() {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateButtonVisibility);
            ticking = true;
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Keyboard support
    backToTopBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
})();

// Scroll reveal animations with IntersectionObserver
(function initScrollReveal() {
    const revealElements = document.querySelectorAll('.service-card, .card-container, .contact-item');

    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
})();
