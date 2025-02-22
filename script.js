document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    // Add hamburger button to navbar
    const hamburger = document.createElement('button');
    hamburger.classList.add('hamburger');
    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    navbar.appendChild(hamburger);

    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Destinations data
    const destinations = [
        {
            image: 'assets/egypt.jpeg',
            name: 'Egypt',
            description: 'Explore the ancient pyramids and rich cultural heritage',
            features: ['Visa Processing', 'Tour Packages', 'Hotel Booking']
        },
        {
            image: 'assets/morocco.jpeg',
            name: 'Morocco',
            description: 'Experience the magic of ancient medinas and desert landscapes',
            features: ['Visa Processing', 'Tour Packages', 'Hotel Booking']
        },
        {
            image: 'assets/uzbek.jpeg',
            name: 'Uzbekistan',
            description: "Discover the beauty of Central Asia's historic Silk Road",
            features: ['Visa Processing', 'Tour Packages', 'Hotel Booking']
        },
        {
            image: 'assets/qatar.jpeg',
            name: 'Qatar',
            description: 'Experience luxury and modernity in the heart of Arabia',
            features: ['Visa Processing', 'Tour Packages', 'Hotel Booking']
        },
        {
            image: 'assets/joradan.jpeg',
            name: 'Jordan',
            description: 'Explore diverse cultures and tropical paradises',
            features: ['Visa Processing', 'Tour Packages', 'Hotel Booking']
        }
    ];

    // Function to create destination card
    function createDestinationCard(destination) {
        return `
            <div class="destination-card">
                <div class="destination-img">
                    <img src="${destination.image}" alt="${destination.name}">
                </div>
                <div class="destination-content">
                    <h3>${destination.name}</h3>
                    <p>${destination.description}</p>
                    <ul class="destination-features">
                        ${destination.features.map(feature => `
                            <li><i class="fas fa-check"></i> ${feature}</li>
                        `).join('')}
                    </ul>
                    <a href="#contact" class="destination-cta">Enquire Now</a>
                </div>
            </div>
        `;
    }

    // Generate all destination cards
    const destinationsGrid = document.querySelector('.destinations-grid');
    destinationsGrid.innerHTML = destinations.map(destination => 
        createDestinationCard(destination)
    ).join('');

    // View More functionality
    const viewMoreBtn = document.querySelector('.view-more-btn');
    
    viewMoreBtn.addEventListener('click', () => {
        destinationsGrid.classList.toggle('show-all');
        viewMoreBtn.textContent = destinationsGrid.classList.contains('show-all') 
            ? 'Show Less' 
            : 'View More Destinations';
    });

    // Offers data
    const offers = [
        {
            image: 'assets/offers/umra.jpeg',
            title: 'Umrah Package',
            duration: '5 Days / 4 Nights',
            price: 'Starting from $999',
            alt: 'Special Umrah Package'
        },
        {
            image: 'assets/offers/saudi.jpeg',
            title: 'Saudi Arabia Tour',
            duration: '7 Days / 6 Nights',
            price: 'Starting from $1299',
            alt: 'Saudi Arabia Special'
        },
        {
            image: 'assets/offers/uae.jpeg',
            title: 'Dubai Weekend',
            duration: '3 Days / 2 Nights',
            price: 'Starting from $499',
            alt: 'Dubai Weekend Special'
        }
    ];

    // Function to create offer card
    function createOfferCard(offer) {
        return `
            <div class="offer-card">
                <img src="${offer.image}" alt="${offer.alt}">
                <div class="offer-overlay">
                    <h3>${offer.title}</h3>
                    <p>${offer.duration}</p>
                    <p class="price">${offer.price}</p>
                    <a href="https://wa.me/+966550589472" class="offer-cta" target="_blank">
                        <i class="fab fa-whatsapp"></i> Enquire Now
                    </a>
                </div>
            </div>
        `;
    }

    // Generate all offer cards
    const offersGrid = document.querySelector('.offers-grid');
    offersGrid.innerHTML = offers.map(offer => 
        createOfferCard(offer)
    ).join('');
}); 