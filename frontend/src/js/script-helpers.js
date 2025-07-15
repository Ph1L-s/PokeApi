/*  script-helpers.js */

//--------------------------------------------------------------------------------------> setup logger status on init
function setupLoggerStatus() {
    let statusElement = document.getElementById('logs_status');
    if (statusElement && !logsEnabled) {
        statusElement.classList.add('disabled');
    }
}

//--------------------------------------------------------------------------------------> handle successful app initialization
async function handleSuccessfulInit() {
    logAppStart();
    renderGenerations(pokedexData.generations);
    initCompactSidebar();
    await loadGeneration(1);
    logAppReady();
}

//--------------------------------------------------------------------------------------> handle init error
function handleInitError(error) {
    logAppError("app initialization failed", error);
}

//--------------------------------------------------------------------------------------> handle successful generation load
async function handleSuccessfulGenerationLoad(generationData, generationId) {
    logGenerationStart(generationId);
    sortedGenerationData = processPokemonSpeciesData(generationData);
    totalPokemonInGeneration = sortedGenerationData.pokemon_species.length;
    currentGeneration = generationId;
    currentPage = 1;
    
    logGenerationSuccess(generationId, totalPokemonInGeneration);
    
    await loadPokemonPage(1);
    updateActiveGeneration(generationId);
    updateSearchInfo();
}

//--------------------------------------------------------------------------------------> handle generation load error
function handleGenerationLoadError(generationId, error) {
    logGenerationError(generationId, error);
}

//--------------------------------------------------------------------------------------> handle successful all generations load
async function handleSuccessfulAllGenerationsLoad(allPokemonData) {
    logGenerationStart('all');
    sortedGenerationData = createAllGenerationsObject(allPokemonData.allSpecies);
    totalPokemonInGeneration = allPokemonData.allSpecies.length;
    currentGeneration = 'all';
    currentPage = 1;
    
    logGenerationSuccess('all', totalPokemonInGeneration);
    await loadPokemonPage(1);
    updateActiveGeneration('all');
    updateSearchInfo();
}

//--------------------------------------------------------------------------------------> handle all generations load error
function handleAllGenerationsLoadError(error) {
    logGenerationError('all', error);
}

//--------------------------------------------------------------------------------------> log page load success
function logPageLoadSuccess(page, pokemonCount) {
    logPageStart("pokemon page " + page);
    logPageSuccess("pokemon page " + page, pokemonCount);
}

//--------------------------------------------------------------------------------------> handle page load error
function handlePageLoadError(page, error) {
    logPageError("pokemon page " + page, error);
}

//--------------------------------------------------------------------------------------> handle pokemon details error
function handlePokemonDetailsError(pokemonId, error) {
    logPokemonDetailsStart(pokemonId);
    logPokemonDetailsError(pokemonId, error);
}

//--------------------------------------------------------------------------------------> handle page load with loading overlay
async function handlePageLoad(direction, page, totalPages) {
    showLoadingOverlay("loading " + direction + " page...");
    if (direction === "next") {
        logPaginationNext(page, totalPages);
    } else {
        logPaginationPrevious(page, totalPages);
    }
    
    try {
        await loadPokemonPage(page);
    } catch (error) {
        logPageError(direction + " page", error);
        showError("failed to load " + direction + " page. please try again.");
        hideLoadingOverlay();
    }
}

//--------------------------------------------------------------------------------------> handle empty search
function handleEmptySearch() {
    logSearchMessage("Empty search - loading normal page");
    loadPokemonPage(1);
}

//--------------------------------------------------------------------------------------> handle active search
function handleActiveSearch() {
    logSearchMessage("Starting search for: " + currentSearchTerm);
    performSearch();
}

//--------------------------------------------------------------------------------------> execute search and return results
async function executeSearch() {
    logSearchStart(currentSearchTerm, currentGeneration);
    let allPokemonIds = getAllPokemonIdsFromGeneration();
    let matchingPokemonIds = filterPokemonBySearchTerm(allPokemonIds);
    return matchingPokemonIds;
}

//--------------------------------------------------------------------------------------> handle search results
async function handleSearchResults(matchingPokemonIds) {
    if (matchingPokemonIds.length > 0) {
        logSearchSuccess(currentSearchTerm, matchingPokemonIds.length);
        let pokemonList = await getMultiplePokemon(matchingPokemonIds);
        renderSearchResults(pokemonList);
    } else {
        logSearchEmpty(currentSearchTerm);
        renderNoSearchResults();
    }
}

//--------------------------------------------------------------------------------------> handle search error
function handleSearchError(error) {
    logSearchError(currentSearchTerm, error);
}

//--------------------------------------------------------------------------------------> handle enter key in search
function handleEnterKey(event) {
    event.preventDefault();
    let searchInput = document.getElementById('pokemon_search');
    currentSearchTerm = searchInput.value.trim().toLowerCase();
    if (currentSearchTerm === "") {
        loadPokemonPage(1);
    } else {
        performSearch();
    }
}

//--------------------------------------------------------------------------------------> clear search with logging
function clearSearchWithLogging() {
    logSearchMessage("clearing search - loading normal page");
}

//--------------------------------------------------------------------------------------> log search reset
function logSearchReset() {
    logSearchMessage("search reset due to generation change");
}

//--------------------------------------------------------------------------------------> log active generation update
function logActiveGenerationUpdate(generationId) {
    logRenderMessage("updating active generation to: " + generationId);
}

//--------------------------------------------------------------------------------------> log sidebar toggle
function logSidebarToggle() {
    logRenderMessage("Sidebar toggled");
}

//--------------------------------------------------------------------------------------> log sidebar close
function logSidebarClose() {
    logRenderMessage("Sidebar closed");
}

//--------------------------------------------------------------------------------------> log compact sidebar init
function logCompactSidebarInit() {
    logRenderMessage("Compact sidebar initialized");
}

//--------------------------------------------------------------------------------------> log toggle logs action
function logToggleLogsAction(enabled) {
    logAppMessage('All logs ' + (enabled ? 'enabled' : 'disabled'));
}

//--------------------------------------------------------------------------------------> log evolution pokemon success
function logEvolutionPokemonSuccess(pokemonName, pokemonId) {
    logPokemonDetailsStart(pokemonId);
    logPokemonDetailsSuccess(pokemonName, pokemonId);
}

//--------------------------------------------------------------------------------------> handle evolution pokemon error
function handleEvolutionPokemonError(pokemonId, error) {
    logPokemonDetailsStart(pokemonId);
    logPokemonDetailsError(pokemonId, error);
}

//--------------------------------------------------------------------------------------> log stats modal update
function logStatsModalUpdate(pokemonName) {
    logRenderSuccess("updated stats modal for " + pokemonName);
}

//--------------------------------------------------------------------------------------> log evolution loading show
function logEvolutionLoadingShow() {
    logLoadingShow("evolution pokemon loading");
}

//--------------------------------------------------------------------------------------> log evolution error show
function logEvolutionErrorShow(message) {
    logErrorMessage("evolution loading error: " + message);
}

//--------------------------------------------------------------------------------------> update logger UI status
function updateLoggerUI() {
    let statusElement = document.getElementById('logs_status');
    if (statusElement) {
        if (logsEnabled) {
            statusElement.classList.remove('disabled');
        } else {
            statusElement.classList.add('disabled');
        }
    }
}

//--------------------------------------------------------------------------------------> update all log settings
function updateAllLogSettings() {
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
}

//--------------------------------------------------------------------------------------> update stats modal content
function updateStatsModalContent(statsContent, pokemon) {
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
}

//--------------------------------------------------------------------------------------> create all generations object
function createAllGenerationsObject(allSpecies) {
    let sortedGenerationData = new Object();
    sortedGenerationData.id = 'all';
    sortedGenerationData.name = 'all-generations';
    sortedGenerationData.pokemon_species = allSpecies;
    
    return sortedGenerationData;
}

//--------------------------------------------------------------------------------------> get all pokemon IDs from current generation
function getAllPokemonIdsFromGeneration() {
    let allPokemonIds = [];
    for (let speciesIndex = 0; speciesIndex < sortedGenerationData.pokemon_species.length; speciesIndex++) {
        let species = sortedGenerationData.pokemon_species[speciesIndex];
        allPokemonIds.push(species.id);
    }
    logSearchMessage("searching through " + allPokemonIds.length + " pokemon in current generation");
    return allPokemonIds;
}

//--------------------------------------------------------------------------------------> filter pokemon by search term
function filterPokemonBySearchTerm(allPokemonIds) {
    let matchingIds = [];
    
    for (let idIndex = 0; idIndex < allPokemonIds.length; idIndex++) {
        let pokemonId = allPokemonIds[idIndex];
        let species = findSpeciesById(pokemonId);
        
        if (species && shouldIncludePokemon(species, pokemonId)) {
            matchingIds.push(pokemonId);
            logSearchMessage("match found: " + species.name + " (#" + pokemonId + ")");
        }
    }
    
    return matchingIds;
}

//--------------------------------------------------------------------------------------> check if pokemon should be included in search
function shouldIncludePokemon(species, pokemonId) {
    if (isNumericSearch(currentSearchTerm)) {
        return pokemonId.toString().includes(currentSearchTerm);
    } else {
        return species.name.toLowerCase().includes(currentSearchTerm);
    }
}

//--------------------------------------------------------------------------------------> find species by ID
function findSpeciesById(pokemonId) {
    for (let speciesIndex = 0; speciesIndex < sortedGenerationData.pokemon_species.length; speciesIndex++) {
        let species = sortedGenerationData.pokemon_species[speciesIndex];
        if (species.id === pokemonId) {
            return species;
        }
    }
    return null;
}

//--------------------------------------------------------------------------------------> check if search is numeric
function isNumericSearch(searchTerm) {
    for (let characterIndex = 0; characterIndex < searchTerm.length; characterIndex++) {
        let currentCharacter = searchTerm[characterIndex];
        
        if (currentCharacter < '0' || currentCharacter > '9') {
            return false;
        }
    }
    
    logSearchMessage("numeric search detected: " + searchTerm);
    return true;
}

//--------------------------------------------------------------------------------------> process poke species-data
function processPokemonSpeciesData(generationData) {
    logGenerationMessage("processing pokemon species data for sorting");

    let pokemonSpeciesWithIds = extractPokemonSpeciesWithIds(generationData);
    pokemonSpeciesWithIds.sort(sortPokemonById);

    let sortedGenerationData = buildSortedGenerationData(generationData, pokemonSpeciesWithIds);
    
    logGenerationMessage("pokemon species sorting completed");
    return sortedGenerationData;
}

//--------------------------------------------------------------------------------------> extract pokemon species with IDs
function extractPokemonSpeciesWithIds(generationData) {
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
    }
    
    return pokemonSpeciesWithIds;
}

//--------------------------------------------------------------------------------------> sort pokemon by ID
function sortPokemonById(pokemonA, pokemonB) {
    return pokemonA.id - pokemonB.id;
}

//--------------------------------------------------------------------------------------> build sorted generation data object
function buildSortedGenerationData(generationData, pokemonSpeciesWithIds) {
    return {
        id: generationData.id,
        name: generationData.name,
        main_region: generationData.main_region,
        pokemon_species: pokemonSpeciesWithIds
    };
}

//--------------------------------------------------------------------------------------> calculate agination-data 
function calculatePagination(page, itemsPerPage, pokemonSpeciesList) {
    logPaginationMessage("calculating pagination for page: " + page);
    
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = Math.min(startIndex + itemsPerPage, pokemonSpeciesList.length);

    let pokemonIds = extractPokemonIdsFromRange(pokemonSpeciesList, startIndex, endIndex);

    let paginationResult = buildPaginationResult(startIndex, endIndex, pokemonIds, pokemonSpeciesList.length, page);
    
    logPaginationMessage("pagination calculated: " + paginationResult.itemsOnThisPage + " items on page " + page);
    return paginationResult;
}

//--------------------------------------------------------------------------------------> extract pokemon IDs from range
function extractPokemonIdsFromRange(pokemonSpeciesList, startIndex, endIndex) {
    let pokemonIds = [];
    for (let index = startIndex; index < endIndex; index++) {
        let species = pokemonSpeciesList[index];
        pokemonIds.push(species.id);
    }
    return pokemonIds;
}

//--------------------------------------------------------------------------------------> build pagination result object
function buildPaginationResult(startIndex, endIndex, pokemonIds, totalItems, currentPage) {
    return {
        startIndex: startIndex,
        endIndex: endIndex,
        pokemonIds: pokemonIds,
        totalItems: totalItems,
        currentPage: currentPage,
        itemsOnThisPage: pokemonIds.length
    };
}

//--------------------------------------------------------------------------------------> prepare stats modal content data
function prepareStatsModalContentData(pokemon) {
    let sprites = getPokemonSprites(pokemon.id);
    let typeBadges = extractTypeBadges(pokemon);
    let abilities = extractAbilities(pokemon);
    
    let typeBadgesHTML = typeBadges.join(' ');
    let abilityString = abilities.join(', ');
    let pokemonHeight = pokemon.height / 10;
    let pokemonWeight = pokemon.weight / 10;
    const evolutionChain = parseEvolutionChain(pokemon.evolution_chain);
    
    return buildStatsModalData(sprites, typeBadgesHTML, abilityString, pokemonHeight, pokemonWeight, evolutionChain);
}

//--------------------------------------------------------------------------------------> extract type badges from pokemon
function extractTypeBadges(pokemon) {
    let typeBadges = [];
    for (let typeIndex = 0; typeIndex < pokemon.types.length; typeIndex++) {
        let typeName = pokemon.types[typeIndex].type.name;
        typeBadges.push(getTypeBadgeHTML(typeName)); 
    }
    return typeBadges;
}

//--------------------------------------------------------------------------------------> extract abilities from pokemon
function extractAbilities(pokemon) {
    let abilities = [];
    for (let abilityIndex = 0; abilityIndex < pokemon.abilities.length; abilityIndex++) {
        abilities.push(pokemon.abilities[abilityIndex].ability.name);
    }
    return abilities;
}

//--------------------------------------------------------------------------------------> build stats modal data object
function buildStatsModalData(sprites, typeBadgesHTML, abilityString, pokemonHeight, pokemonWeight, evolutionChain) {
    return {
        sprites: sprites,
        typeBadgesHTML: typeBadgesHTML,
        abilityString: abilityString,
        pokemonHeight: pokemonHeight,
        pokemonWeight: pokemonWeight,
        evolutionChain: evolutionChain
    };
}

//--------------------------------------------------------------------------------------> find stats content container
function findStatsContentContainer() {
    let statsContent = document.getElementsByClassName('stats_content')[0];
    if (!statsContent) {
        logErrorMessage("stats content container not found");
        return null;
    }
    return statsContent;
}

//--------------------------------------------------------------------------------------> find evolution container
function findEvolutionContainer() {
    let evolutionContainer = document.getElementsByClassName('evolution_chain')[0];
    if (!evolutionContainer) {
        logErrorMessage("evolution container not found");
        return null;
    }
    return evolutionContainer;
}

//--------------------------------------------------------------------------------------> update stats modal primary type
function updateStatsModalPrimaryType(statsContent, pokemon) {
    let primaryType = pokemon.types[0].type.name;
    statsContent.setAttribute('data-primary-type', primaryType);
}/*  script-helpers.js */

//--------------------------------------------------------------------------------------> setup logger status on init
function setupLoggerStatus() {
    let statusElement = document.getElementById('logs_status');
    if (statusElement && !logsEnabled) {
        statusElement.classList.add('disabled');
    }
}

//--------------------------------------------------------------------------------------> handle successful app initialization
async function handleSuccessfulInit() {
    renderGenerations(pokedexData.generations);
    initCompactSidebar();
    await loadGeneration(1);
}

//--------------------------------------------------------------------------------------> handle successful generation load
async function handleSuccessfulGenerationLoad(generationData, generationId) {
    sortedGenerationData = processPokemonSpeciesData(generationData);
    totalPokemonInGeneration = sortedGenerationData.pokemon_species.length;
    currentGeneration = generationId;
    currentPage = 1;
    
    logGenerationSuccess(generationId, totalPokemonInGeneration);
    
    await loadPokemonPage(1);
    updateActiveGeneration(generationId);
    updateSearchInfo();
}

//--------------------------------------------------------------------------------------> handle successful all generations load
async function handleSuccessfulAllGenerationsLoad(allPokemonData) {
    sortedGenerationData = createAllGenerationsObject(allPokemonData.allSpecies);
    totalPokemonInGeneration = allPokemonData.allSpecies.length;
    currentGeneration = 'all';
    currentPage = 1;
    
    logGenerationSuccess('all', totalPokemonInGeneration);
    await loadPokemonPage(1);
    updateActiveGeneration('all');
    updateSearchInfo();
}

//--------------------------------------------------------------------------------------> handle page load with loading overlay
async function handlePageLoad(direction, page, totalPages) {
    showLoadingOverlay("loading " + direction + " page...");
    if (direction === "next") {
        logPaginationNext(page, totalPages);
    } else {
        logPaginationPrevious(page, totalPages);
    }
    
    try {
        await loadPokemonPage(page);
    } catch (error) {
        logPageError(direction + " page", error);
        showError("failed to load " + direction + " page. please try again.");
        hideLoadingOverlay();
    }
}

//--------------------------------------------------------------------------------------> handle empty search
function handleEmptySearch() {
    logSearchMessage("Empty search - loading normal page");
    loadPokemonPage(1);
}

//--------------------------------------------------------------------------------------> handle active search
function handleActiveSearch() {
    logSearchMessage("Starting search for: " + currentSearchTerm);
    performSearch();
}

//--------------------------------------------------------------------------------------> execute search and return results
async function executeSearch() {
    let allPokemonIds = getAllPokemonIdsFromGeneration();
    let matchingPokemonIds = filterPokemonBySearchTerm(allPokemonIds);
    return matchingPokemonIds;
}

//--------------------------------------------------------------------------------------> handle search results
async function handleSearchResults(matchingPokemonIds) {
    if (matchingPokemonIds.length > 0) {
        logSearchSuccess(currentSearchTerm, matchingPokemonIds.length);
        let pokemonList = await getMultiplePokemon(matchingPokemonIds);
        renderSearchResults(pokemonList);
    } else {
        logSearchEmpty(currentSearchTerm);
        renderNoSearchResults();
    }
}

//--------------------------------------------------------------------------------------> handle enter key in search
function handleEnterKey(event) {
    event.preventDefault();
    let searchInput = document.getElementById('pokemon_search');
    currentSearchTerm = searchInput.value.trim().toLowerCase();
    if (currentSearchTerm === "") {
        loadPokemonPage(1);
    } else {
        performSearch();
    }
}

//--------------------------------------------------------------------------------------> update logger UI status
function updateLoggerUI() {
    let statusElement = document.getElementById('logs_status');
    if (statusElement) {
        if (logsEnabled) {
            statusElement.classList.remove('disabled');
        } else {
            statusElement.classList.add('disabled');
        }
    }
}

//--------------------------------------------------------------------------------------> update all log settings
function updateAllLogSettings() {
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
}

//--------------------------------------------------------------------------------------> update stats modal content
function updateStatsModalContent(statsContent, pokemon) {
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
}

//--------------------------------------------------------------------------------------> create all generations object
function createAllGenerationsObject(allSpecies) {
    let sortedGenerationData = new Object();
    sortedGenerationData.id = 'all';
    sortedGenerationData.name = 'all-generations';
    sortedGenerationData.pokemon_species = allSpecies;
    
    return sortedGenerationData;
}

//--------------------------------------------------------------------------------------> get all pokemon IDs from current generation
function getAllPokemonIdsFromGeneration() {
    let allPokemonIds = [];
    for (let speciesIndex = 0; speciesIndex < sortedGenerationData.pokemon_species.length; speciesIndex++) {
        let species = sortedGenerationData.pokemon_species[speciesIndex];
        allPokemonIds.push(species.id);
    }
    logSearchMessage("searching through " + allPokemonIds.length + " pokemon in current generation");
    return allPokemonIds;
}

//--------------------------------------------------------------------------------------> filter pokemon by search term
function filterPokemonBySearchTerm(allPokemonIds) {
    let matchingIds = [];
    
    for (let idIndex = 0; idIndex < allPokemonIds.length; idIndex++) {
        let pokemonId = allPokemonIds[idIndex];
        let species = findSpeciesById(pokemonId);
        
        if (species && shouldIncludePokemon(species, pokemonId)) {
            matchingIds.push(pokemonId);
            logSearchMessage("match found: " + species.name + " (#" + pokemonId + ")");
        }
    }
    
    return matchingIds;
}

//--------------------------------------------------------------------------------------> check if pokemon should be included in search
function shouldIncludePokemon(species, pokemonId) {
    if (isNumericSearch(currentSearchTerm)) {
        return pokemonId.toString().includes(currentSearchTerm);
    } else {
        return species.name.toLowerCase().includes(currentSearchTerm);
    }
}

//--------------------------------------------------------------------------------------> find species by ID
function findSpeciesById(pokemonId) {
    for (let speciesIndex = 0; speciesIndex < sortedGenerationData.pokemon_species.length; speciesIndex++) {
        let species = sortedGenerationData.pokemon_species[speciesIndex];
        if (species.id === pokemonId) {
            return species;
        }
    }
    return null;
}

//--------------------------------------------------------------------------------------> check if search is numeric
function isNumericSearch(searchTerm) {
    for (let characterIndex = 0; characterIndex < searchTerm.length; characterIndex++) {
        let currentCharacter = searchTerm[characterIndex];
        
        if (currentCharacter < '0' || currentCharacter > '9') {
            return false;
        }
    }
    
    logSearchMessage("numeric search detected: " + searchTerm);
    return true;
}

//--------------------------------------------------------------------------------------> process poke species-data
function processPokemonSpeciesData(generationData) {
    logGenerationMessage("processing pokemon species data for sorting");

    let pokemonSpeciesWithIds = extractPokemonSpeciesWithIds(generationData);
    pokemonSpeciesWithIds.sort(sortPokemonById);

    let sortedGenerationData = buildSortedGenerationData(generationData, pokemonSpeciesWithIds);
    
    logGenerationMessage("pokemon species sorting completed");
    return sortedGenerationData;
}

//--------------------------------------------------------------------------------------> extract pokemon species with IDs
function extractPokemonSpeciesWithIds(generationData) {
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
    }
    
    return pokemonSpeciesWithIds;
}

//--------------------------------------------------------------------------------------> sort pokemon by ID
function sortPokemonById(pokemonA, pokemonB) {
    return pokemonA.id - pokemonB.id;
}

//--------------------------------------------------------------------------------------> build sorted generation data object
function buildSortedGenerationData(generationData, pokemonSpeciesWithIds) {
    return {
        id: generationData.id,
        name: generationData.name,
        main_region: generationData.main_region,
        pokemon_species: pokemonSpeciesWithIds
    };
}

//--------------------------------------------------------------------------------------> calculate agination-data 
function calculatePagination(page, itemsPerPage, pokemonSpeciesList) {
    logPaginationMessage("calculating pagination for page: " + page);
    
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = Math.min(startIndex + itemsPerPage, pokemonSpeciesList.length);

    let pokemonIds = extractPokemonIdsFromRange(pokemonSpeciesList, startIndex, endIndex);

    let paginationResult = buildPaginationResult(startIndex, endIndex, pokemonIds, pokemonSpeciesList.length, page);
    
    logPaginationMessage("pagination calculated: " + paginationResult.itemsOnThisPage + " items on page " + page);
    return paginationResult;
}

//--------------------------------------------------------------------------------------> extract pokemon IDs from range
function extractPokemonIdsFromRange(pokemonSpeciesList, startIndex, endIndex) {
    let pokemonIds = [];
    for (let index = startIndex; index < endIndex; index++) {
        let species = pokemonSpeciesList[index];
        pokemonIds.push(species.id);
    }
    return pokemonIds;
}

//--------------------------------------------------------------------------------------> build pagination result object
function buildPaginationResult(startIndex, endIndex, pokemonIds, totalItems, currentPage) {
    return {
        startIndex: startIndex,
        endIndex: endIndex,
        pokemonIds: pokemonIds,
        totalItems: totalItems,
        currentPage: currentPage,
        itemsOnThisPage: pokemonIds.length
    };
}

//--------------------------------------------------------------------------------------> prepare stats modal content data
function prepareStatsModalContentData(pokemon) {
    let sprites = getPokemonSprites(pokemon.id);
    let typeBadges = extractTypeBadges(pokemon);
    let abilities = extractAbilities(pokemon);
    
    let typeBadgesHTML = typeBadges.join(' ');
    let abilityString = abilities.join(', ');
    let pokemonHeight = pokemon.height / 10;
    let pokemonWeight = pokemon.weight / 10;
    const evolutionChain = parseEvolutionChain(pokemon.evolution_chain);
    
    return buildStatsModalData(sprites, typeBadgesHTML, abilityString, pokemonHeight, pokemonWeight, evolutionChain);
}

//--------------------------------------------------------------------------------------> extract type badges from pokemon
function extractTypeBadges(pokemon) {
    let typeBadges = [];
    for (let typeIndex = 0; typeIndex < pokemon.types.length; typeIndex++) {
        let typeName = pokemon.types[typeIndex].type.name;
        typeBadges.push(getTypeBadgeHTML(typeName)); 
    }
    return typeBadges;
}

//--------------------------------------------------------------------------------------> extract abilities from pokemon
function extractAbilities(pokemon) {
    let abilities = [];
    for (let abilityIndex = 0; abilityIndex < pokemon.abilities.length; abilityIndex++) {
        abilities.push(pokemon.abilities[abilityIndex].ability.name);
    }
    return abilities;
}

//--------------------------------------------------------------------------------------> build stats modal data object
function buildStatsModalData(sprites, typeBadgesHTML, abilityString, pokemonHeight, pokemonWeight, evolutionChain) {
    return {
        sprites: sprites,
        typeBadgesHTML: typeBadgesHTML,
        abilityString: abilityString,
        pokemonHeight: pokemonHeight,
        pokemonWeight: pokemonWeight,
        evolutionChain: evolutionChain
    };
}

//--------------------------------------------------------------------------------------> find stats content container
function findStatsContentContainer() {
    let statsContent = document.getElementsByClassName('stats_content')[0];
    if (!statsContent) {
        logErrorMessage("stats content container not found");
        return null;
    }
    return statsContent;
}

//--------------------------------------------------------------------------------------> find evolution container
function findEvolutionContainer() {
    let evolutionContainer = document.getElementsByClassName('evolution_chain')[0];
    if (!evolutionContainer) {
        logErrorMessage("evolution container not found");
        return null;
    }
    return evolutionContainer;
}

//--------------------------------------------------------------------------------------> update stats modal primary type
function updateStatsModalPrimaryType(statsContent, pokemon) {
    let primaryType = pokemon.types[0].type.name;
    statsContent.setAttribute('data-primary-type', primaryType);
}