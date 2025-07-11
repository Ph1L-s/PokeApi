//--------------------------------------------------------------------------------------> Templates-HTML.js

//--------------------------------------------------------------------------------------> generation Button HTML
function getGenerationButtonHTML(generationId) {
    return `
        <button class="generation_button" onclick="loadGeneration(${generationId})">
            Generation ${generationId}
        </button>
    `;
}

//--------------------------------------------------------------------------------------> no Pokemon HTML
function getNoPokemonHTML() {
    return '<div class="no_pokemon">No pokemon loaded</div>';
}

//--------------------------------------------------------------------------------------> pokemon card HTML
function getPokemonCardHTML(pokemon, sprites, typeString) {
    return `
        <div class="pokemon_card_mini" onclick="showPokemonDetails(${pokemon.id})">
            <div class="pokemon_image_mini">
                <img src="${sprites.front}" 
                     alt="${pokemon.name}" 
                     class="pokemon_sprite_mini"
                     onerror="this.src='${sprites.artwork}'">
            </div>
            <div class="pokemon_info_mini">
                <h4 class="pokemon_name_mini">${pokemon.name}</h4>
                <p class="pokemon_id_mini">No. ${pokemon.id}</p>
                <p class="pokemon_types_mini">${typeString}</p>
            </div>
        </div>
    `;
}

//--------------------------------------------------------------------------------------> limiter controls HTML
function getLimiterHTML(currentPage, totalPages, startPokemon, endPokemon, totalPokemon) {
    return `
        <div class="Limiter_container">
            <div class="Limiter_info">
                <span class="pokemon_count_Limiter">Showing ${startPokemon}-${endPokemon} of ${totalPokemon} Pokemon</span>
            </div>
            <div class="Limiter_controls">
                <button class="Limiter_button ${currentPage === 1 ? 'disabled' : ''}" 
                        onclick="loadPreviousPage()" 
                        ${currentPage === 1 ? 'disabled' : ''}>
                    ← Previous
                </button>
                <span class="Limiter_current">Page ${currentPage} of ${totalPages}</span>
                <button class="Limiter_button ${currentPage === totalPages ? 'disabled' : ''}" 
                        onclick="loadNextPage()" 
                        ${currentPage === totalPages ? 'disabled' : ''}>
                        Next →
                    </button>
                </div>
            </div>`;
}

//--------------------------------------------------------------------------------------> no evolution HTML
function getNoEvolutionHTML() {
    return '<div class="evolution_chain"><p class="no_evolution">No evolutions available</p></div>';
}

//--------------------------------------------------------------------------------------> Evolution chain HTML
function getEvolutionChainHTML(evolutionChain) {
    let evolutionHTML = '<div class="evolution_chain">';
    for (let evolutionChainIndex = 0; evolutionChainIndex < evolutionChain.length; evolutionChainIndex++) {
        const evo = evolutionChain[evolutionChainIndex];
        if (!evo.id) continue;
        const sprites = getPokemonSprites(evo.id);
        evolutionHTML += `
            <div class="evolution_stage">
                <img src="${sprites.front}" 
                     alt="${evo.name}" 
                     class="evolution_sprite"
                     onerror="this.src='${sprites.artwork}'">
                <p class="evolution_name">${evo.name}</p>
            </div>`;
        if (evolutionChainIndex < evolutionChain.length - 1) {
            evolutionHTML += '<div class="evolution_arrow">→</div>';
        }
    }
    evolutionHTML += '</div>';
    return evolutionHTML;
}

//--------------------------------------------------------------------------------------> Pokemon stats HTML
function getPokemonStatsHTML(pokemon, sprites, typeString, abilityString, pokemonHeight, pokemonWeight, evolutionChain) {
    return `
        <div class="stats_overlay" onclick="closeStats()">
            <div class="stats_content" onclick="event.stopPropagation()">
                <button class="stats_close" onclick="closeStats()">×</button>
                
                <div class="stats_header">
                    <h2>${pokemon.name}</h2>
                    <p>No. ${pokemon.id}</p>
                </div>
                
                <div class="stats_images">
                    <img src="${sprites.artwork}" alt="${pokemon.name}" class="main_image">
                    
                    ${getEvolutionChainTemplate(evolutionChain)}
                </div>
                
                <div class="stats_info">
                    <div class="info_section">
                        <h3>Basic Info</h3>
                        <p>Types: ${typeString}</p>
                        <p>Height: ${pokemonHeight}m</p>
                        <p>Weight: ${pokemonWeight}kg</p>
                        <p>Abilities: ${abilityString}</p>
                    </div>
                    
                    <div class="info_section">
                        <h3>Base Stats</h3>
                        ${getStatsTemplate(pokemon.stats)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

//--------------------------------------------------------------------------------------> stat row HTML
function getStatRowHTML(statName, statValue, percentage) {
    return `
        <div class="stat_row">
            <span class="stat_name">${statName}</span>
            <span class="stat_value">${statValue}</span>
            <div class="stat_bar">
                <div class="stat_fill" style="width: ${percentage}%"></div>
            </div>
        </div>
    `;
}

//--------------------------------------------------------------------------------------> loading HTML
function getLoadingHTML(message) {
    return `<div class="loading_message">${message}</div>`;
}

//--------------------------------------------------------------------------------------> error HTML
function getErrorHTML(message) {
    return `<div class="error_message">${message}</div>`;
}