/* loader.js */

//--------------------------------------------------------------------------------------> show loading Overlay
function showLoadingOverlay(message = "loading...") {
    let container = findPokemonContainer();
    if (container) {
        let loadingOverlay = createLoadingOverlayElement(message);
        appendLoadingOverlay(container, loadingOverlay);
        logLoadingShow("Created and appended loading overlay with message: " + message);
    } else {
        logErrorMessage("pokemon container not found for loading overlay");
    }
}

//--------------------------------------------------------------------------------------> hide loading overlay
function hideLoadingOverlay() {
    let container = findPokemonContainer();
    if (container) {
        removeLoadingOverlay(container);
        logLoadingHide("Removed loading overlay and has_overlay class from container");
    } else {
        logErrorMessage("pokemon container not found for hiding overlay");
    }
}

//--------------------------------------------------------------------------------------> show loading message
function showLoading(message = "loading...") {
    let container = findPokemonContainer();
    if (container) {
        setLoadingContent(container, message);
        logLoadingShow("Set loading content with message: " + message);
    } else {
        logErrorMessage("pokemon container not found for loading message");
    }
}

//--------------------------------------------------------------------------------------> show error message
function showError(message) {
    let container = findPokemonContainer();
    if (container) {
        setErrorContent(container, message);
    } else {
        logErrorMessage("pokemon container not found for error message");
    }
    
    logErrorMessage("error displayed: " + message);
}