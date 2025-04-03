// Configuration
const CONFIG = {
    API_BASE_URL: 'https://api.thecatapi.com/v1',
    API_KEY: 'live_xeUxEca19X0fhQ72MiaBUH0ucdYqRVsX48qirHs82e3U2oBf93Yw9hRiBtpkYsaB'
};

// Error handling utility
class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// Centralized API request handler
async function apiRequest(endpoint, options = {}) {
    const defaultHeaders = {
        'X-API-KEY': CONFIG.API_KEY,
        'Content-Type': 'application/json'
    };

    const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
        ...options,
        headers: { ...defaultHeaders, ...options.headers }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(errorData.message || 'Unknown error', response.status);
    }

    return response.json();
}

// DOM Utilities
const DOM = {
    getElement: (id) => document.getElementById(id),
    showError: (message) => {
        const errorSpan = DOM.getElement('error');
        errorSpan.textContent = message;
        errorSpan.parentElement.style.display = 'block';
        setTimeout(() => {
            errorSpan.parentElement.style.display = 'none';
        }, 5000);
    },
    createCatElement: (cat, isFavorite = false) => {
        const article = document.createElement('article');
        article.classList.add('body-article');

        const img = document.createElement('img');
        img.src = cat.image?.url || cat.url;
        img.alt = 'Cat image';
        img.loading = 'lazy';

        const btn = document.createElement('button');
        btn.classList.add('article--button');
        btn.textContent = isFavorite ? 'Remove from favorites' : 'Save to favorites';
        
        btn.onclick = isFavorite 
            ? () => deleteFavoriteCats(cat.id) 
            : () => saveFavoriteCats(cat.id);

        article.append(img, btn);
        return article;
    }
};

// Fetch random cats
async function fetchRandomCats() {
    try {
        const randomCats = await apiRequest('/images/search?limit=3');
        const container = DOM.getElement('randomCats').querySelector('.container-body');
        container.innerHTML = '';

        randomCats.forEach((cat, index) => {
            const article = DOM.createCatElement(cat);
            container.appendChild(article);
        });
    } catch (error) {
        DOM.showError(`Failed to fetch random cats: ${error.message}`);
    }
}

// Fetch favorite cats
async function fetchFavoriteCats() {
    try {
        const favoriteCats = await apiRequest('/favourites');
        const container = DOM.getElement('favoriteCats');
        container.innerHTML = '';

        favoriteCats.forEach(cat => {
            const article = DOM.createCatElement(cat, true);
            container.appendChild(article);
        });
    } catch (error) {
        DOM.showError(`Failed to fetch favorite cats: ${error.message}`);
    }
}

// Save cat to favorites
async function saveFavoriteCats(imageId) {
    try {
        await apiRequest('/favourites', {
            method: 'POST',
            body: JSON.stringify({ image_id: imageId })
        });
        fetchFavoriteCats();
    } catch (error) {
        DOM.showError(`Failed to save favorite: ${error.message}`);
    }
}

// Delete cat from favorites
async function deleteFavoriteCats(favoriteId) {
    try {
        await apiRequest(`/favourites/${favoriteId}`, { method: 'DELETE' });
        fetchFavoriteCats();
    } catch (error) {
        DOM.showError(`Failed to delete favorite: ${error.message}`);
    }
}

// Upload cat photo
async function uploadCatFoto() {
    const form = DOM.getElement('uploadingForm');
    const fileInput = DOM.getElement('file');

    if (!fileInput.files.length) {
        DOM.showError('Please select a file to upload');
        return;
    }

    const formData = new FormData(form);

    try {
        const result = await fetch(`${CONFIG.API_BASE_URL}/images/upload`, {
            method: 'POST',
            headers: { 'X-API-KEY': CONFIG.API_KEY },
            body: formData
        });

        if (!result.ok) {
            const errorData = await result.json();
            throw new ApiError(errorData.message || 'Upload failed', result.status);
        }

        DOM.showError('Image uploaded successfully!');
        form.reset();
    } catch (error) {
        DOM.showError(`Upload failed: ${error.message}`);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchRandomCats();
    fetchFavoriteCats();

    const changeButton = DOM.getElement('btn');
    changeButton.addEventListener('click', fetchRandomCats);

    const uploadButton = DOM.getElement('uploadingForm').querySelector('button');
    uploadButton.addEventListener('click', uploadCatFoto);
});
