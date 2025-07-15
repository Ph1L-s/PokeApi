function findPokemonContainer() {
    let container = document.getElementById('pokemon_container');
    return container;
}

function createLoadingOverlayElement(message) {
    let loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading_overlay';
    loadingOverlay.className = 'loading_overlay';
    loadingOverlay.innerHTML = getLoadingOverlayTemplate(message);
    
    return loadingOverlay;
}

function appendLoadingOverlay(container, loadingOverlay) {
    container.classList.add('has_overlay');
    container.appendChild(loadingOverlay);
}

function removeLoadingOverlay(container) {
    let overlay = document.getElementById('loading_overlay');
    if (overlay) {
        overlay.remove();
    }
    container.classList.remove('has_overlay');
}

function setLoadingContent(container, message) {
    container.innerHTML = getLoadingTemplate(message);
    container.classList.add('loading_state');
}

function setErrorContent(container, message) {
    container.innerHTML = getErrorTemplate(message);
    container.classList.add('error_state');
}