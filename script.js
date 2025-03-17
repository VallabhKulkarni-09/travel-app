document.addEventListener('DOMContentLoaded', function() {
    const popularDestinations = [
        { 
            name: 'Paris, France',
            image: 'images/paris.jpg',
            price: 1500,
            continent: 'europe',
            popularity: 95,
            weather: { temp: 18, condition: 'Partly Cloudy' }
        },
        { 
            name: 'Tokyo, Japan',
            image: 'images/tokyo.jpg',
            price: 2000,
            continent: 'asia',
            popularity: 90,
            weather: { temp: 22, condition: 'Clear' }
        },
        { 
            name: 'New York, USA',
            image: 'images/newyork.jpg',
            price: 1800,
            continent: 'namerica',
            popularity: 88,
            weather: { temp: 15, condition: 'Sunny' }
        },
        { 
            name: 'Venice, Italy',
            image: 'images/venice.jpg',
            price: 1600,
            continent: 'europe',
            popularity: 85,
            weather: { temp: 20, condition: 'Clear' }
        },
        { 
            name: 'Barcelona, Spain',
            image: 'images/barcelona.jpg',
            price: 1400,
            continent: 'europe',
            popularity: 87,
            weather: { temp: 23, condition: 'Sunny' }
        },
        { 
            name: 'Dubai, UAE',
            image: 'images/dubai.jpg',
            price: 2200,
            continent: 'asia',
            popularity: 92,
            weather: { temp: 35, condition: 'Sunny' }
        }
    ];

    // DOM Elements
    const destinationsList = document.getElementById('destinationsList');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const destination = document.getElementById('destination');
    const travelers = document.getElementById('travelers');
    const budget = document.getElementById('budget');
    const perPersonBudget = document.getElementById('perPersonBudget');
    const tripDuration = document.getElementById('tripDuration');
    const searchDestination = document.getElementById('searchDestination');
    const sortBy = document.getElementById('sortBy');
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const filterBtn = document.getElementById('filterBtn');
    const favoritesBtn = document.getElementById('favoritesBtn');
    const favoritesList = document.getElementById('favoritesList');
    const startPlanningBtn = document.querySelector('.btn-lg');
    const aboutLink = document.querySelector('a[href="#"].nav-link:not(.active)');
    const searchSuggestions = document.getElementById('searchSuggestions');

    // Initialize Bootstrap modals
    const filterModal = new bootstrap.Modal(document.getElementById('filterModal'));
    const favoritesModal = new bootstrap.Modal(document.getElementById('favoritesModal'));

    // State
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let filteredDestinations = [...popularDestinations];
    let currentView = 'grid';
    let currentDestination = null;

    // Functions
    function updateDestinationsList() {
        destinationsList.innerHTML = '';
        destinationsList.classList.add('loading');
        
        setTimeout(() => {
            destinationsList.classList.remove('loading');
            
            filteredDestinations.forEach((dest, index) => {
                const col = document.createElement('div');
                col.className = currentView === 'grid' ? 'col-md-4 mb-4' : 'col-12 mb-4';
                col.style.opacity = '0';
                col.style.transform = 'translateY(20px)';
                col.style.transition = 'all 0.3s ease';
                col.style.transitionDelay = `${index * 0.05}s`;
                
                col.innerHTML = `
                    <div class="card destination-card h-100">
                        <div class="position-relative">
                            <img src="${dest.image}" class="card-img-top" alt="${dest.name}">
                            <button class="favorite-btn ${favorites.includes(dest.name) ? 'active' : ''}" 
                                    data-destination="${dest.name}">
                                <i class="bi ${favorites.includes(dest.name) ? 'bi-heart-fill' : 'bi-heart'}"></i>
                            </button>
                            ${dest.popularity >= 90 ? `
                                <div class="popular-badge">
                                    <i class="bi bi-star-fill"></i> Popular
                                </div>
                            ` : ''}
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${dest.name}</h5>
                            <div class="card-text">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span><i class="bi bi-tag"></i> From $${dest.price}</span>
                                    <span class="badge bg-${getWeatherBadgeColor(dest.weather.temp)}">
                                        <i class="bi bi-thermometer-half"></i> ${dest.weather.temp}°C
                                    </span>
                                </div>
                                <div class="weather-condition mb-2">
                                    <i class="bi bi-cloud"></i> ${dest.weather.condition}
                                </div>
                                <div class="popularity-bar">
                                    <div class="progress" style="height: 5px;">
                                        <div class="progress-bar bg-warning" 
                                             role="progressbar" 
                                             style="width: ${dest.popularity}%">
                                        </div>
                                    </div>
                                    <small class="text-muted">
                                        Popularity: ${dest.popularity}%
                                    </small>
                                </div>
                            </div>
                            <div class="mt-3 d-flex justify-content-between align-items-center">
                                <button class="btn btn-outline-primary btn-sm view-details-btn">
                                    <i class="bi bi-info-circle"></i> Details
                                </button>
                                <button class="btn btn-success btn-sm quick-book-btn">
                                    <i class="bi bi-calendar-check"></i> Quick Book
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                destinationsList.appendChild(col);
                
                setTimeout(() => {
                    col.style.opacity = '1';
                    col.style.transform = 'translateY(0)';
                }, 10);
            });

            // Add event listeners to buttons
            addDestinationCardEventListeners();
        }, 300);
    }

    function toggleFavorite(destName) {
        const index = favorites.indexOf(destName);
        const btn = document.querySelector(`.favorite-btn[data-destination="${destName}"]`);
        const icon = btn.querySelector('i');
        
        if (index === -1) {
            favorites.push(destName);
            
            // Add heart animation
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill');
            btn.classList.add('active');
            
            // Add pulse animation
            btn.style.animation = 'pulse 0.5s';
            setTimeout(() => {
                btn.style.animation = '';
            }, 500);
        } else {
            favorites.splice(index, 1);
            
            // Remove heart animation
            icon.classList.remove('bi-heart-fill');
            icon.classList.add('bi-heart');
            btn.classList.remove('active');
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateDestinationsList();
        updateFavoritesList();
    }

    function updateFavoritesList() {
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
            const dest = popularDestinations.find(d => d.name === favName);
            if (dest) {
                const col = document.createElement('div');
                col.className = 'col-md-6 mb-4';
                col.style.opacity = '0';
                col.style.transform = 'translateY(20px)';
                col.style.transition = 'all 0.3s ease';
                col.style.transitionDelay = `${index * 0.05}s`;
                
                col.innerHTML = `
                    <div class="card">
                        <img src="${dest.image}" class="card-img-top" alt="${dest.name}" style="height: 150px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${dest.name}</h5>
                            <p class="card-text">
                                <i class="bi bi-tag"></i> From $${dest.price}
                            </p>
                            <button class="btn btn-danger btn-sm remove-favorite-btn" data-destination="${dest.name}">
                                <i class="bi bi-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                `;
                favoritesList.appendChild(col);
                
                // Trigger animation after a small delay
                setTimeout(() => {
                    col.style.opacity = '1';
                    col.style.transform = 'translateY(0)';
                }, 10);
            }
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const destName = btn.dataset.destination;
                const col = btn.closest('.col-md-6');
                
                // Animate removal
                col.style.opacity = '0';
                col.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    toggleFavorite(destName);
                }, 300);
            });
        });
    }

    function calculateTripDuration() {
        if (startDate.value && endDate.value) {
            const start = new Date(startDate.value);
            const end = new Date(endDate.value);
            const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            
            // Animate the duration change
            tripDuration.style.transition = 'all 0.3s ease';
            tripDuration.style.transform = 'scale(1.1)';
            tripDuration.style.color = '#3498db';
            
            tripDuration.textContent = `${duration} days`;
            
            setTimeout(() => {
                tripDuration.style.transform = 'scale(1)';
                tripDuration.style.color = '';
            }, 300);
        }
    }

    function updateBudgetPerPerson() {
        if (budget.value && travelers.value) {
            const perPerson = Math.round(budget.value / travelers.value);
            
            // Animate the budget change
            perPersonBudget.style.transition = 'all 0.3s ease';
            perPersonBudget.style.transform = 'scale(1.1)';
            perPersonBudget.style.color = '#3498db';
            
            perPersonBudget.textContent = `$${perPerson}`;
            
            setTimeout(() => {
                perPersonBudget.style.transform = 'scale(1)';
                perPersonBudget.style.color = '';
            }, 300);
        }
    }

    function filterDestinations() {
        const searchTerm = searchDestination.value.toLowerCase();
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        const continent = document.getElementById('continentFilter').value;
        
        // Add loading state
        destinationsList.classList.add('loading');
        
        // Simulate filtering delay for better UX
        setTimeout(() => {
            filteredDestinations = popularDestinations.filter(dest => {
                const matchesSearch = dest.name.toLowerCase().includes(searchTerm);
                const matchesPrice = (!minPrice || dest.price >= minPrice) && 
                                   (!maxPrice || dest.price <= maxPrice);
                const matchesContinent = !continent || dest.continent === continent;
                return matchesSearch && matchesPrice && matchesContinent;
            });

            if (sortBy.value) {
                sortDestinations(sortBy.value);
            } else {
                updateDestinationsList();
            }
            
            // Show filter results count with animation
            const resultsCount = document.createElement('div');
            resultsCount.className = 'alert alert-info mt-3';
            resultsCount.innerHTML = `<i class="bi bi-info-circle"></i> Found ${filteredDestinations.length} destinations matching your criteria.`;
            resultsCount.style.opacity = '0';
            resultsCount.style.transform = 'translateY(10px)';
            resultsCount.style.transition = 'all 0.3s ease';
            
            const existingAlert = document.querySelector('.alert-info');
            if (existingAlert) {
                existingAlert.remove();
            }
            
            destinationsList.parentNode.insertBefore(resultsCount, destinationsList);
            
            setTimeout(() => {
                resultsCount.style.opacity = '1';
                resultsCount.style.transform = 'translateY(0)';
                
                // Auto-hide after 5 seconds
                setTimeout(() => {
                    resultsCount.style.opacity = '0';
                    resultsCount.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        resultsCount.remove();
                    }, 300);
                }, 5000);
            }, 10);
        }, 400);
    }

    function sortDestinations(criteria) {
        switch (criteria) {
            case 'name':
                filteredDestinations.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price':
                filteredDestinations.sort((a, b) => a.price - b.price);
                break;
            case 'popularity':
                filteredDestinations.sort((a, b) => b.popularity - a.popularity);
                break;
        }
        updateDestinationsList();
    }

    function showDestinationDetails(destName) {
        const dest = popularDestinations.find(d => d.name === destName);
        if (!dest) return;

        const detailsHTML = `
            <div class="modal fade" id="destinationDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${dest.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <img src="${dest.image}" class="img-fluid rounded" alt="${dest.name}">
                                </div>
                                <div class="col-md-6">
                                    <h6 class="mb-3">Destination Overview</h6>
                                    <p><i class="bi bi-geo-alt"></i> ${dest.name}</p>
                                    <p><i class="bi bi-tag"></i> Starting from $${dest.price}</p>
                                    <p><i class="bi bi-thermometer-half"></i> Current Weather: ${dest.weather.temp}°C, ${dest.weather.condition}</p>
                                    <p><i class="bi bi-star-fill text-warning"></i> Popularity Score: ${dest.popularity}%</p>
                                    <div class="mt-4">
                                        <h6>Recommended Duration</h6>
                                        <p>5-7 days</p>
                                        <h6>Best Time to Visit</h6>
                                        <p>Spring (March to May)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="quickBook('${dest.name}')">Book Now</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('destinationDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', detailsHTML);
        const detailsModal = new bootstrap.Modal(document.getElementById('destinationDetailsModal'));
        detailsModal.show();
    }

    function quickBook(destName) {
        const dest = popularDestinations.find(d => d.name === destName);
        if (!dest) return;

        // Set the destination
        destination.value = dest.name;
        currentDestination = dest;

        // Set default dates if not set
        if (!startDate.value) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            startDate.value = tomorrow.toISOString().split('T')[0];
        }
        if (!endDate.value) {
            const nextWeek = new Date(startDate.value);
            nextWeek.setDate(nextWeek.getDate() + 7);
            endDate.value = nextWeek.toISOString().split('T')[0];
        }

        // Set default number of travelers if not set
        if (!travelers.value) {
            travelers.value = 2;
        }

        // Set suggested budget if not set
        if (!budget.value) {
            budget.value = dest.price * travelers.value;
        }

        // Update calculations
        calculateTripDuration();
        updateBudgetPerPerson();
        updateWeatherInfo(dest);

        // Scroll to booking section
        document.querySelector('.container.my-5').scrollIntoView({ behavior: 'smooth' });
    }

    function updateWeatherInfo(dest) {
        if (dest) {
            document.getElementById('weatherInfo').innerHTML = `
                <div class="weather-info">
                    <i class="bi bi-thermometer-half"></i>
                    ${dest.weather.temp}°C, ${dest.weather.condition}
                </div>
            `;
        }
    }

    // Event Listeners
    startDate.addEventListener('change', calculateTripDuration);
    endDate.addEventListener('change', calculateTripDuration);
    travelers.addEventListener('input', updateBudgetPerPerson);
    budget.addEventListener('input', updateBudgetPerPerson);
    searchDestination.addEventListener('input', filterDestinations);
    sortBy.addEventListener('change', function() {
        if (this.value) {
            sortDestinations(this.value);
        }
    });
    filterBtn.addEventListener('click', function() {
        filterModal.show();
    });
    favoritesBtn.addEventListener('click', function() {
        updateFavoritesList();
        favoritesModal.show();
    });
    document.getElementById('applyFilters').addEventListener('click', function() {
        filterDestinations();
        filterModal.hide();
    });

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

    // Add smooth transitions for view toggle
    gridViewBtn.addEventListener('click', function() {
        if (currentView !== 'grid') {
            currentView = 'grid';
            listViewBtn.classList.remove('active');
            gridViewBtn.classList.add('active');
            
            // Add transition class to container
            destinationsList.style.transition = 'opacity 0.3s ease';
            destinationsList.style.opacity = '0';
            
            setTimeout(() => {
                updateDestinationsList();
                setTimeout(() => {
                    destinationsList.style.opacity = '1';
                }, 50);
            }, 300);
        }
    });
    
    listViewBtn.addEventListener('click', function() {
        if (currentView !== 'list') {
            currentView = 'list';
            gridViewBtn.classList.remove('active');
            listViewBtn.classList.add('active');
            
            // Add transition class to container
            destinationsList.style.transition = 'opacity 0.3s ease';
            destinationsList.style.opacity = '0';
            
            setTimeout(() => {
                updateDestinationsList();
                setTimeout(() => {
                    destinationsList.style.opacity = '1';
                }, 50);
            }, 300);
        }
    });
    
    // Add smooth reveal animations on page load
    function initPageAnimations() {
        const heroElements = document.querySelectorAll('.hero-section > .container > .row > div');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s ease';
            el.style.transitionDelay = `${index * 0.2}s`;
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        });
        
        const cards = document.querySelectorAll('.card:not(.destination-card)');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.5s ease';
            card.style.transitionDelay = `${0.5 + (index * 0.1)}s`;
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        });
    }
    
    // Initialize page animations
    initPageAnimations();

    // Initialize the app
    const today = new Date();
    startDate.min = today.toISOString().split('T')[0];
    endDate.min = today.toISOString().split('T')[0];
    updateDestinationsList();

    // Add input animations
    const formInputs = document.querySelectorAll('.form-control, .form-select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Add button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'translateY(0)';
        });
    });

    // Add event listener for Start Planning button
    startPlanningBtn.addEventListener('click', function() {
        // Smooth scroll to the trip planning section
        document.querySelector('.container.my-5').scrollIntoView({ behavior: 'smooth' });
        
        // Add animation to highlight the planning section
        const planningCards = document.querySelectorAll('.container.my-5 .card');
        planningCards.forEach((card, index) => {
            card.style.transition = 'all 0.5s ease';
            card.style.transform = 'scale(0.95)';
            card.style.boxShadow = '0 0 15px rgba(0,0,0,0.1)';
            
            setTimeout(() => {
                card.style.transform = 'scale(1)';
                card.style.boxShadow = '0 0 20px rgba(52, 152, 219, 0.3)';
            }, index * 200);
            
            setTimeout(() => {
                card.style.boxShadow = '0 0 15px rgba(0,0,0,0.1)';
            }, 2000 + (index * 200));
        });

        // Generate trip plan
        generateTripPlan();
    });

    // Function to generate trip plan
    function generateTripPlan() {
        const tripPlanContainer = document.createElement('div');
        tripPlanContainer.className = 'trip-plan mt-5';
        const destinationName = destination.value;
        const destinationDetails = popularDestinations.find(d => d.name === destinationName);

        if (!destinationDetails) {
            tripPlanContainer.innerHTML = `
                <h3>Your Trip Plan</h3>
                <div class="alert alert-danger">Destination not found. Please select a valid destination.</div>
            `;
        } else {
            tripPlanContainer.innerHTML = `
                <h3>Your Trip Plan</h3>
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Destination: ${destinationName}</h5>
                        <p class="card-text">Start Date: ${startDate.value}</p>
                        <p class="card-text">End Date: ${endDate.value}</p>
                        <p class="card-text">Duration: ${tripDuration.textContent}</p>
                        <p class="card-text">Number of Travelers: ${travelers.value}</p>
                        <p class="card-text">Total Budget: $${budget.value}</p>
                        <p class="card-text">Per Person Budget: ${perPersonBudget.textContent}</p>
                        <div id="weatherInfoPlan">${document.getElementById('weatherInfo').innerHTML}</div>
                        ${suggestPlacesToExplore(destinationName)}
                    </div>
                </div>
            `;
        }

        // Append trip plan to the container
        document.querySelector('.container.my-5').appendChild(tripPlanContainer);
    }

    // Enhanced search functionality
    function enhancedSearch() {
        const searchTerm = searchDestination.value.toLowerCase();
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        const continent = document.getElementById('continentFilter').value;
        
        // Add loading state with spinner
        destinationsList.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Searching for destinations...</p>
            </div>
        `;
        
        // Simulate search delay for better UX
        setTimeout(() => {
            // Advanced filtering logic
            filteredDestinations = popularDestinations.filter(dest => {
                const matchesSearch = dest.name.toLowerCase().includes(searchTerm) ||
                                    dest.continent.toLowerCase().includes(searchTerm);
                const matchesPrice = (!minPrice || dest.price >= minPrice) && 
                                   (!maxPrice || dest.price <= maxPrice);
                const matchesContinent = !continent || dest.continent === continent;
                
                // Calculate relevance score
                let relevanceScore = 0;
                if (dest.name.toLowerCase().includes(searchTerm)) relevanceScore += 3;
                if (dest.continent.toLowerCase().includes(searchTerm)) relevanceScore += 1;
                if (dest.popularity > 90) relevanceScore += 2;
                dest.relevanceScore = relevanceScore;
                
                return matchesSearch && matchesPrice && matchesContinent;
            });

            // Sort by relevance score if there's a search term
            if (searchTerm) {
                filteredDestinations.sort((a, b) => b.relevanceScore - a.relevanceScore);
            } else if (sortBy.value) {
                sortDestinations(sortBy.value);
            }

            // Update the UI with search results
            updateDestinationsList();
            
            // Show search results summary
            const resultsCount = document.createElement('div');
            resultsCount.className = 'alert alert-info mt-3';
            resultsCount.innerHTML = `
                <i class="bi bi-info-circle"></i> 
                Found ${filteredDestinations.length} destinations matching your criteria.
                ${searchTerm ? `<br><small>Sorted by relevance to "${searchTerm}"</small>` : ''}
            `;
            resultsCount.style.opacity = '0';
            resultsCount.style.transform = 'translateY(10px)';
            resultsCount.style.transition = 'all 0.3s ease';
            
            const existingAlert = document.querySelector('.alert-info');
            if (existingAlert) {
                existingAlert.remove();
            }
            
            destinationsList.parentNode.insertBefore(resultsCount, destinationsList);
            
            setTimeout(() => {
                resultsCount.style.opacity = '1';
                resultsCount.style.transform = 'translateY(0)';
                
                // Auto-hide after 5 seconds
                setTimeout(() => {
                    resultsCount.style.opacity = '0';
                    resultsCount.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        resultsCount.remove();
                    }, 300);
                }, 5000);
            }, 10);
        }, 600);
    }

    // Replace the old filterDestinations function with the enhanced search
    searchDestination.removeEventListener('input', filterDestinations);
    searchDestination.addEventListener('input', debounce(enhancedSearch, 500));
    document.getElementById('applyFilters').removeEventListener('click', filterDestinations);
    document.getElementById('applyFilters').addEventListener('click', function() {
        enhancedSearch();
        filterModal.hide();
    });

    // Debounce function to prevent too many search requests
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Helper function to determine weather badge color
    function getWeatherBadgeColor(temp) {
        if (temp < 10) return 'info';
        if (temp < 20) return 'success';
        if (temp < 30) return 'warning';
        return 'danger';
    }

    // Add event listeners for destination cards
    function addDestinationCardEventListeners() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const destName = btn.dataset.destination;
                toggleFavorite(destName);
            });
        });

        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = e.target.closest('.destination-card');
                const destName = card.querySelector('.card-title').textContent;
                showDestinationDetails(destName);
            });
        });

        document.querySelectorAll('.quick-book-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = e.target.closest('.destination-card');
                const destName = card.querySelector('.card-title').textContent;
                quickBook(destName);
            });
        });
    }

    function showSearchSuggestions() {
        const searchTerm = searchDestination.value.toLowerCase();
        searchSuggestions.innerHTML = '';
        if (searchTerm) {
            const suggestions = popularDestinations.filter(dest => dest.name.toLowerCase().includes(searchTerm));
            suggestions.forEach(dest => {
                const suggestionItem = document.createElement('a');
                suggestionItem.className = 'list-group-item list-group-item-action';
                suggestionItem.textContent = dest.name;
                suggestionItem.addEventListener('click', () => {
                    searchDestination.value = dest.name;
                    searchSuggestions.innerHTML = '';
                    filterDestinations();
                });
                searchSuggestions.appendChild(suggestionItem);
            });
        }
    }

    searchDestination.addEventListener('input', showSearchSuggestions);
    document.addEventListener('click', (e) => {
        if (!searchSuggestions.contains(e.target) && e.target !== searchDestination) {
            searchSuggestions.innerHTML = '';
        }
    });
});