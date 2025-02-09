// Menu hamburger avec animations avancées
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    let isAnimating = false;

    // Fonction pour gérer l'animation du menu
    function toggleMenu(event) {
        if (isAnimating) return;
        isAnimating = true;

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');

        // Effet de flou sur le contenu principal
        document.querySelectorAll('main section').forEach(section => {
            section.classList.toggle('content-blur');
        });

        // Animation des liens du menu
        const links = navMenu.querySelectorAll('.nav-link');
        if (navMenu.classList.contains('active')) {
            links.forEach((link, index) => {
                link.style.animation = `slideIn 0.4s ease forwards ${index * 0.1}s`;
                link.style.opacity = '0';
                setTimeout(() => {
                    link.style.opacity = '1';
                }, index * 100);
            });
        } else {
            links.forEach(link => {
                link.style.animation = '';
                link.style.opacity = '0';
            });
        }

        // Réinitialiser l'état d'animation après la transition
        setTimeout(() => {
            isAnimating = false;
        }, 400);
    }

    // Event listener pour le hamburger avec effet sonore
    hamburger.addEventListener('click', toggleMenu);

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Fermer le menu avec animation
            toggleMenu();
            
            // Scroll vers la section après la fermeture du menu
            setTimeout(() => {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 400);
        });
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', function(e) {
        const isClickInside = navMenu.contains(e.target) || hamburger.contains(e.target);
        
        if (!isClickInside && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Désactiver le scroll quand le menu est ouvert
    function toggleScroll() {
        body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
    }

    // Observer les changements de classe sur le menu
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.classList.contains('active')) {
                toggleScroll();
            } else {
                toggleScroll();
            }
        });
    });

    observer.observe(navMenu, { attributes: true, attributeFilter: ['class'] });
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

AOS.init();

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
