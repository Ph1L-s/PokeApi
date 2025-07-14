/* template.js */
//--------------------------------------------------------------------------------------> pokemon cardtemplate 
function getPokemonCardTemplate(pokemon) {
    let sprites = getPokemonSprites(pokemon.id);
    let typeBadges = [];
    
    for (let typeIndex = 0; typeIndex < pokemon.types.length; typeIndex++) {
        let typeName = pokemon.types[typeIndex].type.name;
        typeBadges.push(getTypeBadgeHTML(typeName));  
    }
    
    let typeBadgesHTML = typeBadges.join(' ');
    
    return getPokemonCardHTML(pokemon, sprites, typeBadgesHTML);
}

//--------------------------------------------------------------------------------------> Pokemon stats template 
function getPokemonStatsTemplate(pokemon) {
    let sprites = getPokemonSprites(pokemon.id);
    let typeBadges = [];
    let abilities = [];
    
    for (let typeIndex = 0; typeIndex < pokemon.types.length; typeIndex++) {
        let typeName = pokemon.types[typeIndex].type.name;
        typeBadges.push(getTypeBadgeHTML(typeName)); 
    }
    
    for (let abilityIndex = 0; abilityIndex < pokemon.abilities.length; abilityIndex++) {
        abilities.push(pokemon.abilities[abilityIndex].ability.name);
    }
    
    let typeBadgesHTML = typeBadges.join(' ');
    let abilityString = abilities.join(', ');
    let pokemonHeight = pokemon.height / 10;
    let pokemonWeight = pokemon.weight / 10;
    const evolutionChain = parseEvolutionChain(pokemon.evolution_chain);
    
    return getPokemonStatsHTML(pokemon, sprites, typeBadgesHTML, abilityString, pokemonHeight, pokemonWeight, evolutionChain);
}

//--------------------------------------------------------------------------------------> generation Buttontemplate
function getGenerationTemplate(generationId) {
    return getGenerationButtonHTML(generationId);
}

//--------------------------------------------------------------------------------------> generations container template
function getGenerationsContainerTemplate(normalGenerationsHTML) {
    return getGenerationsContainerHTML(normalGenerationsHTML);
}

//--------------------------------------------------------------------------------------> no Pokemon template
function getNoPokemonTemplate() {
    return getNoPokemonHTML();
}

//--------------------------------------------------------------------------------------> no search results template
function getNoSearchResultsTemplate() {
    return getNoSearchResultsHTML();
}

//--------------------------------------------------------------------------------------> limiter controls template
function getLimiterTemplate(currentPage, totalPages, totalPokemon) {
    let startPokemon = (currentPage - 1) * pokemonPerPage + 1;
    let endPokemon = Math.min(currentPage * pokemonPerPage, totalPokemon);
    
    return getLimiterHTML(currentPage, totalPages, startPokemon, endPokemon, totalPokemon);
}

//--------------------------------------------------------------------------------------> Evolution chaintemplate  
function getEvolutionChainTemplate(evolutionChain) {
    if (!evolutionChain || evolutionChain.length <= 1) {
        return getNoEvolutionHTML();
    }
    
    return getEvolutionChainHTML(evolutionChain);
}

//--------------------------------------------------------------------------------------> Base stats template
function getStatsTemplate(stats) {
    let statsHTML = '';
    
    for (let statIndex = 0; statIndex < stats.length; statIndex++) {
        let stat = stats[statIndex];
        let statName = stat.stat.name;
        let statValue = stat.base_stat;
        
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

//--------------------------------------------------------------------------------------> search info template  
function getSearchInfoTemplate(resultCount, searchTerm, generationText) {
    return getSearchInfoHTML(resultCount, searchTerm, generationText);
}

//--------------------------------------------------------------------------------------> search suggestion template
function getSearchSuggestionTemplate(suggestion) {
    return getSearchSuggestionHTML(suggestion);
}

//--------------------------------------------------------------------------------------> loading overlay template
function getLoadingOverlayTemplate(message) {
    return getLoadingOverlayHTML(message);
}

//--------------------------------------------------------------------------------------> compact generation button template
function getCompactGenerationTemplate(generationId) {
    return getCompactGenerationButtonHTML(generationId);
}

//--------------------------------------------------------------------------------------> compact generations container template
function getCompactGenerationsTemplate(generations) {
    let compactHTML = '';
    
    let allButtonHTML = getCompactAllGenerationsButtonHTML();
    compactHTML += getCompactGenerationsRowHTML(allButtonHTML);

    let currentRowHTML = '';
    for (let genIndex = 0; genIndex < generations.length; genIndex++) {
        let generationId = genIndex + 1;
        currentRowHTML += getCompactGenerationTemplate(generationId);
        
        let rowIsFull = currentRowHTML.split('generation_button_compact').length - 1 >= 2;
        let isLastGeneration = genIndex === generations.length - 1;
        
        if (rowIsFull || isLastGeneration) {
            compactHTML += getCompactGenerationsRowHTML(currentRowHTML);
            currentRowHTML = '';
        }
    }
    
    return compactHTML;
}