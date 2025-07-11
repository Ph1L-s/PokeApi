//--------------------------------------------------------------------------------------> pokemon-generation.js

//--------------------------------------------------------------------------------------> get all generations
async function getAllGenerations() {
    try {
        console.log("loading generations...");
    
        let response = await fetch(POKEAPI_URL + "generation");
        let generationsData = await response.json();
        console.log("generations loaded:", generationsData.results.length);
        return generationsData.results;
    } catch (error) {
        console.error("getAllGenerations:" + error);
        
    }
}
//--------------------------------------------------------------------------------------> get generation with Pokemon
async function getGenerationWithPokemon(generationId) {
    try {
        console.log("loading generation:", generationId);
        let response = await fetch(POKEAPI_URL + `generation/${generationId}`);
        let generationData = await response.json();
        console.log("generation loaded:", generationData.name, generationData.pokemon_species.length);
        return generationData;
    } catch (error) {
        console.error("getGenerationWithPokemon:" + error);
        
    }
}
//--------------------------------------------------------------------------------------> get first pokemon test
async function getFirstPokemon() {
    try {
        console.log("loading first 20 pokemon...");
        let pokemonIds = [];
        for (let firstPokemonIndex = 1; firstPokemonIndex <= 20; firstPokemonIndex++) {
            pokemonIds.push(firstPokemonIndex);
        }
        
        let pokemon = await getMultiplePokemon(pokemonIds);
        console.log("first pokemon done:", pokemon.length);
        return pokemon;
    } catch (error) {
        console.error("getFirstPokemon:" + error);
        
    }
}