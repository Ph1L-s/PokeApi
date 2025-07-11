//--------------------------------------------------------------------------------------> pokemon app Initialization - pokemon-init.js
//--------------------------------------------------------------------------------------> initialize Pokedex
async function initPokedex() {
    console.log("initializing pokedex...");
    
    try {
        let generations = await getAllGenerations();
        let testPokemon = await getFirstPokemon();
        console.log("pokedex init done!");
        return {
            generations: generations,
            testPokemon: testPokemon
        };
    } catch (error) {
        console.error("pokedex initialization failed:", error);
        return null;
    }
}