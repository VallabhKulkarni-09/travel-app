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
        filteredDestinations.forEach(dest => {
            const col = document.createElement('div');
            col.className = currentView === 'grid' ? 'col-md-4 mb-4' : 'col-12 mb-4';
            col.innerHTML = `
                <div class="card destination-card">
                    <img src="${dest.image}" class="card-img-top" alt="${dest.name}">
                    <button class="favorite-btn ${favorites.includes(dest.name) ? 'active' : ''}" 
                            data-destination="${dest.name}">
                        <i class="bi ${favorites.includes(dest.name) ? 'bi-heart-fill' : 'bi-heart'}"></i>
                    </button>
                    <div class="card-body">
                        <h5 class="card-title">${dest.name}</h5>
                        <p class="card-text">
                            <i class="bi bi-tag"></i> From $${dest.price}
                            <br>
                            <i class="bi bi-thermometer-half"></i> ${dest.weather.temp}°C, ${dest.weather.condition}
                            <br>
                            <small class="text-muted">
                                <i class="bi bi-star-fill text-warning"></i> 
                                Popularity: ${dest.popularity}%
                            </small>
                        </p>
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-outline-primary btn-sm view-details-btn">
                                <i class="bi bi-info-circle"></i> View Details
                            </button>
                            <button class="btn btn-success btn-sm quick-book-btn">
                                <i class="bi bi-calendar-check"></i> Quick Book
                            </button>
                        </div>
                    </div>
                </div>
            `;
            destinationsList.appendChild(col);
        });

        // Add event listeners to buttons
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

    function toggleFavorite(destName) {
        const index = favorites.indexOf(destName);
        if (index === -1) {
            favorites.push(destName);
        } else {
            favorites.splice(index, 1);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateDestinationsList();
        updateFavoritesList();
    }

    function updateFavoritesList() {
        favoritesList.innerHTML = '';
        favorites.forEach(favName => {
            const dest = popularDestinations.find(d => d.name === favName);
            if (dest) {
                const col = document.createElement('div');
                col.className = 'col-md-6 mb-4';
                col.innerHTML = `
                    <div class="card">
                        <img src="${dest.image}" class="card-img-top" alt="${dest.name}" style="height: 150px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${dest.name}</h5>
                            <button class="btn btn-danger btn-sm" onclick="removeFavorite('${dest.name}')">
                                <i class="bi bi-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                `;
                favoritesList.appendChild(col);
            }
        });
    }

    function calculateTripDuration() {
        if (startDate.value && endDate.value) {
            const start = new Date(startDate.value);
            const end = new Date(endDate.value);
            const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            tripDuration.textContent = `${duration} days`;
        }
    }

    function updateBudgetPerPerson() {
        if (budget.value && travelers.value) {
            const perPerson = Math.round(budget.value / travelers.value);
            perPersonBudget.textContent = `$${perPerson}`;
        }
    }

    function filterDestinations() {
        const searchTerm = searchDestination.value.toLowerCase();
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        const continent = document.getElementById('continentFilter').value;

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
    startDate.addEventListener('change', function() {
        endDate.min = this.value;
        if (endDate.value && endDate.value < this.value) {
            endDate.value = this.value;
        }
        calculateTripDuration();
    });

    endDate.addEventListener('change', calculateTripDuration);
    budget.addEventListener('input', updateBudgetPerPerson);
    travelers.addEventListener('input', updateBudgetPerPerson);
    searchDestination.addEventListener('input', filterDestinations);
    sortBy.addEventListener('change', () => sortDestinations(sortBy.value));

    gridViewBtn.addEventListener('click', () => {
        currentView = 'grid';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        destinationsList.classList.remove('list-view');
        updateDestinationsList();
    });

    listViewBtn.addEventListener('click', () => {
        currentView = 'list';
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        destinationsList.classList.add('list-view');
        updateDestinationsList();
    });

    filterBtn.addEventListener('click', () => filterModal.show());
    favoritesBtn.addEventListener('click', () => {
        updateFavoritesList();
        favoritesModal.show();
    });

    document.getElementById('applyFilters').addEventListener('click', () => {
        filterDestinations();
        filterModal.hide();
    });

    startPlanningBtn.addEventListener('click', () => {
        document.querySelector('.container.my-5').scrollIntoView({ behavior: 'smooth' });
    });

    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        const aboutHTML = `
            <div class="modal fade" id="aboutModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">About TripPlanner</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <h6>Welcome to TripPlanner</h6>
                            <p>Your one-stop destination for planning unforgettable journeys. We help you discover amazing places, plan your trips, and create lasting memories.</p>
                            <h6>Features</h6>
                            <ul>
                                <li>Discover popular destinations worldwide</li>
                                <li>Real-time weather information</li>
                                <li>Budget planning tools</li>
                                <li>Trip duration calculator</li>
                                <li>Favorite destinations list</li>
                            </ul>
                            <h6>Contact Us</h6>
                            <p>Email: info@tripplanner.com<br>Phone: +1 (555) 123-4567</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('aboutModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', aboutHTML);
        const aboutModal = new bootstrap.Modal(document.getElementById('aboutModal'));
        aboutModal.show();
    });

    // Initialize
    const today = new Date();
    startDate.min = today.toISOString().split('T')[0];
    endDate.min = today.toISOString().split('T')[0];
    updateDestinationsList();

    // Make removeFavorite function available globally
    window.removeFavorite = function(destName) {
        toggleFavorite(destName);
        updateFavoritesList();
    };
}); 