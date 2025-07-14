/* logger.js */

//--------------------------------------------------------------------------------------> api logs

function logApiCall(endpoint) {
    logApiMessage("calling " + endpoint);
}

function logApiSuccess(endpoint, count) {
    if (count) {
        logApiMessage(endpoint + " loaded successfully - " + count + " items");
    } else {
        logApiMessage(endpoint + " loaded successfully");
    }
}

function logApiError(endpoint, error) {
    logErrorMessage(endpoint + " failed to load", error);
}

//--------------------------------------------------------------------------------------> gen logs

function logGenerationStart(generationId) {
    if (generationId === 'all') {
        logGenerationMessage("loading all generations");
    } else {
        logGenerationMessage("loading generation " + generationId);
    }
}

function logGenerationSuccess(generationId, pokemonCount) {
    if (generationId === 'all') {
        logGenerationMessage("all generations loaded - " + pokemonCount + " total pokemon");
    } else {
        logGenerationMessage("generation " + generationId + " loaded - " + pokemonCount + " pokemon");
    }
}

function logGenerationError(generationId, error) {
    if (generationId === 'all') {
        logErrorMessage("failed to load all generations", error);
    } else {
        logErrorMessage("failed to load generation " + generationId, error);
    }
}

//--------------------------------------------------------------------------------------> page logs

function logPageStart(pageName) {
    logPageMessage("loading " + pageName);
}

function logPageSuccess(pageName, itemCount) {
    if (itemCount) {
        logPageMessage(pageName + " loaded successfully - " + itemCount + " items");
    } else {
        logPageMessage(pageName + " loaded successfully");
    }
}

function logPageError(pageName, error) {
    logErrorMessage(pageName + " failed to load", error);
}

//--------------------------------------------------------------------------------------> search logs

function logSearchStart(searchTerm, generation) {
    if (generation === 'all') {
        logSearchMessage("searching for '" + searchTerm + "' in all generations");
    } else {
        logSearchMessage("searching for '" + searchTerm + "' in generation " + generation);
    }
}

function logSearchSuccess(searchTerm, resultCount) {
    logSearchMessage("found " + resultCount + " results for '" + searchTerm + "'");
}

function logSearchEmpty(searchTerm) {
    logSearchMessage("no results found for '" + searchTerm + "'");
}

function logSearchError(searchTerm, error) {
    logErrorMessage("search failed for '" + searchTerm + "'", error);
}

//--------------------------------------------------------------------------------------> poke logs

function logPokemonDetailsStart(pokemonId) {
    logPokemonMessage("loading details for pokemon " + pokemonId);
}

function logPokemonDetailsSuccess(pokemonName, pokemonId) {
    logPokemonMessage("details loaded for " + pokemonName + " (#" + pokemonId + ")");
}

function logPokemonDetailsError(pokemonId, error) {
    logErrorMessage("failed to load details for pokemon " + pokemonId, error);
}

//--------------------------------------------------------------------------------------> render logs

function logRenderStart(componentName) {
    logRenderMessage("rendering " + componentName);
}

function logRenderSuccess(componentName, itemCount) {
    if (itemCount) {
        logRenderMessage(componentName + " rendered successfully - " + itemCount + " items");
    } else {
        logRenderMessage(componentName + " rendered successfully");
    }
}

//--------------------------------------------------------------------------------------> loading logs

function logLoadingShow(message) {
    logLoadingMessage("showing loading: " + message);
}

function logLoadingHide() {
    logLoadingMessage("hiding loading");
}

//--------------------------------------------------------------------------------------> app logs

function logAppStart() {
    logAppMessage("starting pokedex app");
}

function logAppReady() {
    logAppMessage("pokedex app ready");
}

function logAppError(message, error) {
    logErrorMessage(message, error);
}

//--------------------------------------------------------------------------------------> pageination logs

function logPaginationNext(currentPage, totalPages) {
    logPaginationMessage("loading next page - " + currentPage + " of " + totalPages);
}

function logPaginationPrevious(currentPage, totalPages) {
    logPaginationMessage("loading previous page - " + currentPage + " of " + totalPages);
}

//--------------------------------------------------------------------------------------> evo logs

function logEvolutionChain(pokemonName, chainLength) {
    logEvolutionMessage("evolution chain for " + pokemonName + " - " + chainLength + " stages");
}

function logEvolutionError(pokemonName, error) {
    logErrorMessage("failed to load evolution for " + pokemonName, error);
}