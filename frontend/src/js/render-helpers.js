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
        return true;
    } else {
        let allButtons = document.getElementsByClassName('generation_all');
        if (allButtons.length > 0) {
            allButtons[0].insertAdjacentHTML('afterend', normalGenerationsHTML);
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
    let desktopButtons = document.getElementsByClassName('generation_button');
    for (let buttonIndex = 0; buttonIndex < desktopButtons.length; buttonIndex++) {
        desktopButtons[buttonIndex].classList.remove('active');
    }
    
    let mobileButtons = document.getElementsByClassName('generation_button_compact');
    for (let buttonIndex = 0; buttonIndex < mobileButtons.length; buttonIndex++) {
        mobileButtons[buttonIndex].classList.remove('active');
    }
}

//--------------------------------------------------------------------------------------> activate specific generation button
function activateSpecificGenerationButton(generationId) {
    if (generationId === 'all') {
        let desktopAllButtons = document.getElementsByClassName('generation_button');
        for (let buttonIndex = 0; buttonIndex < desktopAllButtons.length; buttonIndex++) {
            if (desktopAllButtons[buttonIndex].classList.contains('generation_all')) {
                desktopAllButtons[buttonIndex].classList.add('active');
                break;
            }
        }
        
        let mobileAllButtons = document.getElementsByClassName('generation_button_compact');
        for (let buttonIndex = 0; buttonIndex < mobileAllButtons.length; buttonIndex++) {
            if (mobileAllButtons[buttonIndex].classList.contains('generation_all')) {
                mobileAllButtons[buttonIndex].classList.add('active');
                break;
            }
        }
    } else {
        let expectedOnclick = 'loadGeneration(' + generationId + ')';
        
        let desktopButtons = document.getElementsByClassName('generation_button');
        for (let buttonIndex = 0; buttonIndex < desktopButtons.length; buttonIndex++) {
            let button = desktopButtons[buttonIndex];
            let onclickAttr = button.getAttribute('onclick');
            if (onclickAttr === expectedOnclick) {
                button.classList.add('active');
                break;
            }
        }

        let mobileButtons = document.getElementsByClassName('generation_button_compact');
        for (let buttonIndex = 0; buttonIndex < mobileButtons.length; buttonIndex++) {
            let button = mobileButtons[buttonIndex];
            let onclickAttr = button.getAttribute('onclick');
            if (onclickAttr === expectedOnclick) {
                button.classList.add('active');
                break;
            }
        }
    }
}

//--------------------------------------------------------------------------------------> update compact generation buttons
function updateCompactGenerationButtons() {
    let compactContainer = document.getElementById('compact_generations');
    if (compactContainer && pokedexData && pokedexData.generations) {
        compactContainer.innerHTML = getCompactGenerationsTemplate(pokedexData.generations);
    }
}

//--------------------------------------------------------------------------------------> find pokemon container element
function findPokemonContainerElement() {
    let container = document.getElementById('pokemon_container');
    if (!container) {
        logErrorMessage("pokemon container not found");
        return null;
    }
    return container;
}

//--------------------------------------------------------------------------------------> add image loading effects helper
function addImageLoadingEffectsToContainer() {
    let images = document.getElementsByClassName('pokemon_sprite_mini');
    
    for (let imgIndex = 0; imgIndex < images.length; imgIndex++) {
        let img = images[imgIndex];
        img.classList.add('loading');

        if (img.complete && img.naturalHeight !== 0) {
            img.classList.remove('loading');
            img.classList.add('loaded');
        } else if (img.complete && img.naturalHeight === 0) {
            img.classList.remove('loading');
            img.classList.add('error');
            logErrorMessage("Image failed to load: " + img.alt);
        }
    }
    
    return images.length;
}