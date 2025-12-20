// Bilandi's Cafe Mobile Menu - Simple & Working Version

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    initApp();
});

function initApp() {
    // Hide loading screen after 1 second
    setTimeout(() => {
        document.querySelector('.loading').classList.add('hidden');
        
        // Load categories and menu
        loadCategories();
        loadMenuItems('pizza'); // Load pizza by default
        
        // Setup back to top button
        setupBackToTop();
        
        // Show welcome message
        setTimeout(() => {
            showNotification('Welcome to Bilandi\'s Cafe! Tap categories to browse.');
        }, 500);
    }, 1000);
}

// Menu Data Structure
const menuData = {
    pizza: {
        icon: 'fas fa-pizza-slice',
        items: [
            { name: "Margherita Pizza", price: "₹199", special: false, desc: "Classic tomato sauce, mozzarella, fresh basil", image: "pizza/margherita.jpg" },
            { name: "Onion & Capsicum Pizza", price: "₹229", special: false, desc: "Onions, capsicum, mozzarella, tomato sauce", image: "pizza/onion-capsicum.jpg" },
            { name: "Onion & Corn Pizza", price: "₹239", special: false, desc: "Sweet corn, onions, mozzarella cheese", image: "pizza/onion-corn.jpg" },
            { name: "Classic Veg Pizza", price: "₹249", special: false, desc: "Assorted vegetables, mozzarella, tomato sauce", image: "pizza/classic-veg.jpg" },
            { name: "Paneer Pizza", price: "₹269", special: false, desc: "Paneer cubes, onions, capsicum, mozzarella", image: "pizza/paneer.jpg" },
            { name: "Mushroom Pizza", price: "₹259", special: false, desc: "Fresh mushrooms, mozzarella, herbs", image: "pizza/mushroom.jpg" },
            { name: "Bilandi's Special Pizza", price: "₹349", special: true, desc: "Chef's signature sauce, loaded veggies, extra cheese", image: "pizza/special.jpg" }
        ],
        note: "Sizes: Regular | Medium | Large"
    },
    burgers: {
        icon: 'fas fa-hamburger',
        items: [
            { name: "Aloo Tikki Burger", price: "₹99", special: false, desc: "Crispy potato patty, fresh vegetables", image: "burgers/aloo-tikki.jpg" },
            { name: "Veg Burger", price: "₹119", special: false, desc: "Classic vegetable patty, lettuce, tomato", image: "burgers/veg.jpg" },
            { name: "Cheese Burger", price: "₹139", special: false, desc: "Vegetable patty with melted cheese", image: "burgers/cheese.jpg" },
            { name: "Paneer Burger", price: "₹159", special: false, desc: "Paneer patty, mint chutney, fresh veggies", image: "burgers/paneer.jpg" },
            { name: "Bilandi's Special Burger", price: "₹199", special: true, desc: "Crispy patty, house sauce, cheese, soft bun", image: "burgers/special.jpg" }
        ]
    },
    sandwiches: {
        icon: 'fas fa-bread-slice',
        items: [
            { name: "Veg Grilled Sandwich", price: "₹129", special: false, desc: "Grilled vegetables, butter, seasoning", image: "sandwiches/veg-grilled.jpg" },
            { name: "Cheese Grilled Sandwich", price: "₹149", special: false, desc: "Melted cheese, vegetables, grilled to perfection", image: "sandwiches/cheese-grilled.jpg" },
            { name: "Paneer Sandwich", price: "₹179", special: false, desc: "Paneer slices, mint chutney, vegetables", image: "sandwiches/paneer.jpg" },
            { name: "Bilandi's Special Sandwich", price: "₹219", special: true, desc: "Grilled, cheese-loaded, house seasoning", image: "sandwiches/special.jpg" }
        ]
    },
    wraps: {
        icon: 'fas fa-burrito',
        items: [
            { name: "Veg Wrap", price: "₹139", special: false, desc: "Fresh vegetables, sauces in soft wrap", image: "wraps/veg.jpg" },
            { name: "Paneer Wrap", price: "₹169", special: false, desc: "Paneer cubes, vegetables, mint chutney", image: "wraps/paneer.jpg" },
            { name: "Cheese Corn Wrap", price: "₹159", special: false, desc: "Sweet corn, melted cheese, vegetables", image: "wraps/cheese-corn.jpg" },
            { name: "Bilandi's Special Wrap", price: "₹199", special: true, desc: "Paneer, veggies, spicy house sauce", image: "wraps/special.jpg" }
        ]
    },
    pasta: {
        icon: 'fas fa-utensils',
        items: [
            { name: "Red Sauce Pasta", price: "₹179", special: false, desc: "Pasta in tangy tomato sauce", image: "pasta/red-sauce.jpg" },
            { name: "White Sauce Pasta", price: "₹189", special: false, desc: "Pasta in creamy white sauce", image: "pasta/white-sauce.jpg" },
            { name: "Mix Sauce Pasta", price: "₹199", special: false, desc: "Combination of red and white sauces", image: "pasta/mix-sauce.jpg" },
            { name: "Bilandi's Special Pasta", price: "₹249", special: true, desc: "Creamy mix sauce with extra toppings", image: "pasta/special.jpg" }
        ]
    },
    noodles: {
        icon: 'fas fa-utensils',
        items: [
            { name: "Veg Noodles", price: "₹169", special: false, desc: "Stir-fried vegetables with noodles", image: "noodles/veg.jpg" },
            { name: "Paneer Noodles", price: "₹199", special: false, desc: "Noodles with paneer and vegetables", image: "noodles/paneer.jpg" }
        ]
    },
    starters: {
        icon: 'fas fa-pepper-hot',
        items: [
            { name: "Plain Fries", price: "₹99", special: false, desc: "Crispy golden fries", image: "starters/fries.jpg" },
            { name: "Peri Peri Fries", price: "₹129", special: false, desc: "Fries tossed in peri peri seasoning", image: "starters/peri-fries.jpg" },
            { name: "Cheese Fries", price: "₹149", special: false, desc: "Fries loaded with melted cheese", image: "starters/cheese-fries.jpg" },
            { name: "Honey Chilli Potato", price: "₹179", special: false, desc: "Crispy potatoes in sweet chilli sauce", image: "starters/honey-chilli.jpg" }
        ]
    },
    chaat: {
        icon: 'fas fa-bowl-food',
        items: [
            { name: "Dahi Chaat", price: "₹119", special: false, desc: "Yogurt with mixed chaat ingredients", image: "chaat/dahi.jpg" },
            { name: "Dahi Papdi Chaat", price: "₹139", special: false, desc: "Crispy papdi with yogurt and chutneys", image: "chaat/papdi.jpg" },
            { name: "Dahi Aloo Chaat", price: "₹129", special: false, desc: "Potatoes with yogurt and spices", image: "chaat/aloo.jpg" }
        ]
    },
    beverages: {
        icon: 'fas fa-mug-hot',
        items: [
            { name: "Masala Tea", price: "₹59", special: false, desc: "Traditional Indian spiced tea", image: "beverages/tea.jpg" },
            { name: "Hot Coffee", price: "₹99", special: false, desc: "Freshly brewed coffee", image: "beverages/coffee.jpg" },
            { name: "Cold Coffee", price: "₹129", special: false, desc: "Iced coffee with cream", image: "beverages/cold-coffee.jpg" },
            { name: "Virgin Mojito", price: "₹129", special: false, desc: "Mint and lime mocktail", image: "beverages/mojito.jpg" }
        ]
    },
    pastries: {
        icon: 'fas fa-cookie-bite',
        items: [
            { name: "Chocolate Pastry", price: "₹99", special: false, desc: "Rich chocolate pastry", image: "pastries/chocolate.jpg" },
            { name: "Black Forest Pastry", price: "₹99", special: false, desc: "Cherry and chocolate pastry", image: "pastries/black-forest.jpg" },
            { name: "Pineapple Pastry", price: "₹89", special: false, desc: "Pineapple cream pastry", image: "pastries/pineapple.jpg" }
        ]
    },
    'garlic-bread': {
        icon: 'fas fa-bread-loaf',
        items: [
            { name: "Classic Garlic Bread", price: "₹129", special: false, desc: "Fresh bread with garlic butter", image: "garlic-bread/classic.jpg" },
            { name: "Cheese Garlic Bread", price: "₹159", special: false, desc: "Garlic bread topped with melted cheese", image: "garlic-bread/cheese.jpg" },
            { name: "Bilandi's Special Garlic Bread", price: "₹199", special: true, desc: "Premium garlic bread with special seasoning", image: "garlic-bread/special.jpg" }
        ]
    },
    combos: {
        icon: 'fas fa-gift',
        items: [
            { name: "Burger Combo", price: "₹249", special: false, desc: "Aloo Tikki Burger + Fries", image: "combos/burger.jpg" },
            { name: "Pizza Combo", price: "₹499", special: false, desc: "Medium Pizza + Fries + Soft Drink", image: "combos/pizza.jpg" },
            { name: "Pasta Combo", price: "₹399", special: false, desc: "Pasta + Fries + Soft Drink", image: "combos/pasta.jpg" },
            { name: "Family Pack", price: "₹899", special: false, desc: "2 Pizzas + Fries + Soft Drinks", image: "combos/family.jpg" }
        ],
        note: "Bilandi's Special Combos"
    }
};

function loadCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;
    
    // Clear existing content
    categoriesGrid.innerHTML = '';
    
    // Create category cards
    Object.keys(menuData).forEach((categoryId, index) => {
        const category = menuData[categoryId];
        const card = document.createElement('div');
        card.className = `category-card ${index === 0 ? 'active' : ''}`;
        card.dataset.category = categoryId;
        
        card.innerHTML = `
            <i class="${category.icon} category-icon"></i>
            <span class="category-name">${formatCategoryName(categoryId)}</span>
        `;
        
        // Add click event
        card.addEventListener('click', () => {
            // Remove active class from all cards
            document.querySelectorAll('.category-card').forEach(c => {
                c.classList.remove('active');
            });
            
            // Add active class to clicked card
            card.classList.add('active');
            
            // Load menu items for this category
            loadMenuItems(categoryId);
            
            // Scroll to menu section smoothly
            scrollToMenu();
            
            // Show notification
            showNotification(`Showing ${formatCategoryName(categoryId)}`);
        });
        
        categoriesGrid.appendChild(card);
    });
}

function loadMenuItems(categoryId) {
    const menuContainer = document.getElementById('menuContainer');
    if (!menuContainer) return;
    
    const category = menuData[categoryId];
    if (!category) return;
    
    // Create category header
    let html = `
        <div class="category-title">
            <i class="${category.icon}"></i>
            <h2>${formatCategoryName(categoryId)}</h2>
        </div>
    `;
    
    // Add note if exists
    if (category.note) {
        html += `<p class="category-note" style="color: var(--gray-color); margin-bottom: 20px; font-style: italic;">${category.note}</p>`;
    }
    
    // Create items grid
    html += '<div class="menu-items-grid">';
    
    category.items.forEach((item, index) => {
        html += `
            <div class="menu-item ${item.special ? 'special' : ''}" style="animation-delay: ${index * 0.05}s">
                <img src="images/${item.image || 'placeholder.jpg'}" 
                     alt="${item.name}" 
                     class="menu-item-image"
                     loading="lazy"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 300\"><rect width=\"400\" height=\"300\" fill=\"%23f0f0f0\"/><text x=\"200\" y=\"150\" text-anchor=\"middle\" fill=\"%23999\">Image</text></svg>'">
                <div class="menu-item-content">
                    <div class="menu-item-header">
                        <h3 class="menu-item-name">${item.name}</h3>
                        <div class="menu-item-price">${item.price}</div>
                    </div>
                    ${item.desc ? `<p class="menu-item-description">${item.desc}</p>` : ''}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Update container with fade animation
    menuContainer.style.opacity = '0';
    menuContainer.style.transition = 'opacity 0.3s ease';
    menuContainer.innerHTML = html;
    
    // Fade in
    setTimeout(() => {
        menuContainer.style.opacity = '1';
    }, 10);
    
    // Lazy load images
    lazyLoadImages();
}

function scrollToMenu() {
    const menuSection = document.querySelector('.menu-section');
    if (menuSection) {
        // Get header height for offset
        const headerHeight = document.querySelector('.header').offsetHeight;
        const scrollPosition = menuSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });
    }
}

function lazyLoadImages() {
    const images = document.querySelectorAll('.menu-item-image');
    
    images.forEach(img => {
        // If image is already loaded, skip
        if (img.complete) return;
        
        // Add loading animation
        img.style.filter = 'blur(5px)';
        img.style.opacity = '0.8';
        
        // When image loads
        img.onload = () => {
            img.style.transition = 'filter 0.5s ease, opacity 0.5s ease';
            img.style.filter = 'blur(0)';
            img.style.opacity = '1';
        };
        
        // If image fails to load
        img.onerror = () => {
            console.warn(`Failed to load image: ${img.src}`);
            img.style.filter = 'blur(0)';
            img.style.opacity = '1';
        };
    });
}

function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function showNotification(message, duration = 2000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: var(--success-color);
        color: white;
        padding: 12px 20px;
        border-radius: var(--radius);
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: var(--shadow);
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

function formatCategoryName(categoryId) {
    const names = {
        'pizza': 'Pizza',
        'burgers': 'Burgers',
        'sandwiches': 'Sandwiches',
        'wraps': 'Wraps',
        'pasta': 'Pasta',
        'noodles': 'Noodles',
        'starters': 'Starters',
        'chaat': 'Chaat',
        'beverages': 'Beverages',
        'pastries': 'Pastries',
        'garlic-bread': 'Garlic Bread',
        'combos': 'Combos'
    };
    
    return names[categoryId] || categoryId;
}

// Add some CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Preload hero image
window.addEventListener('load', () => {
    const heroImg = new Image();
    heroImg.src = 'images/hero-bg.jpg';
});
