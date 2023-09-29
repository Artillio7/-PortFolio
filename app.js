
const navbarToggler = document.querySelector('.navbar-toggler');
navbarToggler.addEventListener('click', function() {
    navbar.classList.toggle('show');
    navbarToggler.classList.toggle('active');
});

const descriptionButtons = document.querySelectorAll('[data-toggle="modal"]');
descriptionButtons.forEach(button => {
    button.addEventListener('click', function() {
        const description = this.closest('.card-body').querySelector('.collapse').textContent;
        document.querySelector('.modal-body').textContent = description;
    });
});

 

AOS.init();

document.querySelector('.navbar-toggler').addEventListener('click', function() {
    var icon = this.querySelector('.navbar-toggler-icon');
    if (icon.classList.contains('active')) {
        icon.classList.remove('active');
    } else {
        icon.classList.add('active');
    }
});

document.addEventListener('click', function(event) {
  var isClickInside = document.querySelector('.navbar').contains(event.target);
  var isOpened = document.querySelector('.navbar-collapse').classList.contains('show');
  if (!isClickInside && isOpened) {
    document.querySelector('.navbar-toggler').click();
  }
});
