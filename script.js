// Bilandi's Cafe QR Menu - JavaScript
// Mobile-first, premium, lag-free implementation

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initApp();
});

/**
 * Initialize the application
 */
function initApp() {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        loadingScreen.classList.add('hidden');
        
        // Start animations and setup
        setupHeaderScroll();
        setupCategoryNavigation();
        populateMenuItems();
        setupRecommendations();
        setupScrollAnimations();
        setupScrollToTop();
        
        // Initial image lazy loading
        lazyLoadImages();
    }, 800);
    
    // Fade in the page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 300);
}

/**
 * Setup sticky header with hide/show on scroll
 */
function setupHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show/hide header based on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
}

/**
 * Setup category navigation with smooth scrolling
 */
function setupCategoryNavigation() {
    const categories = document.querySelectorAll('.category');
    const menuSections = document.querySelectorAll('.menu-section');
    
    // Set first category as active
    categories[0].classList.add('active');
    
    // Add click event to each category
    categories.forEach(category => {
        category.addEventListener('click', () => {
            const categoryId = category.getAttribute('data-category');
            
            // Update active category
            categories.forEach(cat => cat.classList.remove('active'));
            category.classList.add('active');
            
            // Show corresponding menu section
            menuSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === categoryId) {
                    section.classList.add('active');
                    
                    // Scroll to section with offset for header
                    setTimeout(() => {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const sectionTop = section.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: sectionTop,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            });
        });
    });
}

/**
 * Menu data - All menu items with categories, prices, and special flags
 */
const menuData = {
    pizza: [
        { name: "Margherita Pizza", price: "₹199", special: false },
        { name: "Onion & Capsicum Pizza", price: "₹229", special: false },
        { name: "Onion & Corn Pizza", price: "₹239", special: false },
        { name: "Classic Veg Pizza", price: "₹249", special: false },
        { name: "Paneer Pizza", price: "₹269", special: false },
        { name: "Mushroom Pizza", price: "₹259", special: false },
        { name: "Farm Fresh Pizza", price: "₹279", special: false },
        { name: "Cheese Burst Pizza", price: "₹299", special: false },
        { name: "Tandoori Paneer Pizza", price: "₹319", special: false },
        { name: "Mexican Pizza", price: "₹299", special: false },
        { name: "Jain Special Pizza", price: "₹289", special: false },
        { name: "Bilandi's Special Pizza", price: "₹349", special: true, desc: "Chef's signature sauce, loaded veggies, extra cheese", image: "special-pizza.jpg" }
    ],
    burgers: [
        { name: "Aloo Tikki Burger", price: "₹99", special: false },
        { name: "Veg Burger", price: "₹119", special: false },
        { name: "Cheese Burger", price: "₹139", special: false },
        { name: "Paneer Burger", price: "₹159", special: false },
        { name: "Double Patty Burger", price: "₹179", special: false },
        { name: "Jain Special Burger", price: "₹149", special: false },
        { name: "Bilandi's Special Burger", price: "₹199", special: true, desc: "Crispy patty, house sauce, cheese, soft bun", image: "special-burger.jpg" }
    ],
    sandwiches: [
        { name: "Veg Grilled Sandwich", price: "₹129", special: false },
        { name: "Cheese Grilled Sandwich", price: "₹149", special: false },
        { name: "Veg Club Sandwich", price: "₹169", special: false },
        { name: "Cheese Club Sandwich", price: "₹189", special: false },
        { name: "Paneer Sandwich", price: "₹179", special: false },
        { name: "Jain Sandwich", price: "₹159", special: false },
        { name: "Bilandi's Special Sandwich", price: "₹219", special: true, desc: "Grilled, cheese-loaded, house seasoning" }
    ],
    wraps: [
        { name: "Veg Wrap", price: "₹139", special: false },
        { name: "Paneer Wrap", price: "₹169", special: false },
        { name: "Cheese Corn Wrap", price: "₹159", special: false },
        { name: "Jain Wrap", price: "₹149", special: false },
        { name: "Bilandi's Special Wrap", price: "₹199", special: true, desc: "Paneer, veggies, spicy house sauce" }
    ],
    "pasta-noodles": [
        { name: "Red Sauce Pasta", price: "₹179", special: false },
        { name: "White Sauce Pasta", price: "₹189", special: false },
        { name: "Mix Sauce Pasta", price: "₹199", special: false },
        { name: "Jain Pasta", price: "₹189", special: false },
        { name: "Bilandi's Special Pasta", price: "₹249", special: true, desc: "Creamy mix sauce with extra toppings", image: "special-pasta.jpg" },
        { name: "Veg Noodles", price: "₹169", special: false },
        { name: "Paneer Noodles", price: "₹199", special: false },
        { name: "Jain Noodles", price: "₹179", special: false }
    ],
    "starters-chilli": [
        { name: "Plain Fries", price: "₹99", special: false },
        { name: "Peri Peri Fries", price: "₹129", special: false },
        { name: "Masala Fries", price: "₹119", special: false },
        { name: "Cheese Fries", price: "₹149", special: false },
        { name: "Honey Chilli Potato", price: "₹179", special: false },
        { name: "Chilli Paneer", price: "₹199", special: false }
    ],
    chaat: [
        { name: "Dahi Chaat", price: "₹119", special: false },
        { name: "Dahi Papdi Chaat", price: "₹139", special: false, image: "chaat.jpg" },
        { name: "Dahi Aloo Chaat", price: "₹129", special: false }
    ],
    beverages: [
        { name: "Vanilla Shake", price: "₹149", special: false },
        { name: "Strawberry Shake", price: "₹149", special: false },
        { name: "Chocolate Shake", price: "₹149", special: false },
        { name: "Butterscotch Shake", price: "₹149", special: false },
        { name: "Oreo Shake", price: "₹169", special: false },
        { name: "Cold Coffee Shake", price: "₹159", special: false, image: "coffee.jpg" },
        { name: "Masala Tea", price: "₹59", special: false },
        { name: "Ginger Tea", price: "₹59", special: false },
        { name: "Hot Coffee", price: "₹99", special: false },
        { name: "Cold Coffee", price: "₹129", special: false },
        { name: "Chocolate Coffee", price: "₹139", special: false },
        { name: "Virgin Mojito", price: "₹129", special: false },
        { name: "Blue Lagoon", price: "₹149", special: false },
        { name: "Blue Berry", price: "₹149", special: false },
        { name: "Virgin Mary", price: "₹139", special: false },
        { name: "Fresh Lime Soda", price: "₹89", special: false }
    ],
    pastries: [
        { name: "Chocolate Pastry", price: "₹99", special: false },
        { name: "Black Forest Pastry", price: "₹99", special: false },
        { name: "Pineapple Pastry", price: "₹89", special: false },
        { name: "Butterscotch Pastry", price: "₹99", special: false }
    ],
    combos: [
        { name: "Deal 1", price: "₹249", special: false, desc: "Aloo Tikki Burger + Fries" },
        { name: "Deal 2", price: "₹499", special: false, desc: "Medium Pizza + Fries + Soft Drink" },
        { name: "Deal 3", price: "₹399", special: false, desc: "Pasta + Fries + Soft Drink" },
        { name: "Family Pack", price: "₹899", special: false, desc: "Tandoori Paneer Pizza (Large) + Margherita Pizza (Medium) + Fries + Soft Drinks" }
    ]
};

/**
 * Populate all menu sections with data
 */
function populateMenuItems() {
    // For each category in menuData
    for (const categoryId in menuData) {
        const section = document.getElementById(categoryId);
        if (!section) continue;
        
        const menuItemsContainer = section.querySelector('.menu-items');
        if (!menuItemsContainer) continue;
        
        // Clear existing items
        menuItemsContainer.innerHTML = '';
        
        // Add each menu item
        menuData[categoryId].forEach(item => {
            const menuItem = createMenuItemElement(item);
            menuItemsContainer.appendChild(menuItem);
        });
    }
    
    // Set up lazy loading for images after they're added to DOM
    setTimeout(lazyLoadImages, 100);
}

/**
 * Create a menu item element
 */
function createMenuItemElement(item) {
    const div = document.createElement('div');
    div.className = `menu-item ${item.special ? 'special' : ''}`;
    
    // Build the HTML structure
    let html = `
        <div class="menu-item-header">
            <h3 class="menu-item-name">${item.name}</h3>
            <div class="menu-item-price">${item.price}</div>
        </div>
    `;
    
    // Add description if exists
    if (item.desc) {
        html += `<p class="menu-item-desc">${item.desc}</p>`;
    }
    
    // Add image if exists (for special items)
    if (item.image) {
        // Use a placeholder image with lazy loading
        html += `
            <img 
                data-src="images/${item.image}" 
                alt="${item.name}" 
                class="menu-item-image lazy-image"
                loading="lazy"
                width="400"
                height="200"
            >
        `;
    } else if (item.special) {
        // For special items without specific image, use a category-based image
        const categoryImages = {
            pizza: 'pizza.jpg',
            burgers: 'special-burger.jpg',
            pasta: 'special-pasta.jpg'
        };
        
        // Find the category for this special item
        for (const cat in menuData) {
            if (menuData[cat].includes(item)) {
                if (categoryImages[cat]) {
                    html += `
                        <img 
                            data-src="images/${categoryImages[cat]}" 
                            alt="${item.name}" 
                            class="menu-item-image lazy-image"
                            loading="lazy"
                            width="400"
                            height="200"
                        >
                    `;
                }
                break;
            }
        }
    }
    
    div.innerHTML = html;
    return div;
}

/**
 * Setup recommendations section
 */
function setupRecommendations() {
    const recommendations = [
        { name: "Bilandi's Special Pizza", icon: "fas fa-pizza-slice" },
        { name: "Bilandi's Special Burger", icon: "fas fa-hamburger" },
        { name: "Bilandi's Special Pasta", icon: "fas fa-utensils" },
        { name: "Dahi Papdi Chaat", icon: "fas fa-bowl-food" },
        { name: "Cold Coffee", icon: "fas fa-mug-hot" }
    ];
    
    const container = document.querySelector('.recommendations-grid');
    if (!container) return;
    
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        
        card.innerHTML = `
            <i class="${rec.icon}"></i>
            <h3>${rec.name}</h3>
            <p>Customer favorite, highly recommended</p>
        `;
        
        container.appendChild(card);
    });
}

/**
 * Setup Intersection Observer for scroll animations
 */
function setupScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all menu sections and recommendation cards
    document.querySelectorAll('.menu-section, .recommendation-card').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Setup scroll to top button
 */
function setupScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Lazy load images
 */
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            loadImage(img);
        });
        return;
    }
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Load an image and replace data-src with src
 */
function loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;
    
    // Create a new image to preload
    const tempImg = new Image();
    tempImg.onload = () => {
        // When loaded, set the actual image source
        img.src = src;
        img.classList.add('loaded');
    };
    
    tempImg.onerror = () => {
        // If image fails to load, remove the element
        console.warn(`Failed to load image: ${src}`);
        img.style.display = 'none';
    };
    
    tempImg.src = src;
}

/**
 * Preload critical images
 */
function preloadCriticalImages() {
    const criticalImages = [
        'images/hero-bg.jpg',
        'images/pizza.jpg',
        'images/special-pizza.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Start preloading critical images
preloadCriticalImages();