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
    let primaryType = pokemon.types[0].type.name;
    let secondaryType = pokemon.types.length > 1 ? pokemon.types[1].type.name : null;
    
    let dataAttributes = `data-primary-type="${primaryType}"`;
    if (secondaryType) {
        dataAttributes += ` data-secondary-type="${secondaryType}"`;
    }
    
    return getPokemonCardHTML(pokemon, sprites, typeBadgesHTML, dataAttributes);
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
    
    return preparePokemonStatsData(pokemon, sprites, typeBadges, abilities);
}

//--------------------------------------------------------------------------------------> prepare pokemon stats data
function preparePokemonStatsData(pokemon, sprites, typeBadges, abilities) {
    let typeBadgesHTML = typeBadges.join(' ');
    let abilityString = abilities.join(', ');
    let pokemonHeight = pokemon.height / 10;
    let pokemonWeight = pokemon.weight / 10;
    let evolutionChain = parseEvolutionChain(pokemon.evolution_chain);
    let primaryType = pokemon.types[0].type.name;
    let evolutionChainHTML = getEvolutionChainTemplate(evolutionChain);
    let statsHTML = getStatsTemplate(pokemon.stats);
    
    let dataAttributes = `data-primary-type="${primaryType}"`;
    
    return getPokemonStatsHTML(pokemon, sprites, typeBadgesHTML, abilityString, pokemonHeight, pokemonWeight, evolutionChainHTML, statsHTML, dataAttributes);
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
    
    let previousDisabled = currentPage === 1;
    let nextDisabled = currentPage === totalPages;
    let previousClass = previousDisabled ? 'disabled' : '';
    let nextClass = nextDisabled ? 'disabled' : '';
    
    return getLimiterHTML(currentPage, totalPages, startPokemon, endPokemon, totalPokemon, previousClass, nextClass, previousDisabled, nextDisabled);
}

//--------------------------------------------------------------------------------------> Evolution chaintemplate  
function getEvolutionChainTemplate(evolutionChain) {
    if (!evolutionChain || evolutionChain.length <= 1) {
        return getNoEvolutionHTML();
    }
    
    let evolutionStagesHTML = prepareEvolutionStages(evolutionChain);
    return getEvolutionChainHTML(evolutionStagesHTML);
}

//--------------------------------------------------------------------------------------> prepare evolution stages
function prepareEvolutionStages(evolutionChain) {
    let evolutionStagesHTML = '';
    
    for (let evolutionChainIndex = 0; evolutionChainIndex < evolutionChain.length; evolutionChainIndex++) {
        const evo = evolutionChain[evolutionChainIndex];
        if (!evo.id) continue;
        
        const sprites = getPokemonSprites(evo.id);
        evolutionStagesHTML += getEvolutionStageHTML(evo, sprites);
        
        if (evolutionChainIndex < evolutionChain.length - 1) {
            evolutionStagesHTML += getEvolutionArrowHTML();
        }
    }
    
    return evolutionStagesHTML;
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
    let allButtonHTML = getCompactAllGenerationsButtonHTML();
    let compactHTML = getCompactGenerationsRowHTML(allButtonHTML);

    let generationRowsHTML = prepareCompactGenerationsRows(generations);
    compactHTML += generationRowsHTML;
    
    return compactHTML;
}

//--------------------------------------------------------------------------------------> prepare compact generations rows
function prepareCompactGenerationsRows(generations) {
    let rowsHTML = '';
    let currentRowHTML = '';
    
    for (let genIndex = 0; genIndex < generations.length; genIndex++) {
        let generationId = genIndex + 1;
        currentRowHTML += getCompactGenerationTemplate(generationId);
        
        let rowIsFull = currentRowHTML.split('generation_button_compact').length - 1 >= 2;
        let isLastGeneration = genIndex === generations.length - 1;
        
        if (rowIsFull || isLastGeneration) {
            rowsHTML += getCompactGenerationsRowHTML(currentRowHTML);
            currentRowHTML = '';
        }
    }
    
    return rowsHTML;
}