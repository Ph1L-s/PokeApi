/* render.js */

//--------------------------------------------------------------------------------------> render pokemon stats
function renderPokemonStats(pokemon) {
    let container = document.getElementById('pokemon_stats');
    if (!container) {
        logErrorMessage("stats container not found");
        return;
    }
    container.innerHTML = getPokemonStatsTemplate(pokemon);
    container.classList.add('active');
    container.onclick = function(event) {
        if (event.target === container || event.target.classList.contains('stats_overlay')) {
            closeStats();
        }
    };
    
    logRenderSuccess("pokemon stats for " + pokemon.name);
}

//--------------------------------------------------------------------------------------> render generations in sidebar
function renderGenerations(generations) {
    let container = document.getElementById('generations_container');
    if (!container) {
        logErrorMessage("generations container not found");
        return;
    }
    
    let normalGenerationsHTML = buildNormalGenerationsHTML(generations);
    let insertedSuccessfully = tryInsertGenerationsHTML(normalGenerationsHTML);
    
    if (!insertedSuccessfully) {
        logRenderMessage("No existing 'All Generations' button found, creating complete container");
        container.innerHTML = getGenerationsContainerTemplate(normalGenerationsHTML);
    } else {
        logRenderMessage("Added generation buttons after existing 'All Generations' button");
    }
    
    logRenderSuccess("generations", generations.length);
}

//--------------------------------------------------------------------------------------> render pokemon grid with limits
function renderPokemonGridWithLimiter(pokemonList, page) {
    let container = findPokemonContainerElement();
    if (!container) {
        return;
    }
    
    container.classList.remove('loading_state', 'error_state', 'has_overlay');
    
    if (!pokemonList || pokemonList.length === 0) {
        container.innerHTML = getNoPokemonTemplate();
        logRenderSuccess("empty pokemon grid");
        return;
    }
    
    let htmlString = buildPokemonGridHTML(pokemonList, page);
    container.innerHTML = htmlString;
    logRenderSuccess("pokemon grid with limiter", pokemonList.length);
    addImageLoadingEffects();
}

//--------------------------------------------------------------------------------------> render search results
function renderSearchResults(pokemonList) {
    let container = findPokemonContainerElement();
    if (!container) {
        return;
    }
    
    container.classList.remove('loading_state', 'error_state', 'has_overlay');
    
    if (!pokemonList || pokemonList.length === 0) {
        renderNoSearchResults();
        return;
    }
    
    let htmlString = buildSearchResultsHTML(pokemonList);
    container.innerHTML = htmlString;
    updateContentHeaderForSearch(pokemonList.length);
    
    logRenderSuccess("search results", pokemonList.length);
    addImageLoadingEffects();
}

//--------------------------------------------------------------------------------------> render no search results
function renderNoSearchResults() {
    let container = findPokemonContainerElement();
    if (container) {
        container.innerHTML = getNoSearchResultsTemplate();
    }
    
    updateContentHeaderForSearch(0);
    logRenderSuccess("no search results for '" + currentSearchTerm + "'");
}

//--------------------------------------------------------------------------------------> update content header for search
function updateContentHeaderForSearch(resultCount) {
    let contentHeader = findContentHeaderElement();
    
    if (contentHeader) {
        let headerText = buildContentHeaderText(resultCount);
        contentHeader.textContent = headerText;
        logRenderMessage("Updated content header: " + headerText);
    } else {
        logErrorMessage("Content header element not found - add id='content_header_title' to your h2 or ensure .content_header class exists");
    }
}

//--------------------------------------------------------------------------------------> Add image loading effects
function addImageLoadingEffects() {
    let imageCount = addImageLoadingEffectsToContainer();
    logRenderMessage("Adding loading effects to " + imageCount + " pokemon images");
    logRenderMessage("Loading effects added to all pokemon images");
}