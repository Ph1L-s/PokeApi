//--------------------------------------------------------------------------------------> pokemon-init.js

//--------------------------------------------------------------------------------------> get first pokemon test 
async function getFirstPokemon() {
    try {
        logApiMessage("loading first 20 pokemon for testing");
        let pokemonIds = [];
        for (let firstPokemonIndex = 1; firstPokemonIndex <= 20; firstPokemonIndex++) {
            pokemonIds.push(firstPokemonIndex);
        }
        
        let pokemon = await getMultiplePokemon(pokemonIds);
        logApiMessage("first pokemon test completed: " + pokemon.length + " pokemon");
        return pokemon;
    } catch (error) {
        logErrorMessage("getFirstPokemon failed", error);
        return [];
    }
}

//--------------------------------------------------------------------------------------> initialize Pokedex
async function initPokedex() {
    logAppMessage("initializing pokedex");
    
    try {
        let [generations, testPokemon] = await Promise.all([
            getAllGenerations(),
            getFirstPokemon()
        ]);
        
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

//--------------------------------------------------------------------------------------> initialize app with specific generation
async function initPokedexWithGeneration(generationId) {
    logAppMessage("initializing pokedex with generation: " + generationId);
    
    try {
        let [generations, generationData] = await Promise.all([
            getAllGenerations(),
            getGenerationWithPokemon(generationId)
        ]);
        
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

//--------------------------------------------------------------------------------------> preload essential data
async function preloadEssentialData() {
    try {
        logAppMessage("preloading essential data");
        
        let [generations, pokemonTypes, firstGeneration] = await Promise.all([
            getAllGenerations(),
            getPokemonTypes(),
            getGenerationWithPokemon(1)
        ]);
        
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