//--------------------------------------------------------------------------------------> global variables script.js
let pokedexData = {};
let currentGeneration = 1;
let loadedPokemon = [];
let currentPage = 1;
let pokemonPerPage = 30;
let totalPokemonInGeneration = 0;
let sortedGenerationData = {};

//--------------------------------------------------------------------------------------> app Initialization
function init() {
    console.log("starting pokedex app...");
    showLoading("initializing pokédex...");
    
    initPokedex().then(function(data) {
        pokedexData = data;
        if (pokedexData) {
            renderGenerations(pokedexData.generations);
            loadGeneration(1);
            console.log("app started successfully");
        } else {
            showError("failed to load pokedex data. please refresh the page.");
        }
    });
}

//--------------------------------------------------------------------------------------> load generation 
function loadGeneration(generationId) {
    console.log("loading generation:", generationId);
    showLoadingOverlay("loading generation...");
    
    getGenerationWithPokemon(generationId).then(function(generationData) {
        if (generationData && generationData.pokemon_species) {
            // Sortiere Pokemon Species nach ID für korrekte Reihenfolge
            sortedGenerationData = processPokemonSpeciesData(generationData);
            totalPokemonInGeneration = sortedGenerationData.pokemon_species.length;
            currentGeneration = generationId;
            currentPage = 1;
            
            console.log("Generation " + generationId + " loaded with " + totalPokemonInGeneration + " pokemon");
            
            loadPokemonPage(1);
            updateActiveGeneration(generationId);
        } else {
            showError("failed to load generation");
        }
        hideLoadingOverlay();
    });
}

//--------------------------------------------------------------------------------------> load pokemon page 
function loadPokemonPage(page) {
    console.log("loading page:", page);
    
    // Berechne Pagination für aktuelle Seite
    let paginationData = calculatePagination(page, pokemonPerPage, sortedGenerationData.pokemon_species);
    console.log("Page " + page + ": Index " + paginationData.startIndex + " to " + (paginationData.endIndex - 1));
    
    getMultiplePokemon(paginationData.pokemonIds).then(function(pokemonList) {
        renderPokemonGridWithLimiter(pokemonList, page);
        console.log("page loaded:", page, pokemonList.length);
    });
}

//--------------------------------------------------------------------------------------> load next page
function loadNextPage() {
    let totalPages = Math.ceil(totalPokemonInGeneration / pokemonPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        showLoadingOverlay("loading next page...");
        loadPokemonPage(currentPage);
    }
}

//--------------------------------------------------------------------------------------> load previous page
function loadPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        showLoadingOverlay("loading previous page...");
        loadPokemonPage(currentPage);
    }
}

//--------------------------------------------------------------------------------------> process Pokemon Species Data
function processPokemonSpeciesData(generationData) {
    console.log("processing pokemon species data for sorting...");

    let pokemonSpeciesWithIds = [];
    for (let speciesIndex = 0; speciesIndex < generationData.pokemon_species.length; speciesIndex++) {
        let species = generationData.pokemon_species[speciesIndex];
        

        let urlParts = species.url.split('/');
        let pokemonId = parseInt(urlParts[urlParts.length - 2]);

        let pokemonWithId = {
            name: species.name,
            url: species.url,
            id: pokemonId
        };
        pokemonSpeciesWithIds.push(pokemonWithId);
        
        console.log("Processed Pokemon:", pokemonWithId.name, "ID:", pokemonWithId.id);
    }

    console.log("Sorting Pokemon by Pokedex ID...");
    pokemonSpeciesWithIds.sort(function(pokemonA, pokemonB) {
        return pokemonA.id - pokemonB.id;
    });
    
    console.log("First 5 Pokemon after sorting:");
    for (let debugIndex = 0; debugIndex < 5 && debugIndex < pokemonSpeciesWithIds.length; debugIndex++) {
        let pokemon = pokemonSpeciesWithIds[debugIndex];
        console.log("  " + (debugIndex + 1) + ". " + pokemon.name + " (ID: " + pokemon.id + ")");
    }

    let sortedGenerationData = {
        id: generationData.id,
        name: generationData.name,
        main_region: generationData.main_region,
        pokemon_species: pokemonSpeciesWithIds
    };
    
    console.log("Pokemon species sorting completed!");
    return sortedGenerationData;
}

//--------------------------------------------------------------------------------------> calculate Pagination Data 
function calculatePagination(page, itemsPerPage, pokemonSpeciesList) {
    console.log("calculating pagination for page:", page);
    
    let startIndex = (page - 1) * itemsPerPage;
    console.log("Start index:", startIndex);
    
    let endIndex = startIndex + itemsPerPage;
    if (endIndex > pokemonSpeciesList.length) {
        endIndex = pokemonSpeciesList.length;
    }
    console.log("End index:", endIndex);

    let pokemonIds = [];
    for (let index = startIndex; index < endIndex; index++) {
        let species = pokemonSpeciesList[index];
        pokemonIds.push(species.id);
        console.log("Added Pokemon ID to page:", species.id, "(" + species.name + ")");
    }

    let paginationResult = {
        startIndex: startIndex,
        endIndex: endIndex,
        pokemonIds: pokemonIds,
        totalItems: pokemonSpeciesList.length,
        currentPage: page,
        itemsOnThisPage: pokemonIds.length
    };
    
    console.log("Pagination calculated:", paginationResult.itemsOnThisPage, "items on page", page);
    return paginationResult;
}

//--------------------------------------------------------------------------------------> show pokemon details
function showPokemonDetails(pokemonId) {
    console.log("show details for pokemon:", pokemonId);
    
    getPokemonWithDetails(pokemonId).then(function(pokemon) {
        if (pokemon) {
            renderPokemonStats(pokemon);
        } else {
            showError("failed to load pokemon details");
        }
    });
}

//--------------------------------------------------------------------------------------> close pokemon stats
function closeStats() {
    let stats = document.getElementById('pokemon_stats');
    if (stats) {
        stats.classList.remove('active');
    }
}