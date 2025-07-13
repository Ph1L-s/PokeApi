/* loader-helpers.js */

//--------------------------------------------------------------------------------------> find pokemon container
function findPokemonContainer() {
    let container = document.getElementById('pokemon_container');
    if (!container) {
        console.warn("pokemon container not found");
    }
    return container;
}

//--------------------------------------------------------------------------------------> create loading overlay element
function createLoadingOverlayElement(message) {
    let loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading_overlay';
    loadingOverlay.className = 'loading_overlay';
    loadingOverlay.innerHTML = getLoadingOverlayTemplate(message);
    
    console.log("Created loading overlay with message:", message);
    return loadingOverlay;
}

//--------------------------------------------------------------------------------------> append loading overlay
function appendLoadingOverlay(container, loadingOverlay) {
    container.classList.add('has_overlay');
    container.appendChild(loadingOverlay);
    console.log("Appended loading overlay to container");
}

//--------------------------------------------------------------------------------------> remove loading overlay
function removeLoadingOverlay(container) {
    let overlay = document.getElementById('loading_overlay');
    if (overlay) {
        overlay.remove();
        console.log("Removed loading overlay");
    }
    container.classList.remove('has_overlay');
    console.log("Removed has_overlay class from container");
}

//--------------------------------------------------------------------------------------> set loading content
function setLoadingContent(container, message) {
    container.innerHTML = getLoadingTemplate(message);
    container.classList.add('loading_state');
    console.log("Set loading content with message:", message);
}

//--------------------------------------------------------------------------------------> set error content
function setErrorContent(container, message) {
    container.innerHTML = getErrorTemplate(message);
    container.classList.add('error_state');
    console.log("Set error content with message:", message);
}