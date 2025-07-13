//--------------------------------------------------------------------------------------> pokemon-api-base.js
const POKEAPI_URL = "https://pokeapi.co/api/v2/";
const SPRITES_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

//--------------------------------------------------------------------------------------> xxtract ID from pokemonAPI
function extractIdFromUrl(url) {
    console.log("Original URL:", url);
    let urlParts = url.split('/');
    console.log("URL parts:", urlParts);
    let totalParts = urlParts.length;
    console.log("amount parts:", totalParts);
    let idPosition = totalParts - 2; 
    let idString = urlParts[idPosition];
    console.log("id as string:", idString);
    let pokemonId = parseInt(idString);
    console.log("id number:", pokemonId);
    
    return pokemonId;
}

//--------------------------------------------------------------------------------------> get single pokemon
async function getPokemon(pokemonId) {
    try{
        let response = await fetch(POKEAPI_URL + `pokemon/${pokemonId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let pokemon = await response.json();
        console.log("loaded pokemon:", pokemon.name);
        return pokemon;
    } catch (error) {
        console.error("get Pokemon asyn didn't not response:" + error);
        return null;
    }
}

//--------------------------------------------------------------------------------------> get Pokemon list
async function getPokemonList(limit = 20, offset = 0) {
    try{
        let response = await fetch(POKEAPI_URL + `pokemon?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let listData = await response.json();
        console.log("loaded pokemon list:", listData.results.length);
        return listData;
    } catch (error){
        console.error("getPokemonList:" + error);
        return null;
    }
}

//--------------------------------------------------------------------------------------> get multiple pokemon
async function getMultiplePokemon(pokemonIds) {
    try{
        console.log("loading multiple pokemon:", pokemonIds.length);
        
        let pokemonPromises = pokemonIds.map(async (pokemonId, pokemonFetchIndex) => {
            try {
                let pokemon = await getPokemon(pokemonId);
                if (pokemon) {
                    console.log("loaded pokemon single:", pokemonFetchIndex, pokemon.name);
                    return { pokemon, originalIndex: pokemonFetchIndex, id: pokemonId };
                }
                return null;
            } catch (error) {
                console.error(`Failed to load pokemon ${pokemonId}:`, error);
                return null;
            }
        });
        

        let results = await Promise.all(pokemonPromises);
        let validPokemon = results
            .filter(result => result !== null)
            .sort(function(a, b) { return a.originalIndex - b.originalIndex; })
            .map(result => result.pokemon);

        console.log("multiple pokemon done:", validPokemon.length);
        return validPokemon;
            
    } catch (error) {
        console.error("getMultiplePokemon:" + error);
        return [];
    }
}

//--------------------------------------------------------------------------------------> get pokemon sprites
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

//--------------------------------------------------------------------------------------> get pokemon types
async function getPokemonTypes() {
    try {
        let response = await fetch(POKEAPI_URL + "type");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let typesData = await response.json();

        console.log("types loaded:", typesData.results.length);

        return typesData.results;
    } catch(error) {
        console.error("getPokemonTypes:" + error);
        return [];
    }
}

//--------------------------------------------------------------------------------------> search pokemon
async function searchPokemon(searchTerm) {
    try {
        console.log("searching pokemon:", searchTerm);
        let pokemon = await getPokemon(searchTerm.toLowerCase());
        if (pokemon) {
            console.log("pokemon found:", pokemon.name);
            return pokemon;
        } else {
            console.log("pokemon not found:", searchTerm);
            return null;
        }
    } catch (error){
        console.error("pokemon not found:", searchTerm);
        return null;
    }
}