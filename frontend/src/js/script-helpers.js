/* script-helpers.js */

//--------------------------------------------------------------------------------------> create all generations object
function createAllGenerationsObject(allSpecies) {
    let sortedGenerationData = new Object();
    sortedGenerationData.id = 'all';
    sortedGenerationData.name = 'all-generations';
    sortedGenerationData.pokemon_species = allSpecies;
    
    return sortedGenerationData;
}

//--------------------------------------------------------------------------------------> get all pokemon IDs from current generation
function getAllPokemonIdsFromGeneration() {
    let allPokemonIds = [];
    for (let speciesIndex = 0; speciesIndex < sortedGenerationData.pokemon_species.length; speciesIndex++) {
        let species = sortedGenerationData.pokemon_species[speciesIndex];
        allPokemonIds.push(species.id);
    }
    logSearchMessage("searching through " + allPokemonIds.length + " pokemon in current generation");
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
                logSearchMessage("match found: " + species.name + " (#" + pokemonId + ")");
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
            return false;
        }
    }
    
    logSearchMessage("numeric search detected: " + searchTerm);
    return true;
}

//--------------------------------------------------------------------------------------> process poke species-data
function processPokemonSpeciesData(generationData) {
    logGenerationMessage("processing pokemon species data for sorting");

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
    }

    pokemonSpeciesWithIds.sort(function(pokemonA, pokemonB) {
        return pokemonA.id - pokemonB.id;
    });

    let sortedGenerationData = {
        id: generationData.id,
        name: generationData.name,
        main_region: generationData.main_region,
        pokemon_species: pokemonSpeciesWithIds
    };
    
    logGenerationMessage("pokemon species sorting completed");
    return sortedGenerationData;
}

//--------------------------------------------------------------------------------------> calculate agination-data 
function calculatePagination(page, itemsPerPage, pokemonSpeciesList) {
    logPaginationMessage("calculating pagination for page: " + page);
    
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    if (endIndex > pokemonSpeciesList.length) {
        endIndex = pokemonSpeciesList.length;
    }

    let pokemonIds = [];
    for (let index = startIndex; index < endIndex; index++) {
        let species = pokemonSpeciesList[index];
        pokemonIds.push(species.id);
    }

    let paginationResult = {
        startIndex: startIndex,
        endIndex: endIndex,
        pokemonIds: pokemonIds,
        totalItems: pokemonSpeciesList.length,
        currentPage: page,
        itemsOnThisPage: pokemonIds.length
    };
    
    logPaginationMessage("pagination calculated: " + paginationResult.itemsOnThisPage + " items on page " + page);
    return paginationResult;
}