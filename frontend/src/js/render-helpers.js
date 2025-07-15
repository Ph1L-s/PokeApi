function setupStatsContainer(container, pokemon) {
    container.innerHTML = getPokemonStatsTemplate(pokemon);
    container.classList.add('active');
    setupStatsContainerClickHandler(container);
}

function setupStatsContainerClickHandler(container) {
    container.onclick = function(event) {
        if (event.target === container || event.target.classList.contains('stats_overlay')) {
            closeStats();
        }
    };
}

function insertGenerationsIntoContainer(container, generations) {
    let normalGenerationsHTML = buildNormalGenerationsHTML(generations);
    let insertedSuccessfully = tryInsertGenerationsHTML(normalGenerationsHTML);
    
    if (!insertedSuccessfully) {
        handleGenerationsContainerFallback(container, normalGenerationsHTML);
    } else {
        logRenderMessage("Added generation buttons after existing 'All Generations' button");
    }
}

function handleGenerationsContainerFallback(container, normalGenerationsHTML) {
    logRenderMessage("No existing 'All Generations' button found, creating complete container");
    container.innerHTML = getGenerationsContainerTemplate(normalGenerationsHTML);
}

function prepareContainerForRender(container) {
    container.classList.remove('loading_state', 'error_state', 'has_overlay');
}

function renderEmptyPokemonGrid(container) {
    container.innerHTML = getNoPokemonTemplate();
    logRenderSuccess("empty pokemon grid");
}

function renderPokemonGridContent(container, pokemonList, page) {
    let htmlString = buildPokemonGridHTML(pokemonList, page);
    container.innerHTML = htmlString;
    logRenderSuccess("pokemon grid with limiter", pokemonList.length);
    addImageLoadingEffects();
}

function renderSearchResultsContent(container, pokemonList) {
    let htmlString = buildSearchResultsHTML(pokemonList);
    container.innerHTML = htmlString;
    updateContentHeaderForSearch(pokemonList.length);
    
    logRenderSuccess("search results", pokemonList.length);
    addImageLoadingEffects();
}

function updateContentHeaderText(contentHeader, resultCount) {
    let headerText = buildContentHeaderText(resultCount);
    contentHeader.textContent = headerText;
    logRenderMessage("Updated content header: " + headerText);
}

function buildNormalGenerationsHTML(generations) {
    let normalGenerationsHTML = '';
    for (let generationIndex = 0; generationIndex < generations.length; generationIndex++) {
        let generationId = generationIndex + 1;
        normalGenerationsHTML += getGenerationTemplate(generationId);
    }
    return normalGenerationsHTML;
}

function tryInsertGenerationsHTML(normalGenerationsHTML) {
    let allButton = document.getElementById('all_generations_button');
    if (allButton) {
        allButton.insertAdjacentHTML('afterend', normalGenerationsHTML);
        return true;
    } else {
        return tryInsertAfterGenerationAllButton(normalGenerationsHTML);
    }
}

function tryInsertAfterGenerationAllButton(normalGenerationsHTML) {
    let allButtons = document.getElementsByClassName('generation_all');
    if (allButtons.length > 0) {
        allButtons[0].insertAdjacentHTML('afterend', normalGenerationsHTML);
        return true;
    }
    return false;
}

function buildPokemonGridHTML(pokemonList, page) {
    let htmlString = '';
    for (let cardIndex = 0; cardIndex < pokemonList.length; cardIndex++) {
        htmlString += getPokemonCardTemplate(pokemonList[cardIndex]);
    }
    
    let totalPages = Math.ceil(totalPokemonInGeneration / pokemonPerPage);
    htmlString += getLimiterTemplate(page, totalPages, totalPokemonInGeneration);
    
    return htmlString;
}

function buildSearchResultsHTML(pokemonList) {
    let htmlString = '';
    for (let cardIndex = 0; cardIndex < pokemonList.length; cardIndex++) {
        htmlString += getPokemonCardTemplate(pokemonList[cardIndex]);
    }
    return htmlString;
}

function findContentHeaderElement() {
    let contentHeader = document.getElementById('content_header_title');
    
    if (!contentHeader) {
        contentHeader = findContentHeaderByClass();
    }
    
    return contentHeader;
}

function findContentHeaderByClass() {
    let contentHeaderDiv = document.getElementsByClassName('content_header')[0];
    if (contentHeaderDiv) {
        let h2Elements = contentHeaderDiv.getElementsByTagName('h2');
        if (h2Elements.length > 0) {
            return h2Elements[0];
        }
    }
    return null;
}

function buildContentHeaderText(resultCount) {
    if (currentSearchTerm === "") {
        return buildNormalHeaderText();
    } else {
        return buildSearchHeaderText(resultCount);
    }
}

function buildNormalHeaderText() {
    if (currentGeneration === 'all') {
        return 'Pokemon - All Generations';
    } else {
        return 'Pokemon - Generation ' + currentGeneration;
    }
}

function buildSearchHeaderText(resultCount) {
    let generationText = currentGeneration === 'all' ? 'All Generations' : 'Generation ' + currentGeneration;
    if (resultCount !== undefined) {
        return 'Search: "' + currentSearchTerm + '" (' + resultCount + ' results in ' + generationText + ')';
    } else {
        return 'Search: "' + currentSearchTerm + '" in ' + generationText;
    }
}

function removeActiveFromAllGenerationButtons() {
    removeActiveFromDesktopButtons();
    removeActiveFromMobileButtons();
}

function removeActiveFromDesktopButtons() {
    let desktopButtons = document.getElementsByClassName('generation_button');
    for (let buttonIndex = 0; buttonIndex < desktopButtons.length; buttonIndex++) {
        desktopButtons[buttonIndex].classList.remove('active');
    }
}

function removeActiveFromMobileButtons() {
    let mobileButtons = document.getElementsByClassName('generation_button_compact');
    for (let buttonIndex = 0; buttonIndex < mobileButtons.length; buttonIndex++) {
        mobileButtons[buttonIndex].classList.remove('active');
    }
}

function activateSpecificGenerationButton(generationId) {
    if (generationId === 'all') {
        activateAllGenerationButtons();
    } else {
        activateSpecificGenerationById(generationId);
    }
}

function activateAllGenerationButtons() {
    activateDesktopAllButton();
    activateMobileAllButton();
}

function activateDesktopAllButton() {
    let desktopAllButtons = document.getElementsByClassName('generation_button');
    for (let buttonIndex = 0; buttonIndex < desktopAllButtons.length; buttonIndex++) {
        if (desktopAllButtons[buttonIndex].classList.contains('generation_all')) {
            desktopAllButtons[buttonIndex].classList.add('active');
            break;
        }
    }
}

function activateMobileAllButton() {
    let mobileAllButtons = document.getElementsByClassName('generation_button_compact');
    for (let buttonIndex = 0; buttonIndex < mobileAllButtons.length; buttonIndex++) {
        if (mobileAllButtons[buttonIndex].classList.contains('generation_all')) {
            mobileAllButtons[buttonIndex].classList.add('active');
            break;
        }
    }
}

function activateSpecificGenerationById(generationId) {
    let expectedOnclick = 'loadGeneration(' + generationId + ')';
    
    activateDesktopButtonByOnclick(expectedOnclick);
    activateMobileButtonByOnclick(expectedOnclick);
}

function activateDesktopButtonByOnclick(expectedOnclick) {
    let desktopButtons = document.getElementsByClassName('generation_button');
    for (let buttonIndex = 0; buttonIndex < desktopButtons.length; buttonIndex++) {
        let button = desktopButtons[buttonIndex];
        let onclickAttr = button.getAttribute('onclick');
        if (onclickAttr === expectedOnclick) {
            button.classList.add('active');
            break;
        }
    }
}

function activateMobileButtonByOnclick(expectedOnclick) {
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

function updateCompactGenerationButtons() {
    let compactContainer = document.getElementById('compact_generations');
    if (compactContainer && pokedexData && pokedexData.generations) {
        compactContainer.innerHTML = getCompactGenerationsTemplate(pokedexData.generations);
    }
}

function findPokemonContainerElement() {
    let container = document.getElementById('pokemon_container');
    if (!container) {
        logErrorMessage("pokemon container not found");
        return null;
    }
    return container;
}

function addImageLoadingEffectsToContainer() {
    let images = document.getElementsByClassName('pokemon_sprite_mini');
    
    for (let imgIndex = 0; imgIndex < images.length; imgIndex++) {
        let img = images[imgIndex];
        processImageLoadingState(img);
    }
    
    return images.length;
}

function processImageLoadingState(img) {
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