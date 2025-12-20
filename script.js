// Mobile-First Bilandi's Cafe Menu
// Enhanced for mobile with touch gestures and animations

document.addEventListener('DOMContentLoaded', () => {
    initMobileApp();
});

/**
 * Initialize mobile-optimized application
 */
function initMobileApp() {
    // Show loading animation
    setTimeout(() => {
        const loadingScreen = document.querySelector('.mobile-loading');
        const progressFill = document.querySelector('.progress-fill');
        
        // Animate progress bar
        progressFill.style.width = '100%';
        
        // Hide loading screen after animation
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            
            // Initialize all components
            setupMobileHeader();
            setupMobileCategories();
            populateAllMenuSections();
            setupMobileRecommendations();
            setupMobileFAB();
            setupMobileBackToTop();
            setupTouchGestures();
            setupImageLoading();
            setupToastNotifications();
            setupMobileAnimations();
            
            // Show welcome toast
            showToast('Menu loaded! Tap categories to explore');
            
        }, 1500);
    }, 500);
    
    // Add mobile-specific body class
    document.body.classList.add('mobile-optimized');
}

/**
 * Setup mobile header with hide/show on scroll
 */
function setupMobileHeader() {
    const header = document.querySelector('.mobile-header');
    let lastScrollTop = 0;
    const scrollThreshold = 100;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Mobile-optimized header behavior
                if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
                    header.classList.add('hidden');
                } else if (scrollTop < lastScrollTop || scrollTop <= scrollThreshold) {
                    header.classList.remove('hidden');
                }
                
                lastScrollTop = scrollTop;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Setup mobile-optimized categories with swipe support
 */
function setupMobileCategories() {
    const categories = [
        { id: 'pizza', name: 'Pizza', icon: 'fas fa-pizza-slice' },
        { id: 'burgers', name: 'Burgers', icon: 'fas fa-hamburger' },
        { id: 'sandwiches', name: 'Sandwiches', icon: 'fas fa-bread-slice' },
        { id: 'wraps', name: 'Wraps', icon: 'fas fa-burrito' },
        { id: 'pasta-noodles', name: 'Pasta & Noodles', icon: 'fas fa-utensils' },
        { id: 'starters-chilli', name: 'Starters', icon: 'fas fa-pepper-hot' },
        { id: 'chaat', name: 'Chaat', icon: 'fas fa-bowl-food' },
        { id: 'beverages', name: 'Drinks', icon: 'fas fa-mug-hot' },
        { id: 'pastries', name: 'Pastries', icon: 'fas fa-cookie-bite' },
        { id: 'garlic-bread', name: 'Garlic Bread', icon: 'fas fa-bread-loaf' },
        { id: 'combos', name: 'Combos', icon: 'fas fa-gift' }
    ];
    
    const swiperTrack = document.querySelector('.swiper-track');
    const indicatorDots = document.querySelectorAll('.indicator-dot');
    
    // Create category cards with mobile-optimized touch feedback
    categories.forEach((category, index) => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.dataset.category = category.id;
        card.dataset.index = index;
        
        // Add touch feedback classes
        card.addEventListener('touchstart', () => {
            card.classList.add('touch-active');
        });
        
        card.addEventListener('touchend', () => {
            setTimeout(() => {
                card.classList.remove('touch-active');
            }, 150);
        });
        
        card.innerHTML = `
            <i class="${category.icon}"></i>
            <span>${category.name}</span>
        `;
        
        swiperTrack.appendChild(card);
    });
    
    // Set first category as active
    const firstCard = document.querySelector('.category-card');
    if (firstCard) {
        firstCard.classList.add('active');
        showMenuSection('pizza');
    }
    
    // Add click/tap events with mobile-optimized feedback
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const categoryId = this.dataset.category;
            const index = parseInt(this.dataset.index);
            
            // Update active category with animation
            document.querySelectorAll('.category-card').forEach(c => {
                c.classList.remove('active');
            });
            
            this.classList.add('active');
            
            // Add ripple effect for mobile
            createRippleEffect(this);
            
            // Update swiper indicator
            updateSwiperIndicator(index);
            
            // Show corresponding menu section
            showMenuSection(categoryId);
            
            // Show toast notification
            showToast(`Showing ${this.querySelector('span').textContent}`);
            
            // Scroll category into view on mobile
            if (window.innerWidth < 768) {
                this.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });
    });
    
    // Setup swipe gesture for categories
    setupCategorySwipe(swiperTrack, indicatorDots);
}

/**
 * Create ripple effect for touch feedback
 */
function createRippleEffect(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(212, 175, 55, 0.2);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        width: ${size}px;
        height: ${size}px;
        top: 50%;
        left: 50%;
        margin-top: -${size/2}px;
        margin-left: -${size/2}px;
        pointer-events: none;
        z-index: 0;
    `;
    
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Setup swipe gestures for category carousel
 */
function setupCategorySwipe(swiperTrack, indicatorDots) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    swiperTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        swiperTrack.style.transition = 'none';
    }, { passive: true });
    
    swiperTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        
        // Apply slight resistance
        swiperTrack.style.transform = `translateX(${diff * 0.5}px)`;
    }, { passive: true });
    
    swiperTrack.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        swiperTrack.style.transition = 'transform 0.3s ease';
        swiperTrack.style.transform = 'translateX(0)';
    }, { passive: true });
}

/**
 * Update swiper indicator dots
 */
function updateSwiperIndicator(activeIndex) {
    const dots = document.querySelectorAll('.indicator-dot');
    const dotIndex = Math.floor(activeIndex / 3); // 3 categories per "page"
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === dotIndex);
    });
}

/**
 * Complete mobile-optimized menu data WITH GARLIC BREAD SECTION
 */
const mobileMenuData = {
    pizza: [
        { name: "Margherita Pizza", price: "₹199", special: false, image: "pizza/margherita.jpg", desc: "Classic tomato sauce, mozzarella, fresh basil" },
        { name: "Onion & Capsicum Pizza", price: "₹229", special: false, image: "pizza/onion-capsicum.jpg", desc: "Onions, capsicum, mozzarella, tomato sauce" },
        { name: "Onion & Corn Pizza", price: "₹239", special: false, image: "pizza/onion-corn.jpg", desc: "Sweet corn, onions, mozzarella cheese" },
        { name: "Classic Veg Pizza", price: "₹249", special: false, image: "pizza/classic-veg.jpg", desc: "Assorted vegetables, mozzarella, tomato sauce" },
        { name: "Paneer Pizza", price: "₹269", special: false, image: "pizza/paneer.jpg", desc: "Paneer cubes, onions, capsicum, mozzarella" },
        { name: "Mushroom Pizza", price: "₹259", special: false, image: "pizza/mushroom.jpg", desc: "Fresh mushrooms, mozzarella, herbs" },
        { name: "Farm Fresh Pizza", price: "₹279", special: false, image: "pizza/farm-fresh.jpg", desc: "Seasonal vegetables, olives, mozzarella" },
        { name: "Cheese Burst Pizza", price: "₹299", special: false, image: "pizza/cheese-burst.jpg", desc: "Extra cheese filled crust, loaded toppings" },
        { name: "Tandoori Paneer Pizza", price: "₹319", special: false, image: "pizza/tandoori-paneer.jpg", desc: "Tandoori marinated paneer, onions, capsicum" },
        { name: "Mexican Pizza", price: "₹299", special: false, image: "pizza/mexican.jpg", desc: "Jalapeños, beans, corn, mexican seasoning" },
        { name: "Jain Special Pizza", price: "₹289", special: false, image: "pizza/jain.jpg", desc: "Jain-friendly toppings, no onions/garlic" },
        { name: "Bilandi's Special Pizza", price: "₹349", special: true, image: "pizza/special.jpg", desc: "Chef's signature sauce, loaded veggies, extra cheese" }
    ],
    burgers: [
        { name: "Aloo Tikki Burger", price: "₹99", special: false, image: "burgers/aloo-tikki.jpg", desc: "Crispy potato patty, fresh vegetables" },
        { name: "Veg Burger", price: "₹119", special: false, image: "burgers/veg.jpg", desc: "Classic vegetable patty, lettuce, tomato" },
        { name: "Cheese Burger", price: "₹139", special: false, image: "burgers/cheese.jpg", desc: "Vegetable patty with melted cheese" },
        { name: "Paneer Burger", price: "₹159", special: false, image: "burgers/paneer.jpg", desc: "Paneer patty, mint chutney, fresh veggies" },
        { name: "Double Patty Burger", price: "₹179", special: false, image: "burgers/double-patty.jpg", desc: "Two vegetable patties, double cheese" },
        { name: "Jain Special Burger", price: "₹149", special: false, image: "burgers/jain.jpg", desc: "Jain-friendly patty, no onions/garlic" },
        { name: "Bilandi's Special Burger", price: "₹199", special: true, image: "burgers/special.jpg", desc: "Crispy patty, house sauce, cheese, soft bun" }
    ],
    sandwiches: [
        { name: "Veg Grilled Sandwich", price: "₹129", special: false, image: "sandwiches/veg-grilled.jpg", desc: "Grilled vegetables, butter, seasoning" },
        { name: "Cheese Grilled Sandwich", price: "₹149", special: false, image: "sandwiches/cheese-grilled.jpg", desc: "Melted cheese, vegetables, grilled to perfection" },
        { name: "Veg Club Sandwich", price: "₹169", special: false, image: "sandwiches/veg-club.jpg", desc: "Triple decker with vegetables and sauces" },
        { name: "Cheese Club Sandwich", price: "₹189", special: false, image: "sandwiches/cheese-club.jpg", desc: "Triple decker with cheese and vegetables" },
        { name: "Paneer Sandwich", price: "₹179", special: false, image: "sandwiches/paneer.jpg", desc: "Paneer slices, mint chutney, vegetables" },
        { name: "Jain Sandwich", price: "₹159", special: false, image: "sandwiches/jain.jpg", desc: "Jain-friendly vegetables, no onions/garlic" },
        { name: "Bilandi's Special Sandwich", price: "₹219", special: true, image: "sandwiches/special.jpg", desc: "Grilled, cheese-loaded, house seasoning" }
    ],
    wraps: [
        { name: "Veg Wrap", price: "₹139", special: false, image: "wraps/veg.jpg", desc: "Fresh vegetables, sauces in soft wrap" },
        { name: "Paneer Wrap", price: "₹169", special: false, image: "wraps/paneer.jpg", desc: "Paneer cubes, vegetables, mint chutney" },
        { name: "Cheese Corn Wrap", price: "₹159", special: false, image: "wraps/cheese-corn.jpg", desc: "Sweet corn, melted cheese, vegetables" },
        { name: "Jain Wrap", price: "₹149", special: false, image: "wraps/jain.jpg", desc: "Jain-friendly vegetables, no onions/garlic" },
        { name: "Bilandi's Special Wrap", price: "₹199", special: true, image: "wraps/special.jpg", desc: "Paneer, veggies, spicy house sauce" }
    ],
    "pasta-noodles": [
        { name: "Red Sauce Pasta", price: "₹179", special: false, image: "pasta-noodles/red-sauce.jpg", desc: "Pasta in tangy tomato sauce" },
        { name: "White Sauce Pasta", price: "₹189", special: false, image: "pasta-noodles/white-sauce.jpg", desc: "Pasta in creamy white sauce" },
        { name: "Mix Sauce Pasta", price: "₹199", special: false, image: "pasta-noodles/mix-sauce.jpg", desc: "Combination of red and white sauces" },
        { name: "Jain Pasta", price: "₹189", special: false, image: "pasta-noodles/jain.jpg", desc: "Jain-friendly pasta, no onions/garlic" },
        { name: "Bilandi's Special Pasta", price: "₹249", special: true, image: "pasta-noodles/special.jpg", desc: "Creamy mix sauce with extra toppings" },
        { name: "Veg Noodles", price: "₹169", special: false, image: "pasta-noodles/veg-noodles.jpg", desc: "Stir-fried vegetables with noodles" },
        { name: "Paneer Noodles", price: "₹199", special: false, image: "pasta-noodles/paneer-noodles.jpg", desc: "Noodles with paneer and vegetables" },
        { name: "Jain Noodles", price: "₹179", special: false, image: "pasta-noodles/jain-noodles.jpg", desc: "Jain-friendly noodles, no onions/garlic" }
    ],
    "starters-chilli": [
        { name: "Plain Fries", price: "₹99", special: false, image: "starters-chilli/plain-fries.jpg", desc: "Crispy golden fries" },
        { name: "Peri Peri Fries", price: "₹129", special: false, image: "starters-chilli/peri-peri-fries.jpg", desc: "Fries tossed in peri peri seasoning" },
        { name: "Masala Fries", price: "₹119", special: false, image: "starters-chilli/masala-fries.jpg", desc: "Fries with Indian spices" },
        { name: "Cheese Fries", price: "₹149", special: false, image: "starters-chilli/cheese-fries.jpg", desc: "Fries loaded with melted cheese" },
        { name: "Honey Chilli Potato", price: "₹179", special: false, image: "starters-chilli/honey-chilli-potato.jpg", desc: "Crispy potatoes in sweet chilli sauce" },
        { name: "Chilli Paneer", price: "₹199", special: false, image: "starters-chilli/chilli-paneer.jpg", desc: "Paneer cubes in spicy chilli sauce" }
    ],
    chaat: [
        { name: "Dahi Chaat", price: "₹119", special: false, image: "chaat/dahi-chaat.jpg", desc: "Yogurt with mixed chaat ingredients" },
        { name: "Dahi Papdi Chaat", price: "₹139", special: false, image: "chaat/dahi-papdi.jpg", desc: "Crispy papdi with yogurt and chutneys" },
        { name: "Dahi Aloo Chaat", price: "₹129", special: false, image: "chaat/dahi-aloo.jpg", desc: "Potatoes with yogurt and spices" }
    ],
    beverages: [
        { name: "Vanilla Shake", price: "₹149", special: false, image: "beverages/shakes/vanilla.jpg", desc: "Creamy vanilla milkshake" },
        { name: "Strawberry Shake", price: "₹149", special: false, image: "beverages/shakes/strawberry.jpg", desc: "Fresh strawberry milkshake" },
        { name: "Chocolate Shake", price: "₹149", special: false, image: "beverages/shakes/chocolate.jpg", desc: "Rich chocolate milkshake" },
        { name: "Butterscotch Shake", price: "₹149", special: false, image: "beverages/shakes/butterscotch.jpg", desc: "Creamy butterscotch milkshake" },
        { name: "Oreo Shake", price: "₹169", special: false, image: "beverages/shakes/oreo.jpg", desc: "Oreo cookie milkshake" },
        { name: "Cold Coffee Shake", price: "₹159", special: false, image: "beverages/shakes/cold-coffee.jpg", desc: "Iced coffee milkshake" },
        { name: "Masala Tea", price: "₹59", special: false, image: "beverages/coffee-tea/masala-tea.jpg", desc: "Traditional Indian spiced tea" },
        { name: "Ginger Tea", price: "₹59", special: false, image: "beverages/coffee-tea/ginger-tea.jpg", desc: "Tea with fresh ginger" },
        { name: "Hot Coffee", price: "₹99", special: false, image: "beverages/coffee-tea/hot-coffee.jpg", desc: "Freshly brewed coffee" },
        { name: "Cold Coffee", price: "₹129", special: false, image: "beverages/coffee-tea/cold-coffee.jpg", desc: "Iced coffee with cream" },
        { name: "Chocolate Coffee", price: "₹139", special: false, image: "beverages/coffee-tea/chocolate-coffee.jpg", desc: "Coffee with chocolate flavor" },
        { name: "Virgin Mojito", price: "₹129", special: false, image: "beverages/mocktails/virgin-mojito.jpg", desc: "Mint and lime mocktail" },
        { name: "Blue Lagoon", price: "₹149", special: false, image: "beverages/mocktails/blue-lagoon.jpg", desc: "Blue curacao based mocktail" },
        { name: "Blue Berry", price: "₹149", special: false, image: "beverages/mocktails/blue-berry.jpg", desc: "Blueberry flavored mocktail" },
        { name: "Virgin Mary", price: "₹139", special: false, image: "beverages/mocktails/virgin-mary.jpg", desc: "Tomato based mocktail" },
        { name: "Fresh Lime Soda", price: "₹89", special: false, image: "beverages/mocktails/fresh-lime-soda.jpg", desc: "Lime juice with soda" }
    ],
    pastries: [
        { name: "Chocolate Pastry", price: "₹99", special: false, image: "pastries/chocolate.jpg", desc: "Rich chocolate pastry" },
        { name: "Black Forest Pastry", price: "₹99", special: false, image: "pastries/black-forest.jpg", desc: "Cherry and chocolate pastry" },
        { name: "Pineapple Pastry", price: "₹89", special: false, image: "pastries/pineapple.jpg", desc: "Pineapple cream pastry" },
        { name: "Butterscotch Pastry", price: "₹99", special: false, image: "pastries/butterscotch.jpg", desc: "Butterscotch flavored pastry" }
    ],
    "garlic-bread": [
        { name: "Classic Garlic Bread", price: "₹129", special: false, image: "garlic-bread/classic.jpg", desc: "Fresh bread with garlic butter" },
        { name: "Cheese Garlic Bread", price: "₹159", special: false, image: "garlic-bread/cheese.jpg", desc: "Garlic bread topped with melted cheese" },
        { name: "Cheese Stuffed Garlic Bread", price: "₹189", special: false, image: "garlic-bread/stuffed.jpg", desc: "Garlic bread stuffed with cheese" },
        { name: "Herb Garlic Bread", price: "₹149", special: false, image: "garlic-bread/herb.jpg", desc: "Garlic bread with Italian herbs" },
        { name: "Bilandi's Special Garlic Bread", price: "₹219", special: true, image: "garlic-bread/special.jpg", desc: "Premium garlic bread with special seasoning" }
    ],
    combos: [
        { name: "Deal 1: Burger Combo", price: "₹249", special: false, image: "combos/deal1.jpg", desc: "Aloo Tikki Burger + Fries" },
        { name: "Deal 2: Pizza Combo", price: "₹499", special: false, image: "combos/deal2.jpg", desc: "Medium Pizza + Fries + Soft Drink" },
        { name: "Deal 3: Pasta Combo", price: "₹399", special: false, image: "combos/deal3.jpg", desc: "Pasta + Fries + Soft Drink" },
        { name: "Family Pack", price: "₹899", special: false, image: "combos/family-pack.jpg", desc: "Tandoori Paneer Pizza (Large) + Margherita Pizza (Medium) + Fries + Soft Drinks" }
    ]
};

/**
 * Populate all menu sections for mobile
 */
function populateAllMenuSections() {
    const container = document.querySelector('.menu-sections-container');
    
    // Create all menu sections
    for (const categoryId in mobileMenuData) {
        const section = createMobileMenuSection(categoryId);
        container.appendChild(section);
    }
    
    // Show first section (pizza)
    showMenuSection('pizza');
}

/**
 * Create a mobile-optimized menu section
 */
function createMobileMenuSection(categoryId) {
    const categoryData = mobileMenuData[categoryId];
    const categoryName = getMobileCategoryName(categoryId);
    const categoryIcon = getMobileCategoryIcon(categoryId);
    
    // Create section element
    const section = document.createElement('section');
    section.id = categoryId;
    section.className = 'menu-section';
    section.dataset.category = categoryId;
    
    // Create header
    const header = document.createElement('div');
    header.className = 'menu-section-header';
    header.innerHTML = `
        <h2 class="menu-section-title">
            <i class="${categoryIcon}"></i>
            ${categoryName}
        </h2>
        ${categoryId === 'pizza' ? '<p class="menu-section-subtitle">Sizes: Regular | Medium | Large</p>' : ''}
        ${categoryId === 'combos' ? '<p class="menu-section-subtitle">Bilandi\'s Specials</p>' : ''}
    `;
    
    // Create items container
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'menu-items';
    
    // Add items with staggered animation delays
    categoryData.forEach((item, index) => {
        const menuItem = createMobileMenuItem(item);
        menuItem.style.animationDelay = `${index * 0.05}s`;
        itemsContainer.appendChild(menuItem);
    });
    
    // Assemble section
    section.appendChild(header);
    section.appendChild(itemsContainer);
    
    return section;
}

/**
 * Create mobile-optimized menu item
 */
function createMobileMenuItem(item) {
    const div = document.createElement('div');
    div.className = `menu-item ${item.special ? 'special' : ''}`;
    
    // Add touch feedback
    div.addEventListener('touchstart', () => {
        div.classList.add('touch-active');
    });
    
    div.addEventListener('touchend', () => {
        setTimeout(() => {
            div.classList.remove('touch-active');
        }, 150);
    });
    
    // Use placeholder if image not available
    const imageSrc = `images/${item.image}`;
    const placeholder = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="180" viewBox="0 0 400 180"><rect width="400" height="180" fill="%23f8f5f0"/><text x="200" y="90" font-family="Poppins" font-size="14" text-anchor="middle" fill="%235c4b3a">Loading Image</text></svg>';
    
    div.innerHTML = `
        <div class="menu-item-image-container">
            <img 
                data-src="${imageSrc}"
                src="${placeholder}"
                alt="${item.name}"
                class="menu-item-image lazy-image"
                loading="lazy"
                width="400"
                height="180"
            >
            <div class="menu-item-image-overlay"></div>
        </div>
        <div class="menu-item-content">
            <div class="menu-item-header">
                <h3 class="menu-item-name">${item.name}</h3>
                <div class="menu-item-price">${item.price}</div>
            </div>
            ${item.desc ? `<p class="menu-item-desc">${item.desc}</p>` : ''}
        </div>
    `;
    
    return div;
}

/**
 * Show a specific menu section (mobile-optimized)
 */
function showMenuSection(categoryId) {
    // Hide all sections with animation
    document.querySelectorAll('.menu-section').forEach(section => {
        if (section.classList.contains('active')) {
            section.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                section.classList.remove('active');
                section.style.animation = '';
            }, 300);
        }
    });
    
    // Show selected section with animation
    const targetSection = document.getElementById(categoryId);
    if (targetSection) {
        targetSection.style.opacity = '0';
        targetSection.style.transform = 'translateY(20px)';
        targetSection.classList.add('active');
        
        // Animate in
        setTimeout(() => {
            targetSection.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0)';
            
            // Animate menu items with stagger
            animateMobileMenuItems(targetSection);
            
            // Scroll to section
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            
        }, 50);
    }
}

/**
 * Animate menu items with mobile-optimized stagger
 */
function animateMobileMenuItems(section) {
    const items = section.querySelectorAll('.menu-item');
    
    items.forEach((item, index) => {
        // Reset
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        // Animate with stagger
        setTimeout(() => {
            item.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100);
    });
}

/**
 * Setup mobile recommendations carousel
 */
function setupMobileRecommendations() {
    const recommendations = [
        { name: "Bilandi's Special Pizza", icon: "fas fa-pizza-slice", desc: "Signature pizza with chef's special sauce" },
        { name: "Bilandi's Special Burger", icon: "fas fa-hamburger", desc: "Premium burger with house-made patty" },
        { name: "Cheese Garlic Bread", icon: "fas fa-bread-loaf", desc: "Freshly baked with melted cheese" },
        { name: "Dahi Papdi Chaat", icon: "fas fa-bowl-food", desc: "Traditional chaat with our special touch" },
        { name: "Cold Coffee", icon: "fas fa-mug-hot", desc: "Perfectly brewed iced coffee" }
    ];
    
    const carouselTrack = document.querySelector('.carousel-track');
    
    // Create recommendation cards
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        
        card.innerHTML = `
            <i class="${rec.icon}"></i>
            <h4>${rec.name}</h4>
            <p>${rec.desc}</p>
        `;
        
        carouselTrack.appendChild(card);
    });
    
    // Setup carousel navigation
    setupCarouselNavigation();
}

/**
 * Setup carousel navigation for mobile
 */
function setupCarouselNavigation() {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const cardWidth = 280 + 16; // card width + gap
    
    let currentPosition = 0;
    const maxPosition = track.scrollWidth - track.clientWidth;
    
    prevBtn.addEventListener('click', () => {
        currentPosition = Math.max(currentPosition - cardWidth, 0);
        track.scrollTo({ left: currentPosition, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        currentPosition = Math.min(currentPosition + cardWidth, maxPosition);
        track.scrollTo({ left: currentPosition, behavior: 'smooth' });
    });
    
    // Add swipe support
    let startX = 0;
    let scrollLeft = 0;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX;
        scrollLeft = track.scrollLeft;
    }, { passive: true });
    
    track.addEventListener('touchmove', (e) => {
        if (!startX) return;
        const x = e.touches[0].pageX;
        const walk = (x - startX) * 2;
        track.scrollLeft = scrollLeft - walk;
    }, { passive: true });
}

/**
 * Setup mobile FAB (Floating Action Button)
 */
function setupMobileFAB() {
    const fabButton = document.querySelector('.fab-button');
    const fabMenu = document.querySelector('.fab-menu');
    const categories = [
        { id: 'pizza', name: 'Pizza', icon: 'fas fa-pizza-slice' },
        { id: 'burgers', name: 'Burgers', icon: 'fas fa-hamburger' },
        { id: 'sandwiches', name: 'Sandwiches', icon: 'fas fa-bread-slice' },
        { id: 'wraps', name: 'Wraps', icon: 'fas fa-burrito' },
        { id: 'pasta-noodles', name: 'Pasta', icon: 'fas fa-utensils' },
        { id: 'garlic-bread', name: 'Garlic Bread', icon: 'fas fa-bread-loaf' },
        { id: 'beverages', name: 'Drinks', icon: 'fas fa-mug-hot' },
        { id: 'combos', name: 'Combos', icon: 'fas fa-gift' }
    ];
    
    // Populate quick menu
    categories.forEach(category => {
        const item = document.createElement('div');
        item.className = 'quick-category';
        item.dataset.category = category.id;
        
        item.innerHTML = `
            <i class="${category.icon}"></i>
            <span>${category.name}</span>
        `;
        
        item.addEventListener('click', () => {
            // Close menu
            fabMenu.classList.remove('active');
            fabButton.innerHTML = '<i class="fas fa-bars"></i>';
            
            // Show category
            const categoryCard = document.querySelector(`.category-card[data-category="${category.id}"]`);
            if (categoryCard) {
                categoryCard.click();
            } else {
                showMenuSection(category.id);
            }
            
            showToast(`Jumped to ${category.name}`);
        });
        
        fabMenu.appendChild(item);
    });
    
    // Toggle menu on button click
    fabButton.addEventListener('click', (e) => {
        e.stopPropagation();
        fabMenu.classList.toggle('active');
        
        // Change icon
        if (fabMenu.classList.contains('active')) {
            fabButton.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            fabButton.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!fabButton.contains(e.target) && !fabMenu.contains(e.target)) {
            fabMenu.classList.remove('active');
            fabButton.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close menu on scroll
    window.addEventListener('scroll', () => {
        fabMenu.classList.remove('active');
        fabButton.innerHTML = '<i class="fas fa-bars"></i>';
    }, { passive: true });
}

/**
 * Setup mobile back to top button
 */
function setupMobileBackToTop() {
    const backTopBtn = document.querySelector('.mobile-back-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backTopBtn.classList.add('visible');
        } else {
            backTopBtn.classList.remove('visible');
        }
    }, { passive: true });
    
    backTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Add button feedback
        backTopBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            backTopBtn.style.transform = '';
        }, 200);
    });
}

/**
 * Setup touch gestures for mobile
 */
function setupTouchGestures() {
    // Add swipe detection for menu sections
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = endX - startX;
        const diffY = endY - startY;
        
        // Only consider horizontal swipes
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            // Swipe left/right
            const activeCategory = document.querySelector('.category-card.active');
            if (activeCategory) {
                const allCategories = Array.from(document.querySelectorAll('.category-card'));
                const currentIndex = allCategories.indexOf(activeCategory);
                
                if (diffX > 0 && currentIndex > 0) {
                    // Swipe right - previous category
                    allCategories[currentIndex - 1].click();
                } else if (diffX < 0 && currentIndex < allCategories.length - 1) {
                    // Swipe left - next category
                    allCategories[currentIndex + 1].click();
                }
            }
        }
        
        startX = 0;
        startY = 0;
    }, { passive: true });
}

/**
 * Setup mobile image loading with lazy load
 */
function setupImageLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadMobileImage(img);
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            loadMobileImage(img);
        });
    }
}

/**
 * Load image with mobile-optimized effects
 */
function loadMobileImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;
    
    // Add loading effect
    img.style.filter = 'blur(10px)';
    img.style.opacity = '0.8';
    
    const tempImg = new Image();
    tempImg.onload = () => {
        img.src = src;
        
        // Smooth reveal
        setTimeout(() => {
            img.style.transition = 'filter 0.6s ease, opacity 0.6s ease';
            img.style.filter = 'blur(0)';
            img.style.opacity = '1';
        }, 100);
    };
    
    tempImg.onerror = () => {
        // Keep placeholder if image fails
        console.warn(`Failed to load image: ${src}`);
    };
    
    tempImg.src = src;
}

/**
 * Setup mobile toast notifications
 */
function setupToastNotifications() {
    // Toast element is already in HTML
}

/**
 * Show mobile toast notification
 */
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastText = toast.querySelector('.toast-text');
    
    toastText.textContent = message;
    toast.classList.add('show');
    
    // Auto hide
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

/**
 * Setup mobile animations
 */
function setupMobileAnimations() {
    // Add CSS animation for fadeOut
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .touch-active {
            transform: scale(0.98) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Add scroll animations
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
    
    // Observe menu items for animation
    document.querySelectorAll('.menu-item').forEach(item => {
        observer.observe(item);
    });
}

/**
 * Helper functions for mobile
 */
function getMobileCategoryName(categoryId) {
    const names = {
        'pizza': 'Pizza',
        'burgers': 'Burgers',
        'sandwiches': 'Sandwiches',
        'wraps': 'Wraps',
        'pasta-noodles': 'Pasta & Noodles',
        'starters-chilli': 'Starters & Chilli',
        'chaat': 'Chaat',
        'beverages': 'Beverages',
        'pastries': 'Pastries',
        'garlic-bread': 'Garlic Bread',
        'combos': 'Combos'
    };
    return names[categoryId] || categoryId;
}

function getMobileCategoryIcon(categoryId) {
    const icons = {
        'pizza': 'fas fa-pizza-slice',
        'burgers': 'fas fa-hamburger',
        'sandwiches': 'fas fa-bread-slice',
        'wraps': 'fas fa-burrito',
        'pasta-noodles': 'fas fa-utensils',
        'starters-chilli': 'fas fa-pepper-hot',
        'chaat': 'fas fa-bowl-food',
        'beverages': 'fas fa-mug-hot',
        'pastries': 'fas fa-cookie-bite',
        'garlic-bread': 'fas fa-bread-loaf',
        'combos': 'fas fa-gift'
    };
    return icons[categoryId] || 'fas fa-utensils';
}

/**
 * Preload critical images for mobile
 */
function preloadMobileImages() {
    const criticalImages = [
        'images/hero-bg.jpg',
        'images/pizza/special.jpg',
        'images/burgers/special.jpg',
        'images/garlic-bread/special.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Start preloading images
preloadMobileImages();

// Add mobile-specific event listeners
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible again
        showToast('Welcome back!', 2000);
    }
});

// Prevent zoom on double-tap for mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Add vibration feedback for iOS (if supported)
if ('vibrate' in navigator) {
    const vibrateElements = document.querySelectorAll('.category-card, .fab-button, .mobile-back-top');
    vibrateElements.forEach(el => {
        el.addEventListener('touchstart', () => {
            navigator.vibrate(10);
        });
    });
}
