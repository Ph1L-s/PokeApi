function extractEvolutionData(current) {
    let evolutionData = {
        name: current.species.name,
        id: extractIdFromUrl(current.species.url)
    };
    return evolutionData;
}

function processEvolutionLevel(current, evolutions) {
    if (current.evolves_to && current.evolves_to.length > 0) {
        current = current.evolves_to[0];
        let evolution = {
            name: current.species.name,
            id: extractIdFromUrl(current.species.url)
        };
        evolutions.push(evolution);
        return current;
    }
    return null;
}

function buildEvolutionChain(chainRoot) {
    let evolutions = [];
    let current = chainRoot;
    let firstPokemon = extractEvolutionData(current);
    evolutions.push(firstPokemon);
    
    // Process first evolution level
    current = processEvolutionLevel(current, evolutions);
    if (current) {
        current = processEvolutionLevel(current, evolutions);
        if (current) {
            processEvolutionLevel(current, evolutions);
        }
    }
    
    return evolutions;
}

function parseEvolutionChain(evolutionChain) {
    if (!evolutionChain || !evolutionChain.chain) {
        return [];
    }
    
    let evolutions = buildEvolutionChain(evolutionChain.chain);
    let evolutionNames = [];
    for (let evolutionIndex = 0; evolutionIndex < evolutions.length; evolutionIndex++) {
        evolutionNames.push(evolutions[evolutionIndex].name);
    }
    let evolutionString = evolutionNames.join(' → ');
    logEvolutionChain(evolutions[0].name, evolutions.length);
    return evolutions;
}

async function fetchSpeciesData(pokemonId) {
    let speciesResponse = await fetch(POKEAPI_URL + `pokemon-species/${pokemonId}`);
    
    if (!speciesResponse.ok) {
        throw new Error(`Species API error! status: ${speciesResponse.status}`);
    }
    
    let speciesData = await speciesResponse.json();
    return speciesData;
}

async function fetchEvolutionChain(speciesData, pokemonName) {
    let evolutionChain = null;
    
    if (speciesData && speciesData.evolution_chain) {
        try {
            let evolutionUrl = speciesData.evolution_chain.url.replace(POKEAPI_URL, '');
            let evolutionResponse = await fetch(POKEAPI_URL + evolutionUrl);
            if (evolutionResponse.ok) {
                evolutionChain = await evolutionResponse.json();
            }
        } catch (evolutionError) {
            logEvolutionError(pokemonName, evolutionError);
        }
    }
    
    return evolutionChain;
}

async function fetchPokemonAndSpecies(pokemonId) {
    let [pokemon, speciesData] = await Promise.all([
        getPokemon(pokemonId),
        fetchSpeciesData(pokemonId)
    ]);
    
    if (!pokemon) {
        logErrorMessage("Pokemon not found: " + pokemonId);
        return null;
    }
    
    return { pokemon, speciesData };
}

async function buildDetailedPokemon(pokemon, speciesData) {
    let evolutionChain = await fetchEvolutionChain(speciesData, pokemon.name);
    
    let detailedPokemon = {
        ...pokemon,
        species_info: speciesData,
        evolution_chain: evolutionChain
    };
    
    return detailedPokemon;
}

async function getPokemonWithDetails(pokemonId) {
    try {
        logPokemonDetailsStart(pokemonId);
        
        let pokemonData = await fetchPokemonAndSpecies(pokemonId);
        if (!pokemonData) {
            return null;
        }
        
        let detailedPokemon = await buildDetailedPokemon(pokemonData.pokemon, pokemonData.speciesData);
        
        logPokemonDetailsSuccess(pokemonData.pokemon.name, pokemonId);
        return detailedPokemon;
        
    } catch (error) {
        logPokemonDetailsError(pokemonId, error);
        return null;
    }
}