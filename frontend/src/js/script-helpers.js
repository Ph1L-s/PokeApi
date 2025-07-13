/* script-helpers.js */

//--------------------------------------------------------------------------------------> create all generations object
function createAllGenerationsObject(allSpecies) {
    let sortedGenerationData = new Object(); // objects literal start
    sortedGenerationData.id = 'all';
    sortedGenerationData.name = 'all-generations';
    sortedGenerationData.pokemon_species = allSpecies; // -  objects literal end
    
    return sortedGenerationData;
}

//--------------------------------------------------------------------------------------> get all pokemon IDs from current generation
function getAllPokemonIdsFromGeneration() {
    let allPokemonIds = [];
    for (let speciesIndex = 0; speciesIndex < sortedGenerationData.pokemon_species.length; speciesIndex++) {
        let species = sortedGenerationData.pokemon_species[speciesIndex];
        allPokemonIds.push(species.id);
    }
    console.log("searching through", allPokemonIds.length, "pokemon in current generation");
    return allPokemonIds;
}

//--------------------------------------------------------------------------------------> filter pokemon by search term
function filterPokemonBySearchTerm(allPokemonIds) {
    let matchingIds = [];
    
    for (let idIndex = 0; idIndex < allPokemonIds.length; idIndex++) {
        let pokemonId = allPokemonIds[idIndex];
        let species = findSpeciesById(pokemonId);
        
        if (species) {
            let shouldInclude = false;
            
            if (isNumericSearch(currentSearchTerm)) {
                shouldInclude = pokemonId.toString().includes(currentSearchTerm);
            } else {
                shouldInclude = species.name.toLowerCase().includes(currentSearchTerm);
            }
            
            if (shouldInclude) {
                matchingIds.push(pokemonId);
                console.log("match found:", species.name, "(" + pokemonId + ")");
            }
        }
    }
    
    return matchingIds;
}

//--------------------------------------------------------------------------------------> find species by ID
function findSpeciesById(pokemonId) {
    for (let speciesIndex = 0; speciesIndex < sortedGenerationData.pokemon_species.length; speciesIndex++) {
        let species = sortedGenerationData.pokemon_species[speciesIndex];
        if (species.id === pokemonId) {
            return species;
        }
    }
    return null;
}

//--------------------------------------------------------------------------------------> check if search is numeric
function isNumericSearch(searchTerm) {
    for (let characterIndex = 0; characterIndex < searchTerm.length; characterIndex++) {
        let currentCharacter = searchTerm[characterIndex];
        
        if (currentCharacter < '0' || currentCharacter > '9') {
            console.log("Found non-numeric character:", currentCharacter);
            return false;
        }
    }
    
    console.log("All characters are numeric in:", searchTerm);
    return true;
}

//--------------------------------------------------------------------------------------> process Pokemon Species Data
function processPokemonSpeciesData(generationData) {
    console.log("processing pokemon species data for sorting...");

    let pokemonSpeciesWithIds = [];
    for (let speciesIndex = 0; speciesIndex < generationData.pokemon_species.length; speciesIndex++) {
        let species = generationData.pokemon_species[speciesIndex];
        let urlParts = species.url.split('/');
        let pokemonId = parseInt(urlParts[urlParts.length - 2]);

        let pokemonWithId = {
            name: species.name,
            url: species.url,
            id: pokemonId
        };
        pokemonSpeciesWithIds.push(pokemonWithId);
        
        console.log("Processed Pokemon:", pokemonWithId.name, "ID:", pokemonWithId.id);
    }

    console.log("Sorting Pokemon by Pokedex ID...");
    pokemonSpeciesWithIds.sort(function(pokemonA, pokemonB) {
        return pokemonA.id - pokemonB.id;
    });
    
    console.log("First 5 Pokemon after sorting:");
    for (let debugIndex = 0; debugIndex < 5 && debugIndex < pokemonSpeciesWithIds.length; debugIndex++) {
        let pokemon = pokemonSpeciesWithIds[debugIndex];
        console.log("  " + (debugIndex + 1) + ". " + pokemon.name + " (ID: " + pokemon.id + ")");
    }

    let sortedGenerationData = {
        id: generationData.id,
        name: generationData.name,
        main_region: generationData.main_region,
        pokemon_species: pokemonSpeciesWithIds
    };
    
    console.log("Pokemon species sorting completed!");
    return sortedGenerationData;
}

//--------------------------------------------------------------------------------------> calculate Pagination Data 
function calculatePagination(page, itemsPerPage, pokemonSpeciesList) {
    console.log("calculating pagination for page:", page);
    
    let startIndex = (page - 1) * itemsPerPage;
    console.log("Start index:", startIndex);
    
    let endIndex = startIndex + itemsPerPage;
    if (endIndex > pokemonSpeciesList.length) {
        endIndex = pokemonSpeciesList.length;
    }
    console.log("End index:", endIndex);

    let pokemonIds = [];
    for (let index = startIndex; index < endIndex; index++) {
        let species = pokemonSpeciesList[index];
        pokemonIds.push(species.id);
        console.log("Added Pokemon ID to page:", species.id, "(" + species.name + ")");
    }

    let paginationResult = {
        startIndex: startIndex,
        endIndex: endIndex,
        pokemonIds: pokemonIds,
        totalItems: pokemonSpeciesList.length,
        currentPage: page,
        itemsOnThisPage: pokemonIds.length
    };
    
    console.log("Pagination calculated:", paginationResult.itemsOnThisPage, "items on page", page);
    return paginationResult;
}