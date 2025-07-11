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
    let pokemon = await response.json();
    console.log("loaded pokemon:", pokemon.name);
    return pokemon;
    } catch (error) {
        console.error("get Pokemon asyn didn't not response:" + error)

    }
    
}
//--------------------------------------------------------------------------------------> get Pokemon list
async function getPokemonList(limit = 20, offset = 0) {

    try{
        let response = await fetch(POKEAPI_URL + `pokemon?limit=${limit}&offset=${offset}`);
        let listData = await response.json();
        console.log("loaded pokemon list:", listData.results.length);
        return listData;
    } catch (error){
        console.error("getPokemonList:" + error )
    }
    
}


//--------------------------------------------------------------------------------------> get multiple pokemon
async function getMultiplePokemon(pokemonIds) {
    try{

        console.log("loading multiple pokemon:", pokemonIds.length);
        let validPokemon = [];
        for (let pokemonFetchIndex = 0; pokemonFetchIndex < pokemonIds.length; pokemonFetchIndex++) {
            let pokemon = await getPokemon(pokemonIds[pokemonFetchIndex]);
            if (pokemon) {
                validPokemon.push(pokemon);
            }
            console.log("loaded pokemon single:", pokemonFetchIndex, pokemon.name);
        }

        console.log("multiple pokemon done:", validPokemon.length);
        return validPokemon;
            
    } catch (error) {
        console.error("getMultiplePokemon:" + error)
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
        let typesData = await response.json();

        console.log("types loaded:", typesData.results.length);

        return typesData.results;
    } catch(error) {
        console.error("getPokemonTypes:" + error);
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
    
    }
}