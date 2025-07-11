//--------------------------------------------------------------------------------------> pokemon-details.js

//--------------------------------------------------------------------------------------> parse evolution chain data
function parseEvolutionChain(evolutionChain) {
    if (!evolutionChain || !evolutionChain.chain) {
        return [];
    }
    let evolutions = [];
    let current = evolutionChain.chain;
    evolutions.push({
        name: current.species.name,
        id: extractIdFromUrl(current.species.url)
    });
    while (current.evolves_to && current.evolves_to.length > 0) {
        current = current.evolves_to[0];
        evolutions.push({
            name: current.species.name,
            id: extractIdFromUrl(current.species.url)
        });
    }
    console.log("evolution chain parsed:", evolutions.map(e => e.name).join(' → '));
    return evolutions;
}
    //--------------------------------------------------------------------------------------> get pokemon with details
async function getPokemonWithDetails(pokemonId) {
    console.log("loading pokemon details:", pokemonId);
    let pokemon = await getPokemon(pokemonId);
    if (!pokemon) return null;
    let response = await fetch(POKEAPI_URL + `pokemon-species/${pokemonId}`);
    let speciesData = await response.json();
    console.log("loaded species data:", speciesData.name);
    let evolutionChain = null;
    
    if (speciesData && speciesData.evolution_chain) {
        let evolutionUrl = speciesData.evolution_chain.url.replace(POKEAPI_URL, '');
        let evolutionResponse = await fetch(POKEAPI_URL + evolutionUrl);
        evolutionChain = await evolutionResponse.json();
        console.log("loaded evolution chain:", evolutionChain.chain.species.name);
    }
    
    let detailedPokemon = {
        ...pokemon,
        species_info: speciesData,
        evolution_chain: evolutionChain
    };
    
    console.log("pokemon details done:", pokemon.name);
    return detailedPokemon;
}