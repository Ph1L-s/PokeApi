function renderPokemonStats(pokemon) {
    let container = document.getElementById('pokemon_stats');
    if (!container) {
        logErrorMessage("stats container not found");
        return;
    }
    
    setupStatsContainer(container, pokemon);
    logRenderSuccess("pokemon stats for " + pokemon.name);
}

function renderGenerations(generations) {
    let container = document.getElementById('generations_container');
    if (!container) {
        logErrorMessage("generations container not found");
        return;
    }
    
    insertGenerationsIntoContainer(container, generations);
    logRenderSuccess("generations", generations.length);
}

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

function renderNoSearchResults() {
    let container = findPokemonContainerElement();
    if (container) {
        container.innerHTML = getNoSearchResultsTemplate();
    }
    
    updateContentHeaderForSearch(0);
    logRenderSuccess("no search results for '" + currentSearchTerm + "'");
}

function updateContentHeaderForSearch(resultCount) {
    let contentHeader = findContentHeaderElement();
    
    if (contentHeader) {
        updateContentHeaderText(contentHeader, resultCount);
    } else {
        logErrorMessage("Content header element not found - add id='content_header_title' to your h2 or ensure .content_header class exists");
    }
}

function addImageLoadingEffects() {
    let imageCount = addImageLoadingEffectsToContainer();
    logRenderMessage("Adding loading effects to " + imageCount + " pokemon images");
    logRenderMessage("Loading effects added to all pokemon images");
}