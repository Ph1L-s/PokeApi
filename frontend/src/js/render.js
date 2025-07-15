/* render.js */

//--------------------------------------------------------------------------------------> render pokemon stats
function renderPokemonStats(pokemon) {
    let container = document.getElementById('pokemon_stats');
    if (!container) {
        logStatsContainerNotFound();
        return;
    }
    
    setupStatsContainer(container, pokemon);
    logStatsRenderSuccess(pokemon.name);
}

//--------------------------------------------------------------------------------------> render generations in sidebar
function renderGenerations(generations) {
    let container = document.getElementById('generations_container');
    if (!container) {
        logGenerationsContainerNotFound();
        return;
    }
    
    insertGenerationsIntoContainer(container, generations);
    logGenerationsRenderSuccess(generations.length);
}

//--------------------------------------------------------------------------------------> render pokemon grid with limits
function renderPokemonGridWithLimiter(pokemonList, page) {
    let container = findPokemonContainerElement();
    if (!container) {
        return;
    }
    
    prepareContainerForRender(container);
    
    if (!pokemonList || pokemonList.length === 0) {
        renderEmptyPokemonGrid(container);
        return;
    }
    
    renderPokemonGridContent(container, pokemonList, page);
}

//--------------------------------------------------------------------------------------> render search results
function renderSearchResults(pokemonList) {
    let container = findPokemonContainerElement();
    if (!container) {
        return;
    }
    
    prepareContainerForRender(container);
    
    if (!pokemonList || pokemonList.length === 0) {
        renderNoSearchResults();
        return;
    }
    
    renderSearchResultsContent(container, pokemonList);
}

//--------------------------------------------------------------------------------------> render no search results
function renderNoSearchResults() {
    let container = findPokemonContainerElement();
    if (container) {
        container.innerHTML = getNoSearchResultsTemplate();
    }
    
    updateContentHeaderForSearch(0);
    logNoSearchResultsRender();
}

//--------------------------------------------------------------------------------------> update content header for search
function updateContentHeaderForSearch(resultCount) {
    let contentHeader = findContentHeaderElement();
    
    if (contentHeader) {
        updateContentHeaderText(contentHeader, resultCount);
    } else {
        logContentHeaderError();
    }
}

//--------------------------------------------------------------------------------------> Add image loading effects
function addImageLoadingEffects() {
    let imageCount = addImageLoadingEffectsToContainer();
    logImageLoadingEffects(imageCount);
}