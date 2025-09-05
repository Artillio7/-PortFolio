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

    function openMenu() {
        menuOpen = true;
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        body.style.overflow = 'hidden';
        if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        menuOpen = false;
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = '';
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
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
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

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

const profileImg = document.querySelector('.profile-img');
if (profileImg) {
    // Add initial fade-in animation
    profileImg.style.opacity = '0';
    setTimeout(() => {
        profileImg.style.opacity = '1';
        profileImg.style.transform = 'scale(1)';
    }, 500);

    // Add hover effect
    profileImg.addEventListener('mouseenter', () => {
        profileImg.style.transform = 'scale(1.1)';
    });

    profileImg.addEventListener('mouseleave', () => {
        profileImg.style.transform = 'scale(1)';
    });
}

// Smooth scroll
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
