//--------------------------------------------------------------------------------------> global variables script.js
let pokedexData = {};
let currentGeneration = 1;
let loadedPokemon = [];
let currentPage = 1;
let pokemonPerPage = 30;
let totalPokemonInGeneration = 0;

//--------------------------------------------------------------------------------------> app Initialization
async function init() {
    console.log("starting pokedex app...");
    showLoading("initializing pokédex...");
    pokedexData = await initPokedex();
    if (pokedexData) {
        renderGenerations(pokedexData.generations);
        await loadGeneration(1);
        console.log("app started successfully");
    } else {
        showError("failed to load pokedex data. please refresh the page.");
    }
}

//--------------------------------------------------------------------------------------> load generation with Limiter
async function loadGeneration(generationId) {
    console.log("loading generation:", generationId);
    showLoadingOverlay("loading generation...");
    let generationData = await getGenerationWithPokemon(generationId);
    
    if (generationData && generationData.pokemon_species) {
        totalPokemonInGeneration = generationData.pokemon_species.length;
        currentGeneration = generationId;
        currentPage = 1;
        await loadPokemonPage(generationData, 1);
        updateActiveGeneration(generationId);
    } else {
        showError("failed to load generation");
    }
    hideLoadingOverlay();
}

//--------------------------------------------------------------------------------------> load pokemon page
async function loadPokemonPage(generationData, page) {
    console.log("loading page:", page);
    let startIndex = (page - 1) * pokemonPerPage;
    let endIndex = Math.min(startIndex + pokemonPerPage, generationData.pokemon_species.length);
    let pokemonIds = [];
    for (let index = startIndex; index < endIndex; index++) {
        let species = generationData.pokemon_species[index];
        let urlParts = species.url.split('/');
        let pokemonId = parseInt(urlParts[urlParts.length - 2]);
        pokemonIds.push(pokemonId);
    }
    let pokemonList = await getMultiplePokemon(pokemonIds);
    renderPokemonGridWithLimiter(pokemonList, page);
    
    console.log("page loaded:", page, pokemonList.length);
}

//--------------------------------------------------------------------------------------> load next page
async function loadNextPage() {
    let totalPages = Math.ceil(totalPokemonInGeneration / pokemonPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        showLoadingOverlay("loading next page...");
        let generationData = await getGenerationWithPokemon(currentGeneration);
        await loadPokemonPage(generationData, currentPage);
        hideLoadingOverlay();
    }
}

//--------------------------------------------------------------------------------------> load previous page
async function loadPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        showLoadingOverlay("loading previous page...");
        let generationData = await getGenerationWithPokemon(currentGeneration);
        await loadPokemonPage(generationData, currentPage);
        hideLoadingOverlay();
    }
}

//--------------------------------------------------------------------------------------> show pokemon details
async function showPokemonDetails(pokemonId) {
    console.log("show details for pokemon:", pokemonId);
    let pokemon = await getPokemonWithDetails(pokemonId);
    if (pokemon) {
        renderPokemonStats(pokemon);
    } else {
        showError("failed to load pokemon details");
    }
}
//--------------------------------------------------------------------------------------> closepokemon stats
function closeStats() {
    let stats = document.getElementById('pokemon_stats');
    if (stats) {
        stats.classList.remove('active');
    }
}