document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initFavoritesModal();
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    checkElementsInViewport(animatedElements);
    window.addEventListener('scroll', function() {
        checkElementsInViewport(animatedElements);
    });
}

function checkElementsInViewport(elements) {
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
            const delay = element.getAttribute('data-delay');
            if (delay) {
                setTimeout(() => {
                    element.classList.add('visible');
                }, delay * 1000);
            } else {
                element.classList.add('visible');
            }
        }
    });
}

function initFavoritesModal() {
    const favoritesBtn = document.getElementById('favoritesBtn');
    const favoritesList = document.getElementById('favoritesList');
    if (favoritesBtn && favoritesList) {
        const favoritesModal = new bootstrap.Modal(document.getElementById('favoritesModal'));
        favoritesBtn.addEventListener('click', function() {
            updateFavoritesList();
            favoritesModal.show();
        });
    }
}

function updateFavoritesList() {
    const favoritesList = document.getElementById('favoritesList');
    if (favoritesList) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesList.innerHTML = '';
        if (favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-heart" style="font-size: 3rem; color: #e0e0e0;"></i>
                    <p class="mt-3 text-muted">No favorites yet. Start adding some!</p>
                </div>
            `;
            return;
        }
        favorites.forEach((favName, index) => {
            const col = document.createElement('div');
            col.className = 'col-md-6 mb-4';
            col.style.opacity = '0';
            col.style.transform = 'translateY(20px)';
            col.style.transition = 'all 0.3s ease';
            col.style.transitionDelay = `${index * 0.05}s`;
            col.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${favName}</h5>
                        <p class="card-text text-muted">
                            <i class="bi bi-heart-fill text-danger"></i> Added to favorites
                        </p>
                        <a href="index.html" class="btn btn-primary btn-sm">
                            <i class="bi bi-search"></i> View Details
                        </a>
                    </div>
                </div>
            `;
            favoritesList.appendChild(col);
            setTimeout(() => {
                col.style.opacity = '1';
                col.style.transform = 'translateY(0)';
            }, 10);
        });
    }
}