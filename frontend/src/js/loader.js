//--------------------------------------------------------------------------------------> loader.js
//--------------------------------------------------------------------------------------> show loading Overlay
function showLoadingOverlay(message = "loading...") {
    let container = document.getElementById('pokemon_container');
    if (container) {
        let loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading_overlay';
        loadingOverlay.className = 'loading_overlay';
        loadingOverlay.innerHTML = `
            <div class="loading_spinner"></div>
            <div class="loading_text">${message}</div>
        `;
        
        container.classList.add('has_overlay');
        container.appendChild(loadingOverlay);
    }
}

//--------------------------------------------------------------------------------------> hide loading overlay
function hideLoadingOverlay() {
    let container = document.getElementById('pokemon_container');
    if (container) {
        let overlay = document.getElementById('loading_overlay');
        if (overlay) {
            overlay.remove();
        }
        container.classList.remove('has_overlay');
    }
}

//--------------------------------------------------------------------------------------> show loading message
function showLoading(message = "loading...") {
    let container = document.getElementById('pokemon_container');
    if (container) {
        container.innerHTML = getLoadingTemplate(message);
        container.classList.add('loading_state');
    }
}

//--------------------------------------------------------------------------------------> show error message
function showError(message) {
    let container = document.getElementById('pokemon_container');
    if (container) {
        container.innerHTML = getErrorTemplate(message);
        container.classList.add('error_state');
    }
    
    console.error("error displayed:", message);
}