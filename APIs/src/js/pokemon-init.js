function generatePokemonIds(count) {
    let pokemonIds = [];
    for (let firstPokemonIndex = 1; firstPokemonIndex <= count; firstPokemonIndex++) {
        pokemonIds.push(firstPokemonIndex);
    }
    return pokemonIds;
}

async function getFirstPokemon() {
    try {
        logApiMessage("loading first 20 pokemon for testing");
        let pokemonIds = generatePokemonIds(20);
        
        let pokemon = await getMultiplePokemon(pokemonIds);
        logApiMessage("first pokemon test completed: " + pokemon.length + " pokemon");
        return pokemon;
    } catch (error) {
        logErrorMessage("getFirstPokemon failed", error);
        return [];
    }
}

async function loadInitialData() {
    let generations = await getAllGenerations();
    let testPokemon = await getFirstPokemon();
    
    return [generations, testPokemon];
}

async function initPokedex() {
    logAppMessage("initializing pokedex");
    
    try {
        let [generations, testPokemon] = await loadInitialData();
        
        let initData = {
            generations: generations,
            testPokemon: testPokemon
        };
        
        logAppMessage("pokedex initialization completed successfully");
        return initData;
    } catch (error) {
        logErrorMessage("pokedex initialization failed", error);
        return null;
    }
}

async function loadGenerationData(generationId) {
    let generations = await getAllGenerations();
    let generationData = await getGenerationWithPokemon(generationId);
    
    return [generations, generationData];
}

async function initPokedexWithGeneration(generationId) {
    logAppMessage("initializing pokedex with generation: " + generationId);
    
    try {
        let [generations, generationData] = await loadGenerationData(generationId);
        
        let initData = {
            generations: generations,
            currentGeneration: generationData,
            selectedGenerationId: generationId
        };
        
        logAppMessage("pokedex initialization with generation completed");
        return initData;
    } catch (error) {
        logErrorMessage("pokedex initialization with generation failed", error);
        return null;
    }
}

async function loadEssentialData() {
    let generations = await getAllGenerations();
    let pokemonTypes = await getPokemonTypes();
    let firstGeneration = await getGenerationWithPokemon(1);
    
    return [generations, pokemonTypes, firstGeneration];
}

async function preloadEssentialData() {
    try {
        logAppMessage("preloading essential data");
        
        let [generations, pokemonTypes, firstGeneration] = await loadEssentialData();
        
        let essentialData = {
            generations: generations,
            types: pokemonTypes,
            firstGeneration: firstGeneration
        };
        
        logAppMessage("essential data preloaded successfully");
        return essentialData;
    } catch (error) {
        logErrorMessage("preloadEssentialData failed", error);
        return null;
    }
}