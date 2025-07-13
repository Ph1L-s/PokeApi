/*  render.js */

//--------------------------------------------------------------------------------------> render pokemon stats
function renderPokemonStats(pokemon) {
    let container = document.getElementById('pokemon_stats');
    if (!container) {
        console.warn("stats container not found");
        return;
    }
    container.innerHTML = getPokemonStatsTemplate(pokemon);
    container.classList.add('active');
    container.onclick = function(event) {
        if (event.target === container || event.target.classList.contains('stats_overlay')) {
            closeStats();
        }
    };
    
    console.log("rendered stats for:", pokemon.name);
}

//--------------------------------------------------------------------------------------> render generations in sidebar
function renderGenerations(generations) {
    let container = document.getElementById('generations_container');
    if (!container) {
        console.warn("generations container not found");
        return;
    }
    
    let normalGenerationsHTML = buildNormalGenerationsHTML(generations);
    let insertedSuccessfully = tryInsertGenerationsHTML(normalGenerationsHTML);
    
    if (!insertedSuccessfully) {
        console.log("No existing 'All Generations' button found, creating complete container");
        container.innerHTML = getGenerationsContainerTemplate(normalGenerationsHTML);
    }
    
    console.log("rendered generations:", generations.length, "plus All Generations button");
}

//--------------------------------------------------------------------------------------> render pokemon grid with limits
function renderPokemonGridWithLimiter(pokemonList, page) {
    let container = document.getElementById('pokemon_container');
    if (!container) {
        console.warn("pokemon container not found");
        return;
    }
    
    container.classList.remove('loading_state', 'error_state', 'has_overlay');
    
    if (!pokemonList || pokemonList.length === 0) {
        container.innerHTML = getNoPokemonTemplate();
        return;
    }
    
    let htmlString = buildPokemonGridHTML(pokemonList, page);
    container.innerHTML = htmlString;
    console.log("rendered pokemon grid with Limiter:", pokemonList.length);
    addImageLoadingEffects();
}

//--------------------------------------------------------------------------------------> render search results
function renderSearchResults(pokemonList) {
    let container = document.getElementById('pokemon_container');
    if (!container) {
        console.warn("pokemon container not found");
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
    
    console.log("rendered search results:", pokemonList.length, "pokemon");
    addImageLoadingEffects();
}

//--------------------------------------------------------------------------------------> render no search results
function renderNoSearchResults() {
    let container = document.getElementById('pokemon_container');
    if (container) {
        container.innerHTML = getNoSearchResultsTemplate();
    }
    
    updateContentHeaderForSearch(0);
    console.log("rendered no search results for:", currentSearchTerm);
}

//--------------------------------------------------------------------------------------> update content header for search
function updateContentHeaderForSearch(resultCount) {
    let contentHeader = findContentHeaderElement();
    
    if (contentHeader) {
        let headerText = buildContentHeaderText(resultCount);
        contentHeader.textContent = headerText;
        console.log("Updated content header:", headerText);
    } else {
        console.warn("Content header element not found - add id='content_header_title' to your h2 or ensure .content_header class exists");
    }
}

//--------------------------------------------------------------------------------------> Add image loading effects
function addImageLoadingEffects() {
    let images = document.getElementsByClassName('pokemon_sprite_mini');
    console.log("Adding loading effects to", images.length, "pokemon images");
    
    for (let imgIndex = 0; imgIndex < images.length; imgIndex++) {
        let img = images[imgIndex];
        img.classList.add('loading');
        console.log("Added loading class to pokemon image", imgIndex + 1, "(" + img.alt + ")");

        if (img.complete && img.naturalHeight !== 0) {
            img.classList.remove('loading');
            img.classList.add('loaded');
            console.log("Image already loaded:", img.alt);
        } else if (img.complete && img.naturalHeight === 0) {
            img.classList.remove('loading');
            img.classList.add('error');
            console.error("Image failed to load:", img.alt);
        }
    }
    
    console.log("Loading effects added to all pokemon images");
}