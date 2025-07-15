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

async function getPokemon(pokemonId) {
    try{
        logApiCall("pokemon/" + pokemonId);
        let response = await fetch(POKEAPI_URL + `pokemon/${pokemonId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let pokemon = await response.json();
        logApiSuccess("pokemon/" + pokemonId, null);
        return pokemon;
    } catch (error) {
        logApiError("pokemon/" + pokemonId, error);
        return null;
    }
}

async function getPokemonList(limit = 20, offset = 0) {
    try{
        let endpoint = `pokemon?limit=${limit}&offset=${offset}`;
        logApiCall(endpoint);
        let response = await fetch(POKEAPI_URL + endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let listData = await response.json();
        logApiSuccess(endpoint, listData.results.length);
        return listData;
    } catch (error){
        logApiError(`pokemon?limit=${limit}&offset=${offset}`, error);
        return null;
    }
}

async function getMultiplePokemon(pokemonIds) {
    try{
        logApiMessage("loading multiple pokemon: " + pokemonIds.length + " total");
        
        let pokemonPromises = pokemonIds.map(async (pokemonId, pokemonFetchIndex) => {
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
        });
        
        let results = await Promise.all(pokemonPromises);
        let validPokemon = results
            .filter(result => result !== null)
            .sort(function(a, b) { return a.originalIndex - b.originalIndex; })
            .map(result => result.pokemon);

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

async function getPokemonTypes() {
    try {
        logApiCall("types");
        let response = await fetch(POKEAPI_URL + "type");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let typesData = await response.json();
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