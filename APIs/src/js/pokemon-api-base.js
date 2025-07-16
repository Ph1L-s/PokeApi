const POKEAPI_URL = "https://pokeapi.co/api/v2/";
const SPRITES_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

function extractIdFromUrl(url) {
    let urlParts = url.split('/');
    let totalParts = urlParts.length;
    let idPosition = totalParts - 2; 
    let idString = urlParts[idPosition];
    let pokemonId = parseInt(idString);
    
    return pokemonId;
}

function handleFetchError(response) {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}

async function fetchPokemonData(pokemonId) {
    let response = await fetch(POKEAPI_URL + `pokemon/${pokemonId}`);
    handleFetchError(response);
    let pokemon = await response.json();
    return pokemon;
}

async function getPokemon(pokemonId) {
    try{
        logApiCall("pokemon/" + pokemonId);
        let pokemon = await fetchPokemonData(pokemonId);
        logApiSuccess("pokemon/" + pokemonId, null);
        return pokemon;
    } catch (error) {
        logApiError("pokemon/" + pokemonId, error);
        return null;
    }
}

async function fetchPokemonListData(limit, offset) {
    let endpoint = `pokemon?limit=${limit}&offset=${offset}`;
    let response = await fetch(POKEAPI_URL + endpoint);
    handleFetchError(response);
    let listData = await response.json();
    return { listData, endpoint };
}

async function getPokemonList(limit = 20, offset = 0) {
    try{
        let { listData, endpoint } = await fetchPokemonListData(limit, offset);
        logApiCall(endpoint);
        logApiSuccess(endpoint, listData.results.length);
        return listData;
    } catch (error){
        logApiError(`pokemon?limit=${limit}&offset=${offset}`, error);
        return null;
    }
}

async function createPokemonPromise(pokemonId, pokemonFetchIndex) {
    try {
        let pokemon = await getPokemon(pokemonId);
        if (pokemon) {
            return { pokemon, originalIndex: pokemonFetchIndex, id: pokemonId };
        }
        return null;
    } catch (error) {
        logErrorMessage("Failed to load pokemon " + pokemonId, error);
        return null;
    }
}

function processPokemonResults(results) {
    let validPokemon = results
        .filter(result => result !== null)
        .sort(function(a, b) { return a.originalIndex - b.originalIndex; })
        .map(result => result.pokemon);
    return validPokemon;
}

async function getMultiplePokemon(pokemonIds) {
    try{
        logApiMessage("loading multiple pokemon: " + pokemonIds.length + " total");
        
        let pokemonPromises = pokemonIds.map(async (pokemonId, pokemonFetchIndex) => {
            return await createPokemonPromise(pokemonId, pokemonFetchIndex);
        });
        
        let results = await Promise.all(pokemonPromises);
        let validPokemon = processPokemonResults(results);

        logApiSuccess("multiple pokemon", validPokemon.length);
        return validPokemon;
            
    } catch (error) {
        logApiError("multiple pokemon", error);
        return [];
    }
}

function getPokemonSprites(pokemonId) {
    return {
        front: `${SPRITES_URL}${pokemonId}.png`,
        back: `${SPRITES_URL}back/${pokemonId}.png`,
        shiny: `${SPRITES_URL}shiny/${pokemonId}.png`,
        shiny_back: `${SPRITES_URL}back/shiny/${pokemonId}.png`,
        artwork: `${SPRITES_URL}other/official-artwork/${pokemonId}.png`,
        home: `${SPRITES_URL}other/home/${pokemonId}.png`
    };
}

async function fetchPokemonTypesData() {
    let response = await fetch(POKEAPI_URL + "type");
    handleFetchError(response);
    let typesData = await response.json();
    return typesData;
}

async function getPokemonTypes() {
    try {
        logApiCall("types");
        let typesData = await fetchPokemonTypesData();
        logApiSuccess("types", typesData.results.length);
        return typesData.results;
    } catch(error) {
        logApiError("types", error);
        return [];
    }
}

async function searchPokemon(searchTerm) {
    try {
        logSearchStart(searchTerm, "single");
        let pokemon = await getPokemon(searchTerm.toLowerCase());
        if (pokemon) {
            logSearchSuccess(searchTerm, 1);
            return pokemon;
        } else {
            logSearchEmpty(searchTerm);
            return null;
        }
    } catch (error){
        logSearchError(searchTerm, error);
        return null;
    }
}