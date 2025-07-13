/* loader.js */
//--------------------------------------------------------------------------------------> show loading Overlay
function showLoadingOverlay(message = "loading...") {
    let container = findPokemonContainer();
    if (container) {
        let loadingOverlay = createLoadingOverlayElement(message);
        appendLoadingOverlay(container, loadingOverlay);
    }
}

//--------------------------------------------------------------------------------------> hide loading overlay
function hideLoadingOverlay() {
    let container = findPokemonContainer();
    if (container) {
        removeLoadingOverlay(container);
    }
}

//--------------------------------------------------------------------------------------> show loading message
function showLoading(message = "loading...") {
    let container = findPokemonContainer();
    if (container) {
        setLoadingContent(container, message);
    }
}

//--------------------------------------------------------------------------------------> show error message
function showError(message) {
    let container = findPokemonContainer();
    if (container) {
        setErrorContent(container, message);
    }
    
    console.error("error displayed:", message);
}