
const navbarToggler = document.querySelector('.navbar-toggler');
navbarToggler.addEventListener('click', function() {
    navbar.classList.toggle('show');
});

const descriptionButtons = document.querySelectorAll('[data-toggle="modal"]');
descriptionButtons.forEach(button => {
    button.addEventListener('click', function() {
        const description = this.closest('.card-body').querySelector('.collapse').textContent;
        document.querySelector('.modal-body').textContent = description;
    });
});

 
