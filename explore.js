const exploreData = {
    'Paris, France': {
        attractions: [
            'Eiffel Tower',
            'Louvre Museum',
            'Notre-Dame Cathedral'
        ],
        cuisine: [
            'Croissants',
            'Baguettes',
            'Escargot'
        ],
        activities: [
            'Seine River Cruise',
            'Wine Tasting',
            'Walking Tours'
        ]
    },
    'Tokyo, Japan': {
        attractions: [
            'Tokyo Tower',
            'Senso-ji Temple',
            'Shibuya Crossing'
        ],
        cuisine: [
            'Sushi',
            'Ramen',
            'Tempura'
        ],
        activities: [
            'Cherry Blossom Viewing',
            'Shopping in Ginza',
            'Visit Akihabara'
        ]
    },
    'New York, USA': {
        attractions: [
            'Statue of Liberty',
            'Central Park',
            'Times Square'
        ],
        cuisine: [
            'New York Pizza',
            'Bagels',
            'Cheesecake'
        ],
        activities: [
            'Broadway Shows',
            'Museum Visits',
            'Walking Tours'
        ]
    },
    'Venice, Italy': {
        attractions: [
            'St. Mark\'s Basilica',
            'Rialto Bridge',
            'Doge\'s Palace'
        ],
        cuisine: [
            'Risotto',
            'Gelato',
            'Cicchetti'
        ],
        activities: [
            'Gondola Rides',
            'Exploring Canals',
            'Visiting Murano'
        ]
    },
    'Barcelona, Spain': {
        attractions: [
            'Sagrada Familia',
            'Park Güell',
            'La Rambla'
        ],
        cuisine: [
            'Tapas',
            'Paella',
            'Churros'
        ],
        activities: [
            'Beach Visits',
            'Architectural Tours',
            'Flamenco Shows'
        ]
    },
    'Dubai, UAE': {
        attractions: [
            'Burj Khalifa',
            'Dubai Mall',
            'Palm Jumeirah'
        ],
        cuisine: [
            'Shawarma',
            'Hummus',
            'Falafel'
        ],
        activities: [
            'Desert Safari',
            'Dhow Cruise',
            'Shopping in Souks'
        ]
    }
};

function suggestPlacesToExplore(city) {
    const data = exploreData[city];
    if (!data) return '';
    return `
        <h5 class="mt-4">Places to Explore</h5>
        <ul>
            <li>Popular attractions in ${city}</li>
            ${data.attractions.map(attraction => `<li>${attraction}</li>`).join('')}
            <li>Local cuisine to try in ${city}</li>
            ${data.cuisine.map(food => `<li>${food}</li>`).join('')}
            <li>Recommended activities in ${city}</li>
            ${data.activities.map(activity => `<li>${activity}</li>`).join('')}
        </ul>
    `;
}