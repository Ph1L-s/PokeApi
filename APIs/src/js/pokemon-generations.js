//--------------------------------------------------------------------------------------> pokemon-generations.js

//--------------------------------------------------------------------------------------> get all generations
async function getAllGenerations() {
    try {
        console.log("loading generations...");
    
        let response = await fetch(POKEAPI_URL + "generation");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let generationsData = await response.json();
        console.log("generations loaded:", generationsData.results.length);
        return generationsData.results;
    } catch (error) {
        console.error("getAllGenerations:" + error);
        return [];
    }
}

//--------------------------------------------------------------------------------------> get generation with Pokemon
async function getGenerationWithPokemon(generationId) {
    try {
        console.log("loading generation:", generationId);
        let response = await fetch(POKEAPI_URL + `generation/${generationId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let generationData = await response.json();
        console.log("generation loaded:", generationData.name, generationData.pokemon_species.length);
        return generationData;
    } catch (error) {
        console.error("getGenerationWithPokemon:" + error);
        return null;
    }
}

//--------------------------------------------------------------------------------------> get all pokemon overview
async function getAllPokemonOverview() {
    try {
        console.log("loading all pokemon overview...");
        
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
        
        console.log("all pokemon species collected and sorted:", allPokemonSpecies.length);
        
        let overviewData = {
            allSpecies: allPokemonSpecies,
            total: allPokemonSpecies.length
        };
        
        console.log("all pokemon overview prepared:", overviewData.total, "total species");
        return overviewData;
        
    } catch (error) {
        console.error("getAllPokemonOverview failed:", error);
        return null;
    }
}

//--------------------------------------------------------------------------------------> get pokemon by generation range
async function getPokemonByGenerationRange(startGeneration, endGeneration) {
    try {
        console.log("loading pokemon from generation", startGeneration, "to", endGeneration);
        
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
        console.log("pokemon by generation range loaded:", pokemonDetails.length);
        return pokemonDetails;
    } catch (error) {
        console.error("getPokemonByGenerationRange failed:", error);
        return [];
    }
}