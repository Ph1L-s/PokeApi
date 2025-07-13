/* script.js */
//--------------------------------------------------------------------------------------> global variables
let pokedexData = {};
let currentGeneration = 1;
let loadedPokemon = [];
let currentPage = 1;
let pokemonPerPage = 50; 
let totalPokemonInGeneration = 0;
let sortedGenerationData = {};
let currentSearchTerm = "";
let searchTimeout = null;

//--------------------------------------------------------------------------------------> app Initialization
async function init() {
    console.log("starting pokedex app...");
    showLoading("initializing pokédx...");
    
    try {
        pokedexData = await initPokedex();
        if (pokedexData) {
            renderGenerations(pokedexData.generations);
            await loadGeneration(1);
            console.log("app started successfully");
        } else {
            showError("failed to load pokedex data. please refresh the page.");
        }
    } catch (error) {
        console.error("app initialization failed:", error);
        showError("failed to initialize app. please refresh the page.");
    }
}

//--------------------------------------------------------------------------------------> load generation 
async function loadGeneration(generationId) {
    console.log("loading generation:", generationId);
    showLoadingOverlay("loading generation...");
    
    resetSearchOnGenerationChange();
    
    try {
        let generationData = await getGenerationWithPokemon(generationId);
        if (generationData && generationData.pokemon_species) {
            sortedGenerationData = processPokemonSpeciesData(generationData);
            totalPokemonInGeneration = sortedGenerationData.pokemon_species.length;
            currentGeneration = generationId;
            currentPage = 1;
            
            console.log("Generation " + generationId + " loaded with " + totalPokemonInGeneration + " pokemon");
            
            await loadPokemonPage(1);
            updateActiveGeneration(generationId);
            updateSearchInfo();
        } else {
            showError("failed to load generation");
        }
    } catch (error) {
        console.error("loadGeneration failed:", error);
        showError("failed to load generation. please try again.");
    } finally {
        hideLoadingOverlay();
    }
}

//--------------------------------------------------------------------------------------> load pokemon page 
async function loadPokemonPage(page) {
    console.log("loading page:", page);
    
    try {
        let paginationData = calculatePagination(page, pokemonPerPage, sortedGenerationData.pokemon_species);
        console.log("Page " + page + ": Index " + paginationData.startIndex + " to " + (paginationData.endIndex - 1));
        
        let pokemonList = await getMultiplePokemon(paginationData.pokemonIds);
        renderPokemonGridWithLimiter(pokemonList, page);
        console.log("page loaded:", page, pokemonList.length);
    } catch (error) {
        console.error("loadPokemonPage failed:", error);
        showError("failed to load pokemon page. please try again.");
    }
}

//--------------------------------------------------------------------------------------> load next page
async function loadNextPage() {
    let totalPages = Math.ceil(totalPokemonInGeneration / pokemonPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        showLoadingOverlay("loading next page...");
        try {
            await loadPokemonPage(currentPage);
        } catch (error) {
            console.error("loadNextPage failed:", error);
            showError("failed to load next page. please try again.");
            hideLoadingOverlay();
        }
    }
}

//--------------------------------------------------------------------------------------> load previous page
async function loadPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        showLoadingOverlay("loading previous page...");
        try {
            await loadPokemonPage(currentPage);
        } catch (error) {
            console.error("loadPreviousPage failed:", error);
            showError("failed to load previous page. please try again.");
            hideLoadingOverlay();
        }
    }
}

//--------------------------------------------------------------------------------------> show pokemon details
async function showPokemonDetails(pokemonId) {
    console.log("show details for pokemon:", pokemonId);
    
    try {
        let pokemon = await getPokemonWithDetails(pokemonId);
        if (pokemon) {
            renderPokemonStats(pokemon);
        } else {
            showError("failed to load pokemon details");
        }
    } catch (error) {
        console.error("showPokemonDetails failed:", error);
        showError("failed to load pokemon details. please try again.");
    }
}

//--------------------------------------------------------------------------------------> load all generations handler 
async function loadAllGenerations() {
    console.log("loading all generations overview...");
    showLoadingOverlay("loading all generations...");
    
    resetSearchOnGenerationChange();
    try {
        let allPokemonData = await getAllPokemonOverview();
        if (allPokemonData && allPokemonData.allSpecies) {
            sortedGenerationData = createAllGenerationsObject(allPokemonData.allSpecies);
            totalPokemonInGeneration = allPokemonData.allSpecies.length;
            currentGeneration = 'all';
            currentPage = 1;
            
            console.log("All generations data set:", totalPokemonInGeneration, "total pokemon");
            await loadPokemonPage(1);
            updateActiveGeneration('all');
            updateSearchInfo();
            
            console.log("all generations overview loaded with pagination");
        } else {
            showError("failed to load all generations overview");
        }
    } catch (error) {
        console.error("loadAllGenerations failed:", error);
        showError("failed to load all generations. please try again.");
    } finally {
        hideLoadingOverlay();
    }
}

//--------------------------------------------------------------------------------------> handle search input
function handleSearchInput() {
    let searchInput = document.getElementById('pokemon_search');
    let searchTerm = searchInput.value.trim();
    
    console.log("User typed:", searchTerm);
    currentSearchTerm = searchTerm.toLowerCase();

    if (currentSearchTerm === "") {
        console.log("Empty search - loading normal page");
        loadPokemonPage(1);
    } else {
        console.log("Starting search for:", currentSearchTerm);
        performSearch();
    }
}

//--------------------------------------------------------------------------------------> perform search
async function performSearch() {
    console.log("performing search in generation:", currentGeneration);
    showLoadingOverlay("searching pokemon...");
    
    try {
        let allPokemonIds = getAllPokemonIdsFromGeneration();
        let matchingPokemonIds = filterPokemonBySearchTerm(allPokemonIds);
        
        if (matchingPokemonIds.length > 0) {
            console.log("found", matchingPokemonIds.length, "matching pokemon");
            let pokemonList = await getMultiplePokemon(matchingPokemonIds);
            renderSearchResults(pokemonList);
        } else {
            console.log("no pokemon found for:", currentSearchTerm);
            renderNoSearchResults();
        }
    } catch (error) {
        console.error("search failed:", error);
        showError("search failed. please try again.");
    } finally {
        hideLoadingOverlay();
    }
}

//--------------------------------------------------------------------------------------> handle search keydown
function handleSearchKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let searchInput = document.getElementById('pokemon_search');
        currentSearchTerm = searchInput.value.trim().toLowerCase();
        if (currentSearchTerm === "") {
            loadPokemonPage(1);
        } else {
            performSearch();
        }
    } else if (event.key === 'Escape') {
        clearSearch();
    }
}

//--------------------------------------------------------------------------------------> clear search
function clearSearch() {
    let searchInput = document.getElementById('pokemon_search');
    searchInput.value = '';
    currentSearchTerm = "";
    
    console.log("clearing search - loading normal page");
    loadPokemonPage(1);
}

//--------------------------------------------------------------------------------------> reset search on generation change
function resetSearchOnGenerationChange() {
    let searchInput = document.getElementById('pokemon_search');
    if (searchInput) {
        searchInput.value = '';
    }
    currentSearchTerm = "";
    console.log("search reset due to generation change");
}

//--------------------------------------------------------------------------------------> update search info
function updateSearchInfo() {
    updateContentHeaderForSearch();
}

//--------------------------------------------------------------------------------------> update active generation button
function updateActiveGeneration(generationId) {
    console.log("updating active generation to:", generationId);
    console.log("Removing active class from all buttons");
    
    removeActiveFromAllGenerationButtons();
    activateSpecificGenerationButton(generationId);
}

//--------------------------------------------------------------------------------------> close pokemon stats
function closeStats() {
    let stats = document.getElementById('pokemon_stats');
    if (stats) {
        stats.classList.remove('active');
    }
}