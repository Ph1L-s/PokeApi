/*  script.js */

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
    logAppStart();
    showLoading("initializing pokédx...");
    
    let statusElement = document.getElementById('logs_status');
    if (statusElement && !logsEnabled) {
        statusElement.classList.add('disabled');
    }
    
    try {
        pokedexData = await initPokedex();
        if (pokedexData) {
            renderGenerations(pokedexData.generations);
            initCompactSidebar();
            await loadGeneration(1);
            logAppReady();
        } else {
            showError("failed to load pokedex data. please refresh the page.");
        }
    } catch (error) {
        logAppError("app initialization failed", error);
        showError("failed to initialize app. please refresh the page.");
    }
}

//--------------------------------------------------------------------------------------> load generation 
async function loadGeneration(generationId) {
    logGenerationStart(generationId);
    showLoadingOverlay("loading generation...");
    
    resetSearchOnGenerationChange();
    
    try {
        let generationData = await getGenerationWithPokemon(generationId);
        if (generationData && generationData.pokemon_species) {
            sortedGenerationData = processPokemonSpeciesData(generationData);
            totalPokemonInGeneration = sortedGenerationData.pokemon_species.length;
            currentGeneration = generationId;
            currentPage = 1;
            
            logGenerationSuccess(generationId, totalPokemonInGeneration);
            
            await loadPokemonPage(1);
            updateActiveGeneration(generationId);
            updateSearchInfo();
        } else {
            showError("failed to load generation");
        }
    } catch (error) {
        logGenerationError(generationId, error);
        showError("failed to load generation. please try again.");
    } finally {
        hideLoadingOverlay();
    }
}

//--------------------------------------------------------------------------------------> load pokemon page 
async function loadPokemonPage(page) {
    logPageStart("pokemon page " + page);
    
    try {
        let paginationData = calculatePagination(page, pokemonPerPage, sortedGenerationData.pokemon_species);
        
        let pokemonList = await getMultiplePokemon(paginationData.pokemonIds);
        renderPokemonGridWithLimiter(pokemonList, page);
        logPageSuccess("pokemon page " + page, pokemonList.length);
    } catch (error) {
        logPageError("pokemon page " + page, error);
        showError("failed to load pokemon page. please try again.");
    }
}

//--------------------------------------------------------------------------------------> load next page
async function loadNextPage() {
    let totalPages = Math.ceil(totalPokemonInGeneration / pokemonPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        showLoadingOverlay("loading next page...");
        logPaginationNext(currentPage, totalPages);
        try {
            await loadPokemonPage(currentPage);
        } catch (error) {
            logPageError("next page", error);
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
        logPaginationPrevious(currentPage, Math.ceil(totalPokemonInGeneration / pokemonPerPage));
        try {
            await loadPokemonPage(currentPage);
        } catch (error) {
            logPageError("previous page", error);
            showError("failed to load previous page. please try again.");
            hideLoadingOverlay();
        }
    }
}

//--------------------------------------------------------------------------------------> show pokemon details
async function showPokemonDetails(pokemonId) {
    logPokemonDetailsStart(pokemonId);
    
    try {
        let pokemon = await getPokemonWithDetails(pokemonId);
        if (pokemon) {
            renderPokemonStats(pokemon);
        } else {
            showError("failed to load pokemon details");
        }
    } catch (error) {
        logPokemonDetailsError(pokemonId, error);
        showError("failed to load pokemon details. please try again.");
    }
}

//--------------------------------------------------------------------------------------> load all generations handler 
async function loadAllGenerations() {
    logGenerationStart('all');
    showLoadingOverlay("loading all generations...");
    
    resetSearchOnGenerationChange();
    try {
        let allPokemonData = await getAllPokemonOverview();
        if (allPokemonData && allPokemonData.allSpecies) {
            sortedGenerationData = createAllGenerationsObject(allPokemonData.allSpecies);
            totalPokemonInGeneration = allPokemonData.allSpecies.length;
            currentGeneration = 'all';
            currentPage = 1;
            
            logGenerationSuccess('all', totalPokemonInGeneration);
            await loadPokemonPage(1);
            updateActiveGeneration('all');
            updateSearchInfo();
        } else {
            showError("failed to load all generations overview");
        }
    } catch (error) {
        logGenerationError('all', error);
        showError("failed to load all generations. please try again.");
    } finally {
        hideLoadingOverlay();
    }
}

//--------------------------------------------------------------------------------------> handle search input
function handleSearchInput() {
    let searchInput = document.getElementById('pokemon_search');
    let searchTerm = searchInput.value.trim();
    
    currentSearchTerm = searchTerm.toLowerCase();

    if (currentSearchTerm === "") {
        logSearchMessage("Empty search - loading normal page");
        loadPokemonPage(1);
    } else {
        logSearchMessage("Starting search for: " + currentSearchTerm);
        performSearch();
    }
}

//--------------------------------------------------------------------------------------> perform search
async function performSearch() {
    logSearchStart(currentSearchTerm, currentGeneration);
    showLoadingOverlay("searching pokemon...");
    
    try {
        let allPokemonIds = getAllPokemonIdsFromGeneration();
        let matchingPokemonIds = filterPokemonBySearchTerm(allPokemonIds);
        
        if (matchingPokemonIds.length > 0) {
            logSearchSuccess(currentSearchTerm, matchingPokemonIds.length);
            let pokemonList = await getMultiplePokemon(matchingPokemonIds);
            renderSearchResults(pokemonList);
        } else {
            logSearchEmpty(currentSearchTerm);
            renderNoSearchResults();
        }
    } catch (error) {
        logSearchError(currentSearchTerm, error);
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
    
    logSearchMessage("clearing search - loading normal page");
    loadPokemonPage(1);
}

//--------------------------------------------------------------------------------------> reset search on generation change
function resetSearchOnGenerationChange() {
    let searchInput = document.getElementById('pokemon_search');
    if (searchInput) {
        searchInput.value = '';
    }
    currentSearchTerm = "";
    logSearchMessage("search reset due to generation change");
}

//--------------------------------------------------------------------------------------> update search info
function updateSearchInfo() {
    updateContentHeaderForSearch();
}

//--------------------------------------------------------------------------------------> update active generation button
function updateActiveGeneration(generationId) {
    logRenderMessage("updating active generation to: " + generationId);
    
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

//--------------------------------------------------------------------------------------> toggle sidebar
function toggleSidebar() {
    let sidebar = document.getElementsByClassName('sidebar')[0];
    if (sidebar) {
        sidebar.classList.toggle('show');
        logRenderMessage("Sidebar toggled");
    }
}

//--------------------------------------------------------------------------------------> close sidebar
function closeSidebar() {
    let sidebar = document.getElementsByClassName('sidebar')[0];
    if (sidebar) {
        sidebar.classList.remove('show');
        logRenderMessage("Sidebar closed");
    }
}

//--------------------------------------------------------------------------------------> initialize compact sidebar
function initCompactSidebar() {
    let compactContainer = document.getElementById('compact_generations');
    if (compactContainer && pokedexData && pokedexData.generations) {
        compactContainer.innerHTML = getCompactGenerationsTemplate(pokedexData.generations);
        logRenderMessage("Compact sidebar initialized");
    }
}

//--------------------------------------------------------------------------------------> toggle logs
function toggleLogs() {
    logsEnabled = !logsEnabled;

    let statusElement = document.getElementById('logs_status');
    if (statusElement) {
        if (logsEnabled) {
            statusElement.classList.remove('disabled');
        } else {
            statusElement.classList.add('disabled');
        }
    }
    
    apiLogs = logsEnabled;
    renderLogs = logsEnabled;
    pageLogs = logsEnabled;
    generationLogs = logsEnabled;
    searchLogs = logsEnabled;
    pokemonLogs = logsEnabled;
    loadingLogs = logsEnabled;
    paginationLogs = logsEnabled;
    evolutionLogs = logsEnabled;
    appLogs = logsEnabled;
    errorLogs = logsEnabled;
    
    logAppMessage('All logs ' + (logsEnabled ? 'enabled' : 'disabled'));
}

//--------------------------------------------------------------------------------------> load evolution pokemon in same modal
async function loadEvolutionPokemon(pokemonId) {
    logPokemonDetailsStart(pokemonId);
    
    try {
        showEvolutionLoading();
        
        let pokemon = await getPokemonWithDetails(pokemonId);
        if (pokemon) {
            updateStatsModal(pokemon);
            logPokemonDetailsSuccess(pokemon.name, pokemonId);
        } else {
            showEvolutionError("failed to load evolution pokemon");
        }
    } catch (error) {
        logPokemonDetailsError(pokemonId, error);
        showEvolutionError("failed to load evolution pokemon. please try again.");
    }
}

//--------------------------------------------------------------------------------------> update existing stats modal content
function updateStatsModal(pokemon) {
    let statsContent = findStatsContentContainer();
    if (!statsContent) {
        return;
    }
    
    updateStatsModalPrimaryType(statsContent, pokemon);
    
    let modalData = prepareStatsModalContentData(pokemon);
    statsContent.innerHTML = getStatsModalContentHTML(
        pokemon, 
        modalData.sprites, 
        modalData.typeBadgesHTML, 
        modalData.abilityString, 
        modalData.pokemonHeight, 
        modalData.pokemonWeight, 
        modalData.evolutionChain
    );
    
    logRenderSuccess("updated stats modal for " + pokemon.name);
}

//--------------------------------------------------------------------------------------> show loading in evolution area
function showEvolutionLoading() {
    let evolutionContainer = findEvolutionContainer();
    if (evolutionContainer) {
        evolutionContainer.innerHTML = getEvolutionLoadingHTML();
        logLoadingShow("evolution pokemon loading");
    }
}

//--------------------------------------------------------------------------------------> show evolution error
function showEvolutionError(message) {
    let evolutionContainer = findEvolutionContainer();
    if (evolutionContainer) {
        evolutionContainer.innerHTML = getEvolutionErrorHTML();
        logErrorMessage("evolution loading error: " + message);
    }
}