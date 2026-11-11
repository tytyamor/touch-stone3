/*
North Star Bakery - JS Functionality
TyJon Chapple
Web Development
*/

// Data structures: Object for bakery info, Array for favorites/cart
const bakeryData = {
    name: "North Star Bakery",
    location: "Stafford, VA"
};

let userFavorites = [];

// Initialize application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    loadStoredFavorites();
    setupInteractiveFeature();
    setupFormValidation();
    prefillUserData();
});

// Interactive Feat: Menu Fav Tracker //
function setupInteractiveFeature() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    if (favoriteButtons.length === 0) return;

    // Create a dynamic status container if it doesn't exist
    let statusDiv = document.querySelector('#favorite-status');
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'favorite-status';
        statusDiv.style.margin = '1rem 0';
        statusDiv.style.fontWeight = 'bold';
        statusDiv.style.color = '#8C302F';
        const main = document.querySelector('main');
        if (main) main.prepend(statusDiv);
    }

    updateFavoritesDisplay();

    favoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemName = button.getAttribute('data-item');
            toggleFavorite(itemName, button);
        });
    });
}

function toggleFavorite(itemName, button) {
    const index = userFavorites.indexOf(itemName);
    
    if (index === -1) {
        userFavorites.push(itemName);
        button.textContent = 'Remove from Favorites';
        button.classList.add('favorited');
    } else {
        userFavorites.splice(index, 1);
        button.textContent = 'Add to Favorites';
        button.classList.remove('favorited');
    }

    // Save to localStorage
    localStorage.setItem('bakeryFavorites', JSON.stringify(userFavorites));
    updateFavoritesDisplay();
}

function updateFavoritesDisplay() {
    const statusDiv = document.querySelector('#favorite-status');
    if (!statusDiv) return;

    if (userFavorites.length > 0) {
        statusDiv.textContent = `⭐ Your Favorites (${userFavorites.length}): ${userFavorites.join(', ')}`;
    } else {
        statusDiv.textContent = '⭐ No favorites selected yet. Click "Add to Favorites" on any menu item!';
    }
}

function loadStoredFavorites() {
    const savedFavorites = localStorage.getItem('bakeryFavorites');
    if (savedFavorites) {
        userFavorites = JSON.parse(savedFavorites);
    }
}

// Form Validation //
function setupFormValidation() {
    const form = document.querySelector('form');
    if (!form) return;

    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');

    form.addEventListener('submit', function(event) {
        let isValid = true;

        //Clear previous error messages
        clearErrors();

        //Check 1: Required Name Field
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Please enter your name.');
            isValid = false;
        }

        //Check 2: Email Format Validation
        const emailValue = emailInput.value.trim();
        if (!emailValue || !emailValue.include('@') || !emailValue.include('.')){
            showError(emailInput, 'Please enter a valid email address containing "@" and a domain.');
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault(); // Block submission if invalid
        } else {
            // Save user info to localStorage for pre-filling next time
            localStorage.setItem('userName', nameInput.value.trim());
            localStorage.setItem('userEmail', emailValue);
        }
    });

}

// Auto-populate favorites in the contact/pre-order form
document.addEventListener('DOMContentLoaded', () => {
    const favoritesInput = document.querySelector('#selected-favorites');
    if (favoritesInput) {
        const savedFavorites = JSON.parse(localStorage.getItem('bakeryFavorites')) || [];
        if (savedFavorites.length > 0) {
            favoritesInput.value = savedFavorites.join(', ');
        } else {
            favoritesInput.value = 'No favorites selected yet.';
        }
    }
});

function showError(inputElement, message) {
    const errorSpan = document.createElement('span');
    errorSpan.className = 'error-message';
    errorSpan.style.color = '#dc3545';
    errorSpan.style.fontSize = '0.85rem';
    errorSpan.style.marginTop = '0.25rem';
    errorSpan.style.display = 'block';
    errorSpan.textContent = message;
    
    // Insert error message directly after the input field
    inputElement.parentNode.appendChild(errorSpan);
    inputElement.style.borderColor = '#dc3545';
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.style.borderColor = '#E6E0D5');
}

function prefillUserData() {
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');

    if (nameInput && localStorage.getItem('userName')) {
        nameInput.value = localStorage.getItem('userName');
    }
    if (emailInput && localStorage.getItem('userEmail')) {
        emailInput.value = localStorage.getItem('userEmail');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Stop the form from trying to submit to a non-existent server endpoint
            event.preventDefault();
            
            // Gather form values (including your pre-populated favorites!)
            const formData = {
                name: document.querySelector('#name').value,
                email: document.querySelector('#email').value,
                subject: document.querySelector('select[name="subject"]').value,
                pickupDate: document.querySelector('input[type="date"]').value,
                favorites: document.querySelector('#selected-favorites').value,
                message: document.querySelector('textarea').value
            };
            
            console.log('Form submission captured:', formData);
            
            // Display a clean success alert or banner to the user
            alert('Thank you! Your pre-order message has been sent successfully.');
            
            // Optional: Reset form or clear localStorage favorites after order submission
            // contactForm.reset();
            // localStorage.removeItem('bakeryFavorites');
        });
    }
});