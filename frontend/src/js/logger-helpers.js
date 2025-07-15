let logsEnabled = false;

let apiLogs = true;
let renderLogs = true;
let pageLogs = true;
let generationLogs = true;
let searchLogs = true;
let pokemonLogs = true;
let loadingLogs = true;
let paginationLogs = true;
let evolutionLogs = true;
let appLogs = true;
let errorLogs = true;


function shouldLogApi() {
    return logsEnabled && apiLogs;
}

function shouldLogRender() {
    return logsEnabled && renderLogs;
}

function shouldLogPage() {
    return logsEnabled && pageLogs;
}

function shouldLogGeneration() {
    return logsEnabled && generationLogs;
}

function shouldLogSearch() {
    return logsEnabled && searchLogs;
}

function shouldLogPokemon() {
    return logsEnabled && pokemonLogs;
}

function shouldLogLoading() {
    return logsEnabled && loadingLogs;
}

function shouldLogPagination() {
    return logsEnabled && paginationLogs;
}

function shouldLogEvolution() {
    return logsEnabled && evolutionLogs;
}

function shouldLogApp() {
    return logsEnabled && appLogs;
}

function shouldLogError() {
    return logsEnabled && errorLogs;
}

function logApiMessage(message) {
    if (shouldLogApi()) {
        console.log("API: " + message);
    }
}

function logRenderMessage(message) {
    if (shouldLogRender()) {
        console.log("RENDER: " + message);
    }
}

function logPageMessage(message) {
    if (shouldLogPage()) {
        console.log("PAGE: " + message);
    }
}

function logGenerationMessage(message) {
    if (shouldLogGeneration()) {
        console.log("GENERATION: " + message);
    }
}

function logSearchMessage(message) {
    if (shouldLogSearch()) {
        console.log("SEARCH: " + message);
    }
}

function logPokemonMessage(message) {
    if (shouldLogPokemon()) {
        console.log("POKEMON: " + message);
    }
}

function logLoadingMessage(message) {
    if (shouldLogLoading()) {
        console.log("LOADING: " + message);
    }
}

function logPaginationMessage(message) {
    if (shouldLogPagination()) {
        console.log("PAGINATION: " + message);
    }
}

function logEvolutionMessage(message) {
    if (shouldLogEvolution()) {
        console.log("EVOLUTION: " + message);
    }
}

function logAppMessage(message) {
    if (shouldLogApp()) {
        console.log("APP: " + message);
    }
}

function logErrorMessage(message, error) {
    if (shouldLogError()) {
        console.error("ERROR: " + message);
        if (error) {
            console.error(error);
        }
    }
}

function enableAllLogs() {
    apiLogs = true;
    renderLogs = true;
    pageLogs = true;
    generationLogs = true;
    searchLogs = true;
    pokemonLogs = true;
    loadingLogs = true;
    paginationLogs = true;
    evolutionLogs = true;
    appLogs = true;
    errorLogs = true;
    console.log("All logs enabled");
}

function disableAllLogs() {
    apiLogs = false;
    renderLogs = false;
    pageLogs = false;
    generationLogs = false;
    searchLogs = false;
    pokemonLogs = false;
    loadingLogs = false;
    paginationLogs = false;
    evolutionLogs = false;
    appLogs = false;
    errorLogs = false;
    console.log("All logs disabled");
}

function enableApiLogs() {
    apiLogs = true;
    console.log("API logs enabled");
}

function disableApiLogs() {
    apiLogs = false;
    console.log("API logs disabled");
}

function enableRenderLogs() {
    renderLogs = true;
    console.log("Render logs enabled");
}

function disableRenderLogs() {
    renderLogs = false;
    console.log("Render logs disabled");
}

function enablePageLogs() {
    pageLogs = true;
    console.log("Page logs enabled");
}

function disablePageLogs() {
    pageLogs = false;
    console.log("Page logs disabled");
}

function enableGenerationLogs() {
    generationLogs = true;
    console.log("Generation logs enabled");
}

function disableGenerationLogs() {
    generationLogs = false;
    console.log("Generation logs disabled");
}

function enableSearchLogs() {
    searchLogs = true;
    console.log("Search logs enabled");
}

function disableSearchLogs() {
    searchLogs = false;
    console.log("Search logs disabled");
}

function enablePokemonLogs() {
    pokemonLogs = true;
    console.log("Pokemon logs enabled");
}

function disablePokemonLogs() {
    pokemonLogs = false;
    console.log("Pokemon logs disabled");
}

function enableLoadingLogs() {
    loadingLogs = true;
    console.log("Loading logs enabled");
}

function disableLoadingLogs() {
    loadingLogs = false;
    console.log("Loading logs disabled");
}

function enablePaginationLogs() {
    paginationLogs = true;
    console.log("Pagination logs enabled");
}

function disablePaginationLogs() {
    paginationLogs = false;
    console.log("Pagination logs disabled");
}

function enableEvolutionLogs() {
    evolutionLogs = true;
    console.log("Evolution logs enabled");
}

function disableEvolutionLogs() {
    evolutionLogs = false;
    console.log("Evolution logs disabled");
}

function enableAppLogs() {
    appLogs = true;
    console.log("App logs enabled");
}

function disableAppLogs() {
    appLogs = false;
    console.log("App logs disabled");
}

function enableErrorLogs() {
    errorLogs = true;
    console.log("Error logs enabled");
}

function disableErrorLogs() {
    errorLogs = false;
    console.log("Error logs disabled");
}

function enableLogger() {
    logsEnabled = true;
    console.log("Logger enabled");
}

function disableLogger() {
    logsEnabled = false;
    console.log("Logger disabled");
}

function enableImportantLogs() {
    disableAllLogs();
    apiLogs = true;
    pageLogs = true;
    generationLogs = true;
    searchLogs = true;
    appLogs = true;
    errorLogs = true;
    console.log("Important logs enabled");
}

function enableOnlyErrors() {
    disableAllLogs();
    errorLogs = true;
    console.log("Only errors enabled");
}