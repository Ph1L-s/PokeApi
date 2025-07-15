/* templates-helpers.js*/

//--------------------------------------------------------------------------------------> Type Badge HTML Function
function getTypeBadgeHTML(typeName) {
    return `<span class="type_badge type_${typeName}">${typeName}</span>`;
}

//--------------------------------------------------------------------------------------> pokemon card HTMLs
function getPokemonCardHTML(pokemon, sprites, typeBadgesHTML, dataAttributes) {
    return `
        <div class="pokemon_card_mini" ${dataAttributes} onclick="showPokemonDetails(${pokemon.id})">
            <div class="pokemon_image_mini">
                <img src="${sprites.front}" 
                     alt="${pokemon.name}" 
                     class="pokemon_sprite_mini"
                     onerror="this.src='${sprites.artwork}'">
            </div>
            <div class="pokemon_info_mini">
                <h4 class="pokemon_name_mini">${pokemon.name}</h4>
                <p class="pokemon_id_mini">No. ${pokemon.id}</p>
                <div class="pokemon_types_mini">${typeBadgesHTML}</div>
            </div>
        </div>
    `;
}

//--------------------------------------------------------------------------------------> generation Button HTML
function getGenerationButtonHTML(generationId) {
    return `
        <button class="generation_button" onclick="loadGeneration(${generationId})">
            GEN ${generationId}
        </button>
    `;
}

//--------------------------------------------------------------------------------------> generations container HTML
function getGenerationsContainerHTML(normalGenerationsHTML) {
    return `
        <button class="generation_button generation_all" onclick="loadAllGenerations()">
            ALL
        </button>
        ${normalGenerationsHTML}
    `;
}

//--------------------------------------------------------------------------------------> no Pokemon HTML
function getNoPokemonHTML() {
    return '<div class="no_pokemon">No pokemon loaded</div>';
}

//--------------------------------------------------------------------------------------> no search results HTML
function getNoSearchResultsHTML() { 
    return `
        <div class="no_search_results">
            <div class="no_search_icon">
                <img src="../../../resources/icons/search.png" alt="Search Icon" />
            </div>
            <h3>No Pokemon Found</h3>
            <p>No Pokemon found for "<strong>${currentSearchTerm}</strong>"</p>
            <p>Try searching for a different name or Pokemon number.</p>
            <button class="clear_search_button" onclick="clearSearch()">
                Clear Search
            </button>
        </div>
    `;
}

//--------------------------------------------------------------------------------------> limiter controls HTML
function getLimiterHTML(currentPage, totalPages, startPokemon, endPokemon, totalPokemon, previousClass, nextClass, previousDisabled, nextDisabled) {
    return `
        <div class="Limiter_container">
            <div class="Limiter_info">
                <span class="pokemon_count_Limiter">Showing ${startPokemon}-${endPokemon} of ${totalPokemon} Pokemon</span>
            </div>
            <div class="Limiter_controls">
                <button class="Limiter_button ${previousClass}" 
                        onclick="loadPreviousPage()" 
                        ${previousDisabled ? 'disabled' : ''}>
                    ← Previous
                </button>
                <span class="Limiter_current">Page ${currentPage} of ${totalPages}</span>
                <button class="Limiter_button ${nextClass}" 
                        onclick="loadNextPage()" 
                        ${nextDisabled ? 'disabled' : ''}>
                        Next →
                    </button>
                </div>
            </div>`;
}

//--------------------------------------------------------------------------------------> no evolution HTML
function getNoEvolutionHTML() {
    return '<div class="evolution_chain"><p class="no_evolution">No evolutions available</p></div>';
}

//--------------------------------------------------------------------------------------> Evolution chain container HTML
function getEvolutionChainHTML(evolutionStagesHTML) {
    return `<div class="evolution_chain">${evolutionStagesHTML}</div>`;
}

//--------------------------------------------------------------------------------------> Evolution stage HTML
function getEvolutionStageHTML(evo, sprites) {
    return `
        <div class="evolution_stage">
            <img src="${sprites.front}" 
                 alt="${evo.name}" 
                 class="evolution_sprite"
                 onclick="loadEvolutionPokemon(${evo.id})"
                 onerror="this.src='${sprites.artwork}'">
            <p class="evolution_name">${evo.name}</p>
        </div>`;
}

//--------------------------------------------------------------------------------------> Evolution arrow HTML
function getEvolutionArrowHTML() {
    return '<div class="evolution_arrow">→</div>';
}

//--------------------------------------------------------------------------------------> Pokemon stats HTML 
function getPokemonStatsHTML(pokemon, sprites, typeBadgesHTML, abilityString, pokemonHeight, pokemonWeight, evolutionChainHTML, statsHTML, dataAttributes) {
    return `
        <div class="stats_overlay" onclick="closeStats()">
            <div class="stats_content" ${dataAttributes} onclick="event.stopPropagation()">
                <button class="stats_close" onclick="closeStats()">×</button>
                
                <div class="stats_header">
                    <h2>${pokemon.name}</h2>
                    <p>No. ${pokemon.id}</p>
                </div>
                
                <div class="stats_images">
                    <img src="${sprites.artwork}" alt="${pokemon.name}" class="main_image">
                    ${evolutionChainHTML}
                </div>
                
                <div class="stats_info">
                    <div class="info_section">
                        <h3>Basic Info</h3>
                        <div class="info_row">
                            <span class="info_label">Types:</span>
                            <div class="type_badges_container">${typeBadgesHTML}</div>
                        </div>
                        <p>Height: ${pokemonHeight}m</p>
                        <p>Weight: ${pokemonWeight}kg</p>
                        <p>Abilities: ${abilityString}</p>
                    </div>
                    
                    <div class="info_section">
                        <h3>Base Stats</h3>
                        ${statsHTML}
                    </div>
                </div>
            </div>
        </div>
    `;
}

//--------------------------------------------------------------------------------------> stats modal content HTML 
function getStatsModalContentHTML(pokemon, sprites, typeBadgesHTML, abilityString, pokemonHeight, pokemonWeight, evolutionChain) {
    return `
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
                <div class="info_row">
                    <span class="info_label">Types:</span>
                    <div class="type_badges_container">${typeBadgesHTML}</div>
                </div>
                <p>Height: ${pokemonHeight}m</p>
                <p>Weight: ${pokemonWeight}kg</p>
                <p>Abilities: ${abilityString}</p>
            </div>
            
            <div class="info_section">
                <h3>Base Stats</h3>
                ${getStatsTemplate(pokemon.stats)}
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

//--------------------------------------------------------------------------------------> search info HTML
function getSearchInfoHTML(resultCount, searchTerm, generationText) {
    return `
        <div class="search_info">
            <span class="search_term">"${searchTerm}"</span>
            <span class="search_results">${resultCount} results</span>
            <span class="search_location">in ${generationText}</span>
        </div>
    `;
}

//--------------------------------------------------------------------------------------> search suggestion HTML
function getSearchSuggestionHTML(suggestion) {
    return `
        <div class="search_suggestion" onclick="selectSearchSuggestion('${suggestion}')">
            ${suggestion}
        </div>
    `;
}

//--------------------------------------------------------------------------------------> loading overlay HTML
function getLoadingOverlayHTML(message) {
    return `
        <div class="loading_spinner"></div>
        <div class="loading_text">${message}</div>
    `;
}

//--------------------------------------------------------------------------------------> evolution loading HTML
function getEvolutionLoadingHTML() {
    return '<div class="evolution_loading">Loading evolution...</div>';
}

//--------------------------------------------------------------------------------------> evolution error HTML
function getEvolutionErrorHTML() {
    return '<div class="evolution_error">Error loading evolution</div>';
}

//--------------------------------------------------------------------------------------> compact generation button HTML
function getCompactGenerationButtonHTML(generationId) {
    return `
        <button class="generation_button_compact" onclick="loadGeneration(${generationId})">
            GEN ${generationId}
        </button>
    `;
}

//--------------------------------------------------------------------------------------> compact all generations button HTML
function getCompactAllGenerationsButtonHTML() {
    return `
        <button class="generation_button_compact generation_all" onclick="loadAllGenerations()">
            ALL
        </button>
    `;
}

//--------------------------------------------------------------------------------------> compact generations row HTML
function getCompactGenerationsRowHTML(buttonsHTML) {
    return `
        <div class="generations_row">
            ${buttonsHTML}
        </div>
    `;
}