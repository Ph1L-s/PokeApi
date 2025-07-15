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
            
            if (current.evolves_to && current.evolves_to.length > 0) {
                current = current.evolves_to[0];
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
    logEvolutionChain(firstPokemon.name, evolutions.length);
    return evolutions;
}

async function getPokemonWithDetails(pokemonId) {
    try {
        logPokemonDetailsStart(pokemonId);
        
        let [pokemon, speciesResponse] = await Promise.all([
            getPokemon(pokemonId),
            fetch(POKEAPI_URL + `pokemon-species/${pokemonId}`)
        ]);
        
        if (!pokemon) {
            logErrorMessage("Pokemon not found: " + pokemonId);
            return null;
        }
        
        if (!speciesResponse.ok) {
            throw new Error(`Species API error! status: ${speciesResponse.status}`);
        }
        
        let speciesData = await speciesResponse.json();
        let evolutionChain = null;
        
        if (speciesData && speciesData.evolution_chain) {
            try {
                let evolutionUrl = speciesData.evolution_chain.url.replace(POKEAPI_URL, '');
                let evolutionResponse = await fetch(POKEAPI_URL + evolutionUrl);
                if (evolutionResponse.ok) {
                    evolutionChain = await evolutionResponse.json();
                }
            } catch (evolutionError) {
                logEvolutionError(pokemon.name, evolutionError);
            }
        }
        
        let detailedPokemon = {
            ...pokemon,
            species_info: speciesData,
            evolution_chain: evolutionChain
        };
        
        logPokemonDetailsSuccess(pokemon.name, pokemonId);
        return detailedPokemon;
        
    } catch (error) {
        logPokemonDetailsError(pokemonId, error);
        return null;
    }
}