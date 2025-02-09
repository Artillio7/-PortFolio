// Menu hamburger
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    
    // Fonction pour basculer le menu
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');

        // Ajouter/retirer la classe content-blur aux sections principales
        document.querySelectorAll('section').forEach(section => {
            section.classList.toggle('content-blur');
        });
    }

    // Event listener pour le hamburger
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Animation de fermeture du menu
            toggleMenu();
            
            // Scroll vers la section après un court délai
            const targetId = this.getAttribute('href');
            setTimeout(() => {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 300);
        });
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            toggleMenu();
        }
    });

    // Désactiver le scroll quand le menu est ouvert
    function disableScroll() {
        body.style.overflow = 'hidden';
    }

    function enableScroll() {
        body.style.overflow = '';
    }

    // Observer les changements de classe sur le menu
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.classList.contains('active')) {
                disableScroll();
            } else {
                enableScroll();
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
