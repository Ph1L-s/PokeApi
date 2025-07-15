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
    showLoading("initializing pokédx...");
    
    setupLoggerStatus();
    
    try {
        pokedexData = await initPokedex();
        if (pokedexData) {
            await handleSuccessfulInit();
        } else {
            showError("failed to load pokedex data. please refresh the page.");
        }
    } catch (error) {
        handleInitError(error);
        showError("failed to initialize app. please refresh the page.");
    }
}

//--------------------------------------------------------------------------------------> load generation 
async function loadGeneration(generationId) {
    showLoadingOverlay("loading generation...");
    
    resetSearchOnGenerationChange();
    
    try {
        let generationData = await getGenerationWithPokemon(generationId);
        if (generationData && generationData.pokemon_species) {
            await handleSuccessfulGenerationLoad(generationData, generationId);
        } else {
            showError("failed to load generation");
        }
    } catch (error) {
        handleGenerationLoadError(generationId, error);
        showError("failed to load generation. please try again.");
    } finally {
        hideLoadingOverlay();
    }
}

//--------------------------------------------------------------------------------------> load pokemon page 
async function loadPokemonPage(page) {
    try {
        let paginationData = calculatePagination(page, pokemonPerPage, sortedGenerationData.pokemon_species);
        let pokemonList = await getMultiplePokemon(paginationData.pokemonIds);
        renderPokemonGridWithLimiter(pokemonList, page);
        logPageLoadSuccess(page, pokemonList.length);
    } catch (error) {
        handlePageLoadError(page, error);
        showError("failed to load pokemon page. please try again.");
    }
}

//--------------------------------------------------------------------------------------> load next page
async function loadNextPage() {
    let totalPages = Math.ceil(totalPokemonInGeneration / pokemonPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        await handlePageLoad("next", currentPage, totalPages);
    }
}

//--------------------------------------------------------------------------------------> load previous page
async function loadPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        let totalPages = Math.ceil(totalPokemonInGeneration / pokemonPerPage);
        await handlePageLoad("previous", currentPage, totalPages);
    }
}

//--------------------------------------------------------------------------------------> show pokemon details
async function showPokemonDetails(pokemonId) {
    try {
        let pokemon = await getPokemonWithDetails(pokemonId);
        if (pokemon) {
            renderPokemonStats(pokemon);
        } else {
            showError("failed to load pokemon details");
        }
    } catch (error) {
        handlePokemonDetailsError(pokemonId, error);
        showError("failed to load pokemon details. please try again.");
    }
}

//--------------------------------------------------------------------------------------> load all generations handler 
async function loadAllGenerations() {
    showLoadingOverlay("loading all generations...");
    
    resetSearchOnGenerationChange();
    try {
        let allPokemonData = await getAllPokemonOverview();
        if (allPokemonData && allPokemonData.allSpecies) {
            await handleSuccessfulAllGenerationsLoad(allPokemonData);
        } else {
            showError("failed to load all generations overview");
        }
    } catch (error) {
        handleAllGenerationsLoadError(error);
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
        handleEmptySearch();
    } else {
        handleActiveSearch();
    }
}

//--------------------------------------------------------------------------------------> perform search
async function performSearch() {
    showLoadingOverlay("searching pokemon...");
    
    try {
        let searchResults = await executeSearch();
        await handleSearchResults(searchResults);
    } catch (error) {
        handleSearchError(error);
        showError("search failed. please try again.");
    } finally {
        hideLoadingOverlay();
    }
}

//--------------------------------------------------------------------------------------> handle search keydown
function handleSearchKeydown(event) {
    if (event.key === 'Enter') {
        handleEnterKey(event);
    } else if (event.key === 'Escape') {
        clearSearch();
    }
}

//--------------------------------------------------------------------------------------> clear search
function clearSearch() {
    let searchInput = document.getElementById('pokemon_search');
    searchInput.value = '';
    currentSearchTerm = "";
    
    clearSearchWithLogging();
    loadPokemonPage(1);
}

//--------------------------------------------------------------------------------------> reset search on generation change
function resetSearchOnGenerationChange() {
    let searchInput = document.getElementById('pokemon_search');
    if (searchInput) {
        searchInput.value = '';
    }
    currentSearchTerm = "";
    logSearchReset();
}

//--------------------------------------------------------------------------------------> update search info
function updateSearchInfo() {
    updateContentHeaderForSearch();
}

//--------------------------------------------------------------------------------------> update active generation button
function updateActiveGeneration(generationId) {
    removeActiveFromAllGenerationButtons();
    activateSpecificGenerationButton(generationId);
    logActiveGenerationUpdate(generationId);
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
        logSidebarToggle();
    }
}

//--------------------------------------------------------------------------------------> close sidebar
function closeSidebar() {
    let sidebar = document.getElementsByClassName('sidebar')[0];
    if (sidebar) {
        sidebar.classList.remove('show');
        logSidebarClose();
    }
}

//--------------------------------------------------------------------------------------> initialize compact sidebar
function initCompactSidebar() {
    let compactContainer = document.getElementById('compact_generations');
    if (compactContainer && pokedexData && pokedexData.generations) {
        compactContainer.innerHTML = getCompactGenerationsTemplate(pokedexData.generations);
        logCompactSidebarInit();
    }
}

//--------------------------------------------------------------------------------------> toggle logs
function toggleLogs() {
    logsEnabled = !logsEnabled;
    updateLoggerUI();
    updateAllLogSettings();
    logToggleLogsAction(logsEnabled);
}

//--------------------------------------------------------------------------------------> load evolution pokemon in same modal
async function loadEvolutionPokemon(pokemonId) {
    try {
        showEvolutionLoading();
        let pokemon = await getPokemonWithDetails(pokemonId);
        if (pokemon) {
            updateStatsModal(pokemon);
            logEvolutionPokemonSuccess(pokemon.name, pokemonId);
        } else {
            showEvolutionError("failed to load evolution pokemon");
        }
    } catch (error) {
        handleEvolutionPokemonError(pokemonId, error);
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
    updateStatsModalContent(statsContent, pokemon);
    
    logStatsModalUpdate(pokemon.name);
}

//--------------------------------------------------------------------------------------> show loading in evolution area
function showEvolutionLoading() {
    let evolutionContainer = findEvolutionContainer();
    if (evolutionContainer) {
        evolutionContainer.innerHTML = getEvolutionLoadingHTML();
        logEvolutionLoadingShow();
    }
}

//--------------------------------------------------------------------------------------> show evolution error
function showEvolutionError(message) {
    let evolutionContainer = findEvolutionContainer();
    if (evolutionContainer) {
        evolutionContainer.innerHTML = getEvolutionErrorHTML();
        logEvolutionErrorShow(message);
    }
}