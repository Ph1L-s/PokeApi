/* loader-helpers.js */

//--------------------------------------------------------------------------------------> find pokemon container
function findPokemonContainer() {
    let container = document.getElementById('pokemon_container');
    return container;
}

//--------------------------------------------------------------------------------------> create loading overlay element
function createLoadingOverlayElement(message) {
    let loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading_overlay';
    loadingOverlay.className = 'loading_overlay';
    loadingOverlay.innerHTML = getLoadingOverlayTemplate(message);
    
    return loadingOverlay;
}

//--------------------------------------------------------------------------------------> append loading overlay
function appendLoadingOverlay(container, loadingOverlay) {
    container.classList.add('has_overlay');
    container.appendChild(loadingOverlay);
}

//--------------------------------------------------------------------------------------> remove loading overlay
function removeLoadingOverlay(container) {
    let overlay = document.getElementById('loading_overlay');
    if (overlay) {
        overlay.remove();
    }
    container.classList.remove('has_overlay');
}

//--------------------------------------------------------------------------------------> set loading content
function setLoadingContent(container, message) {
    container.innerHTML = getLoadingTemplate(message);
    container.classList.add('loading_state');
}

//--------------------------------------------------------------------------------------> set error content
function setErrorContent(container, message) {
    container.innerHTML = getErrorTemplate(message);
    container.classList.add('error_state');
}