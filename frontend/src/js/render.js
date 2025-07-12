//--------------------------------------------------------------------------------------> render.js
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
//--------------------------------------------------------------------------------------> render gnerations in sidebar
function renderGenerations(generations) {
    let container = document.getElementById('generations_container');
    if (!container) {
        console.warn("generations container not found");
        return;
    }
    container.innerHTML = '';
    
    for (let generationIndex = 0; generationIndex < generations.length; generationIndex++) {
        let generationId = generationIndex + 1;
        container.innerHTML += getGenerationTemplate(generationId);
    }
    console.log("rendered generations:", generations.length);
}

//--------------------------------------------------------------------------------------> render pokemon grid with limits
function renderPokemonGridWithLimiter(pokemonList, page) {
    let container = document.getElementById('pokemon_container');
    if (!container) {
        console.warn("pokemon container not found");
        return;
    }
    // Remove all state classes
    container.classList.remove('loading_state', 'error_state', 'has_overlay');
    if (!pokemonList || pokemonList.length === 0) {
        container.innerHTML = getNoPokemonTemplate();
        return;
    }
    let htmlString = '';
    for (let cardIndex = 0; cardIndex < pokemonList.length; cardIndex++) {
        htmlString += getPokemonCardTemplate(pokemonList[cardIndex]);
    }
    let totalPages = Math.ceil(totalPokemonInGeneration / pokemonPerPage);
    htmlString += getLimiterTemplate(page, totalPages, totalPokemonInGeneration);
    
    container.innerHTML = htmlString;
    console.log("rendered pokemon grid with Limiter:", pokemonList.length);
    addImageLoadingEffects();
}

//--------------------------------------------------------------------------------------> Add image loading effects
function addImageLoadingEffects() {
    let images = document.querySelectorAll('.pokemon_sprite_mini');
    for (let imgIndex = 0; imgIndex < images.length; imgIndex++) {
        let img = images[imgIndex];
        img.onload = function() {
            this.classList.add('loaded');
        };
        img.onerror = function() {
            this.classList.add('error');
            console.warn("failed to load image for:", this.alt);
        };
        
        img.classList.add('loading');
    }
}

//--------------------------------------------------------------------------------------> update active generation
function updateActiveGeneration(generationId) {
    let buttons = document.querySelectorAll('.generation_button');
    for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
        buttons[buttonIndex].classList.remove('active');
    }
    for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
        if (buttonIndex + 1 === generationId) {
            buttons[buttonIndex].classList.add('active');
        }
    }
}