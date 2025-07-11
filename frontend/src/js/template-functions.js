//--------------------------------------------------------------------------------------> Template-Functions.js

//--------------------------------------------------------------------------------------> generation Buttontemplate
function getGenerationTemplate(generationId) {
    return getGenerationButtonHTML(generationId);
}

//--------------------------------------------------------------------------------------> no Pokemon template
function getNoPokemonTemplate() {
    return getNoPokemonHTML();
}

//--------------------------------------------------------------------------------------> pokemon cardtemplate
function getPokemonCardTemplate(pokemon) {
    let sprites = getPokemonSprites(pokemon.id);
    let types = [];
    for (let typeIndex = 0; typeIndex < pokemon.types.length; typeIndex++) {
        types.push(pokemon.types[typeIndex].type.name);
    }
    let typeString = types.join(', ');
    return getPokemonCardHTML(pokemon, sprites, typeString);
}

//--------------------------------------------------------------------------------------> lmiter controls template
function getLimiterTemplate(currentPage, totalPages, totalPokemon) {
    let startPokemon = (currentPage - 1) * 30 + 1;
    let endPokemon = Math.min(currentPage * 30, totalPokemon);
    
    return getLimiterHTML(currentPage, totalPages, startPokemon, endPokemon, totalPokemon);
}

//--------------------------------------------------------------------------------------> Evolution chaintemplate  
function getEvolutionChainTemplate(evolutionChain) {
    if (!evolutionChain || evolutionChain.length <= 1) {
        return getNoEvolutionHTML();
    }
    
    return getEvolutionChainHTML(evolutionChain);
}

//--------------------------------------------------------------------------------------> Pokemon stats template
function getPokemonStatsTemplate(pokemon) {
    let sprites = getPokemonSprites(pokemon.id);
    let types = [];
    let abilities = [];
    
    for (let typeIndex = 0; typeIndex < pokemon.types.length; typeIndex++) {
        types.push(pokemon.types[typeIndex].type.name);
    }
    for (let abilityIndex = 0; abilityIndex < pokemon.abilities.length; abilityIndex++) {
        abilities.push(pokemon.abilities[abilityIndex].ability.name);
    }
    let typeString = types.join(', ');
    let abilityString = abilities.join(', ');
    let pokemonHeight = pokemon.height / 10;
    let pokemonWeight = pokemon.weight / 10;
    const evolutionChain = parseEvolutionChain(pokemon.evolution_chain);
    
    return getPokemonStatsHTML(pokemon, sprites, typeString, abilityString, pokemonHeight, pokemonWeight, evolutionChain);
}

//--------------------------------------------------------------------------------------> Base stats template
function getStatsTemplate(stats) {
    let statsHTML = '';
    
    for (let statIndex = 0; statIndex < stats.length; statIndex++) {
        let stat = stats[statIndex];
        let statName = stat.stat.name;
        let statValue = stat.base_stat;
        
        // Calculate percentage for stat bar (max 255 for pokemon stats thanks gpt :d )
        let percentage = Math.min((statValue / 255) * 100, 100);
        statsHTML += getStatTemplate(statName, statValue, percentage);
    }
    
    return statsHTML;
}

//--------------------------------------------------------------------------------------> stat row template
function getStatTemplate(statName, statValue, percentage) {
    return getStatRowHTML(statName, statValue, percentage);
}

//--------------------------------------------------------------------------------------> loading template
function getLoadingTemplate(message) {
    return getLoadingHTML(message);
}

//--------------------------------------------------------------------------------------> error template
function getErrorTemplate(message) {
    return getErrorHTML(message);
}