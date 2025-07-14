/*  render-helpers.js */

//--------------------------------------------------------------------------------------> build normal generations HTML
function buildNormalGenerationsHTML(generations) {
    let normalGenerationsHTML = '';
    for (let generationIndex = 0; generationIndex < generations.length; generationIndex++) {
        let generationId = generationIndex + 1;
        normalGenerationsHTML += getGenerationTemplate(generationId);
    }
    return normalGenerationsHTML;
}

//--------------------------------------------------------------------------------------> try insert generations HTML
function tryInsertGenerationsHTML(normalGenerationsHTML) {
    let allButton = document.getElementById('all_generations_button');
    if (allButton) {
        allButton.insertAdjacentHTML('afterend', normalGenerationsHTML);
        logRenderMessage("Added generation buttons after existing 'All Generations' button");
        return true;
    } else {
        let allButtons = document.getElementsByClassName('generation_all');
        if (allButtons.length > 0) {
            allButtons[0].insertAdjacentHTML('afterend', normalGenerationsHTML);
            logRenderMessage("Added generation buttons after 'All Generations' button (found by class)");
            return true;
        }
    }
    return false;
}

//--------------------------------------------------------------------------------------> build pokemon grid HTML
function buildPokemonGridHTML(pokemonList, page) {
    let htmlString = '';
    for (let cardIndex = 0; cardIndex < pokemonList.length; cardIndex++) {
        htmlString += getPokemonCardTemplate(pokemonList[cardIndex]);
    }
    
    let totalPages = Math.ceil(totalPokemonInGeneration / pokemonPerPage);
    htmlString += getLimiterTemplate(page, totalPages, totalPokemonInGeneration);
    
    return htmlString;
}

//--------------------------------------------------------------------------------------> build search results HTML
function buildSearchResultsHTML(pokemonList) {
    let htmlString = '';
    for (let cardIndex = 0; cardIndex < pokemonList.length; cardIndex++) {
        htmlString += getPokemonCardTemplate(pokemonList[cardIndex]);
    }
    return htmlString;
}

//--------------------------------------------------------------------------------------> find content header element
function findContentHeaderElement() {
    let contentHeader = document.getElementById('content_header_title');
    
    if (!contentHeader) {
        let contentHeaderDiv = document.getElementsByClassName('content_header')[0];
        if (contentHeaderDiv) {
            let h2Elements = contentHeaderDiv.getElementsByTagName('h2');
            if (h2Elements.length > 0) {
                contentHeader = h2Elements[0];
                logRenderMessage("Found content header via class and tag name");
            }
        }
    }
    
    return contentHeader;
}

//--------------------------------------------------------------------------------------> build content header text
function buildContentHeaderText(resultCount) {
    if (currentSearchTerm === "") {
        if (currentGeneration === 'all') {
            return 'Pokemon - All Generations';
        } else {
            return 'Pokemon - Generation ' + currentGeneration;
        }
    } else {
        let generationText = currentGeneration === 'all' ? 'All Generations' : 'Generation ' + currentGeneration;
        if (resultCount !== undefined) {
            return 'Search: "' + currentSearchTerm + '" (' + resultCount + ' results in ' + generationText + ')';
        } else {
            return 'Search: "' + currentSearchTerm + '" in ' + generationText;
        }
    }
}

//--------------------------------------------------------------------------------------> remove active from all generation buttons
function removeActiveFromAllGenerationButtons() {
    let allButtons = document.getElementsByClassName('generation_button');
    logRenderMessage("Found " + allButtons.length + " generation buttons to deactivate");
    
    for (let buttonIndex = 0; buttonIndex < allButtons.length; buttonIndex++) {
        let button = allButtons[buttonIndex];
        button.classList.remove('active');
    }
    logRenderMessage("Removed active class from all generation buttons");
}

//--------------------------------------------------------------------------------------> activate specific generation button
function activateSpecificGenerationButton(generationId) {
    logRenderMessage("Activating button for generation: " + generationId);
    
    if (generationId === 'all') {
        let allButtons = document.getElementsByClassName('generation_all');
        if (allButtons.length > 0) {
            allButtons[0].classList.add('active');
            logRenderMessage("Activated 'All Generations' button");
        } else {
            logErrorMessage("All Generations button not found by class");
        }
    } else {
        let allButtons = document.getElementsByClassName('generation_button');
        let expectedOnclick = 'loadGeneration(' + generationId + ')';
        
        for (let buttonIndex = 0; buttonIndex < allButtons.length; buttonIndex++) {
            let button = allButtons[buttonIndex];
            let onclickAttr = button.getAttribute('onclick');
            
            if (onclickAttr === expectedOnclick) {
                button.classList.add('active');
                logRenderMessage("Activated Generation " + generationId + " button");
                return;
            }
        }
        
        logErrorMessage("Generation " + generationId + " button not found");
    }
}