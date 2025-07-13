//--------------------------------------------------------------------------------------> pokemon-init.js

//--------------------------------------------------------------------------------------> get first pokemon test 
async function getFirstPokemon() {
    try {
        console.log("loading first 20 pokemon...");
        let pokemonIds = [];
        for (let firstPokemonIndex = 1; firstPokemonIndex <= 20; firstPokemonIndex++) {
            pokemonIds.push(firstPokemonIndex);
        }
        
        let pokemon = await getMultiplePokemon(pokemonIds);
        console.log("first pokemon done:", pokemon.length);
        return pokemon;
    } catch (error) {
        console.error("getFirstPokemon:" + error);
        return [];
    }
}

//--------------------------------------------------------------------------------------> initialize Pokedex
async function initPokedex() {
    console.log("initializing pokedex...");
    
    try {
        let [generations, testPokemon] = await Promise.all([
            getAllGenerations(),
            getFirstPokemon()
        ]);
        
        let initData = {
            generations: generations,
            testPokemon: testPokemon
        };
        
        console.log("pokedex init done!");
        return initData;
    } catch (error) {
        console.error("pokedex initialization failed:", error);
        return null;
    }
}

//--------------------------------------------------------------------------------------> initialize app with specific generation
async function initPokedexWithGeneration(generationId) {
    console.log("initializing pokedex with generation:", generationId);
    
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
        
        console.log("pokedex init with generation done!");
        return initData;
    } catch (error) {
        console.error("pokedex initialization with generation failed:", error);
        return null;
    }
}

//--------------------------------------------------------------------------------------> preload essential data
async function preloadEssentialData() {
    try {
        console.log("preloading essential data...");
        
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
        
        console.log("essential data preloaded successfully");
        return essentialData;
    } catch (error) {
        console.error("preloadEssentialData failed:", error);
        return null;
    }
}