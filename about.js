document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize favorites modal
    initFavoritesModal();
    
    // Add smooth scrolling for all links
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
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// Initialize scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Initial check for elements in viewport
    checkElementsInViewport(animatedElements);
    
    // Check on scroll
    window.addEventListener('scroll', function() {
        checkElementsInViewport(animatedElements);
    });
}

// Check if elements are in viewport and animate them
function checkElementsInViewport(elements) {
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            // Add delay if specified
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

// Initialize favorites modal functionality
function initFavoritesModal() {
    const favoritesBtn = document.getElementById('favoritesBtn');
    const favoritesList = document.getElementById('favoritesList');
    
    if (favoritesBtn && favoritesList) {
        // Initialize Bootstrap modal
        const favoritesModal = new bootstrap.Modal(document.getElementById('favoritesModal'));
        
        // Add event listener to favorites button
        favoritesBtn.addEventListener('click', function() {
            updateFavoritesList();
            favoritesModal.show();
        });
    }
}

// Update favorites list in modal
function updateFavoritesList() {
    const favoritesList = document.getElementById('favoritesList');
    
    if (favoritesList) {
        // Get favorites from localStorage
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        // Clear current list
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
        
        // Add each favorite destination
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
            
            // Trigger animation after a small delay
            setTimeout(() => {
                col.style.opacity = '1';
                col.style.transform = 'translateY(0)';
            }, 10);
        });
    }
} 