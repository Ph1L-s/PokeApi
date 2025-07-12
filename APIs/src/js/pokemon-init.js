//--------------------------------------------------------------------------------------> pokemon app Initialization - pokemon-init.js
//--------------------------------------------------------------------------------------> initialize Pokedex (OPTIMIERT mit Promise.all)
async function initPokedex() {
    console.log("initializing pokedex...");
    
    try {
        let [generations, testPokemon] = await Promise.all([
            getAllGenerations(),
            getFirstPokemon()
        ]);
        
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