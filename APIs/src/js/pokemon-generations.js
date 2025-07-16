async function fetchGenerationsData() {
    let response = await fetch(POKEAPI_URL + "generation");
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let generationsData = await response.json();
    return generationsData;
}

async function getAllGenerations() {
    try {
        logApiCall("generations");
        let generationsData = await fetchGenerationsData();
        logApiSuccess("generations", generationsData.results.length);
        return generationsData.results;
    } catch (error) {
        logApiError("generations", error);
        return [];
    }
}

async function fetchGenerationData(generationId) {
    let response = await fetch(POKEAPI_URL + `generation/${generationId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let generationData = await response.json();
    return generationData;
}

async function getGenerationWithPokemon(generationId) {
    try {
        logApiCall("generation/" + generationId);
        let generationData = await fetchGenerationData(generationId);
        logApiSuccess("generation/" + generationId, generationData.pokemon_species.length);
        return generationData;
    } catch (error) {
        logApiError("generation/" + generationId, error);
        return null;
    }
}

async function collectAllGenerationsData() {
    let allGenerationsData = [];
    for (let generationId = 1; generationId <= 9; generationId++) {
        let generationData = await getGenerationWithPokemon(generationId);
        if (generationData && generationData.pokemon_species) {
            allGenerationsData.push(generationData);
        }
    }
    return allGenerationsData;
}

function createPokemonWithId(species) {
    let urlParts = species.url.split('/');
    let pokemonId = parseInt(urlParts[urlParts.length - 2]);
    
    let pokemonWithId = {
        name: species.name,
        url: species.url,
        id: pokemonId
    };
    return pokemonWithId;
}

function extractAllPokemonSpecies(allGenerationsData) {
    let allPokemonSpecies = [];
    for (let genIndex = 0; genIndex < allGenerationsData.length; genIndex++) {
        let generationData = allGenerationsData[genIndex];
        for (let speciesIndex = 0; speciesIndex < generationData.pokemon_species.length; speciesIndex++) {
            let species = generationData.pokemon_species[speciesIndex];
            let pokemonWithId = createPokemonWithId(species);
            allPokemonSpecies.push(pokemonWithId);
        }
    }
    return allPokemonSpecies;
}

function sortAndCreateOverview(allPokemonSpecies) {
    allPokemonSpecies.sort(function(pokemonA, pokemonB) {
        return pokemonA.id - pokemonB.id;
    });
    
    let overviewData = {
        allSpecies: allPokemonSpecies,
        total: allPokemonSpecies.length
    };
    return overviewData;
}

async function getAllPokemonOverview() {
    try {
        logApiMessage("loading all pokemon overview");
        
        let allGenerationsData = await collectAllGenerationsData();
        let allPokemonSpecies = extractAllPokemonSpecies(allGenerationsData);
        let overviewData = sortAndCreateOverview(allPokemonSpecies);
        
        logApiMessage("all pokemon overview prepared: " + overviewData.total + " total species");
        return overviewData;
        
    } catch (error) {
        logApiError("all pokemon overview", error);
        return null;
    }
}

async function collectPokemonFromGenerations(startGeneration, endGeneration) {
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
    return allPokemon;
}

async function getPokemonByGenerationRange(startGeneration, endGeneration) {
    try {
        logApiMessage("loading pokemon from generation " + startGeneration + " to " + endGeneration);
        
        let allPokemon = await collectPokemonFromGenerations(startGeneration, endGeneration);
        let pokemonDetails = await getMultiplePokemon(allPokemon);
        
        logApiSuccess("pokemon by generation range", pokemonDetails.length);
        return pokemonDetails;
    } catch (error) {
        logApiError("pokemon by generation range", error);
        return [];
    }
}