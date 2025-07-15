async function getAllGenerations() {
    try {
        logApiCall("generations");
    
        let response = await fetch(POKEAPI_URL + "generation");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let generationsData = await response.json();
        logApiSuccess("generations", generationsData.results.length);
        return generationsData.results;
    } catch (error) {
        logApiError("generations", error);
        return [];
    }
}

async function getGenerationWithPokemon(generationId) {
    try {
        logApiCall("generation/" + generationId);
        let response = await fetch(POKEAPI_URL + `generation/${generationId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let generationData = await response.json();
        logApiSuccess("generation/" + generationId, generationData.pokemon_species.length);
        return generationData;
    } catch (error) {
        logApiError("generation/" + generationId, error);
        return null;
    }
}

async function getAllPokemonOverview() {
    try {
        logApiMessage("loading all pokemon overview");
        
        let allGenerationsData = [];
        for (let generationId = 1; generationId <= 9; generationId++) {
            let generationData = await getGenerationWithPokemon(generationId);
            if (generationData && generationData.pokemon_species) {
                allGenerationsData.push(generationData);
            }
        }
        
        let allPokemonSpecies = [];
        for (let genIndex = 0; genIndex < allGenerationsData.length; genIndex++) {
            let generationData = allGenerationsData[genIndex];
            for (let speciesIndex = 0; speciesIndex < generationData.pokemon_species.length; speciesIndex++) {
                let species = generationData.pokemon_species[speciesIndex];
                let urlParts = species.url.split('/');
                let pokemonId = parseInt(urlParts[urlParts.length - 2]);
                
                let pokemonWithId = {
                    name: species.name,
                    url: species.url,
                    id: pokemonId
                };
                allPokemonSpecies.push(pokemonWithId);
            }
        }
        
        allPokemonSpecies.sort(function(pokemonA, pokemonB) {
            return pokemonA.id - pokemonB.id;
        });
        
        let overviewData = {
            allSpecies: allPokemonSpecies,
            total: allPokemonSpecies.length
        };
        
        logApiMessage("all pokemon overview prepared: " + overviewData.total + " total species");
        return overviewData;
        
    } catch (error) {
        logApiError("all pokemon overview", error);
        return null;
    }
}

async function getPokemonByGenerationRange(startGeneration, endGeneration) {
    try {
        logApiMessage("loading pokemon from generation " + startGeneration + " to " + endGeneration);
        
        let allPokemon = [];
        for (let generationId = startGeneration; generationId <= endGeneration; generationId++) {
            let generationData = await getGenerationWithPokemon(generationId);
            if (generationData && generationData.pokemon_species) {
                
                for (let speciesIndex = 0; speciesIndex < generationData.pokemon_species.length; speciesIndex++) {
                    let species = generationData.pokemon_species[speciesIndex];
                    let pokemonId = extractIdFromUrl(species.url);
                    allPokemon.push(pokemonId);
                }
            }
        }
        
        let pokemonDetails = await getMultiplePokemon(allPokemon);
        logApiSuccess("pokemon by generation range", pokemonDetails.length);
        return pokemonDetails;
    } catch (error) {
        logApiError("pokemon by generation range", error);
        return [];
    }
}