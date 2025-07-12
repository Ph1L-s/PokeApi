//--------------------------------------------------------------------------------------> pokemon-details.js

//--------------------------------------------------------------------------------------> parse evolution chain data - Anfängerfreundlich
function parseEvolutionChain(evolutionChain) {
    
    if (!evolutionChain || !evolutionChain.chain) {
        return [];
    }
    
    let evolutions = [];
    let current = evolutionChain.chain;
    let firstPokemon = {
        name: current.species.name,
        id: extractIdFromUrl(current.species.url)
    };
    evolutions.push(firstPokemon);
    
    if (current.evolves_to && current.evolves_to.length > 0) {
        current = current.evolves_to[0];
        let firstEvolution = {
            name: current.species.name,
            id: extractIdFromUrl(current.species.url)
        };
        evolutions.push(firstEvolution);
        if (current.evolves_to && current.evolves_to.length > 0) {
            current = current.evolves_to[0];
            let secondEvolution = {
                name: current.species.name,
                id: extractIdFromUrl(current.species.url)
            };
            evolutions.push(secondEvolution);
            console.log("Added second evolution:", secondEvolution.name, "with ID:", secondEvolution.id);
            
            if (current.evolves_to && current.evolves_to.length > 0) {
                current = current.evolves_to[0];
                console.log("Found third evolution:", current.species.name);
                let thirdEvolution = {
                    name: current.species.name,
                    id: extractIdFromUrl(current.species.url)
                };
                evolutions.push(thirdEvolution);
            }
        }
    }
    let evolutionNames = [];
    for (let evolutionIndex = 0; evolutionIndex < evolutions.length; evolutionIndex++) {
        evolutionNames.push(evolutions[evolutionIndex].name);
    }
    let evolutionString = evolutionNames.join(' → ');
    console.log("evolution chain parsed:", evolutionString);
    console.log("Final evolution array:", evolutions);
    return evolutions;
}
//--------------------------------------------------------------------------------------> get pokemon with details
async function getPokemonWithDetails(pokemonId) {
    try {
        console.log("loading pokemon details:", pokemonId);
        
        let pokemon = await getPokemon(pokemonId);
        if (!pokemon) {
            console.error("Pokemon not found:", pokemonId);
            return null;
        }
        
        let speciesResponse = await fetch(POKEAPI_URL + `pokemon-species/${pokemonId}`);
        let speciesData = await speciesResponse.json();
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
        
    } catch (error) {
        console.error("getPokemonWithDetails failed:", error);
        return null;
    }
}