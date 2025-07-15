/*  render-helpers.js */

//--------------------------------------------------------------------------------------> log stats container not found
function logStatsContainerNotFound() {
    logErrorMessage("stats container not found");
}

//--------------------------------------------------------------------------------------> log stats render success
function logStatsRenderSuccess(pokemonName) {
    logRenderSuccess("pokemon stats for " + pokemonName);
}

//--------------------------------------------------------------------------------------> log generations container not found
function logGenerationsContainerNotFound() {
    logErrorMessage("generations container not found");
}

//--------------------------------------------------------------------------------------> log generations render success
function logGenerationsRenderSuccess(generationsCount) {
    logRenderSuccess("generations", generationsCount);
}

//--------------------------------------------------------------------------------------> log no search results render
function logNoSearchResultsRender() {
    logRenderSuccess("no search results for '" + currentSearchTerm + "'");
}

//--------------------------------------------------------------------------------------> setup stats container with content and events
function setupStatsContainer(container, pokemon) {
    container.innerHTML = getPokemonStatsTemplate(pokemon);
    container.classList.add('active');
    setupStatsContainerClickHandler(container);
}

//--------------------------------------------------------------------------------------> setup stats container click handler
function setupStatsContainerClickHandler(container) {
    container.onclick = function(event) {
        if (event.target === container || event.target.classList.contains('stats_overlay')) {
            closeStats();
        }
    };
}

//--------------------------------------------------------------------------------------> insert generations into container
function insertGenerationsIntoContainer(container, generations) {
    let normalGenerationsHTML = buildNormalGenerationsHTML(generations);
    let insertedSuccessfully = tryInsertGenerationsHTML(normalGenerationsHTML);
    
    if (!insertedSuccessfully) {
        handleGenerationsContainerFallback(container, normalGenerationsHTML);
    } else {
        logGenerationsInsertSuccess();
    }
}

//--------------------------------------------------------------------------------------> log generations insert success
function logGenerationsInsertSuccess() {
    logRenderMessage("Added generation buttons after existing 'All Generations' button");
}

//--------------------------------------------------------------------------------------> handle generations container fallback
function handleGenerationsContainerFallback(container, normalGenerationsHTML) {
    logRenderMessage("No existing 'All Generations' button found, creating complete container");
    container.innerHTML = getGenerationsContainerTemplate(normalGenerationsHTML);
}

//--------------------------------------------------------------------------------------> prepare container for rendering
function prepareContainerForRender(container) {
    container.classList.remove('loading_state', 'error_state', 'has_overlay');
}

//--------------------------------------------------------------------------------------> render empty pokemon grid
function renderEmptyPokemonGrid(container) {
    container.innerHTML = getNoPokemonTemplate();
    logRenderSuccess("empty pokemon grid");
}

//--------------------------------------------------------------------------------------> render pokemon grid content
function renderPokemonGridContent(container, pokemonList, page) {
    let htmlString = buildPokemonGridHTML(pokemonList, page);
    container.innerHTML = htmlString;
    logRenderSuccess("pokemon grid with limiter", pokemonList.length);
    addImageLoadingEffects();
}

//--------------------------------------------------------------------------------------> render search results content
function renderSearchResultsContent(container, pokemonList) {
    let htmlString = buildSearchResultsHTML(pokemonList);
    container.innerHTML = htmlString;
    updateContentHeaderForSearch(pokemonList.length);
    
    logRenderSuccess("search results", pokemonList.length);
    addImageLoadingEffects();
}

//--------------------------------------------------------------------------------------> update content header text
function updateContentHeaderText(contentHeader, resultCount) {
    let headerText = buildContentHeaderText(resultCount);
    contentHeader.textContent = headerText;
    logRenderMessage("Updated content header: " + headerText);
}

//--------------------------------------------------------------------------------------> log content header error
function logContentHeaderError() {
    logErrorMessage("Content header element not found - add id='content_header_title' to your h2 or ensure .content_header class exists");
}

//--------------------------------------------------------------------------------------> log image loading effects
function logImageLoadingEffects(imageCount) {
    logRenderMessage("Adding loading effects to " + imageCount + " pokemon images");
    logRenderMessage("Loading effects added to all pokemon images");
}

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
        return tryInsertAfterGenerationAllButton(normalGenerationsHTML);
    }
}

//--------------------------------------------------------------------------------------> try insert after generation all button
function tryInsertAfterGenerationAllButton(normalGenerationsHTML) {
    let allButtons = document.getElementsByClassName('generation_all');
    if (allButtons.length > 0) {
        allButtons[0].insertAdjacentHTML('afterend', normalGenerationsHTML);
        return true;
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
        contentHeader = findContentHeaderByClass();
    }
    
    return contentHeader;
}

//--------------------------------------------------------------------------------------> find content header by class
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

//--------------------------------------------------------------------------------------> build content header text
function buildContentHeaderText(resultCount) {
    if (currentSearchTerm === "") {
        return buildNormalHeaderText();
    } else {
        return buildSearchHeaderText(resultCount);
    }
}

//--------------------------------------------------------------------------------------> build normal header text
function buildNormalHeaderText() {
    if (currentGeneration === 'all') {
        return 'Pokemon - All Generations';
    } else {
        return 'Pokemon - Generation ' + currentGeneration;
    }
}

//--------------------------------------------------------------------------------------> build search header text
function buildSearchHeaderText(resultCount) {
    let generationText = currentGeneration === 'all' ? 'All Generations' : 'Generation ' + currentGeneration;
    if (resultCount !== undefined) {
        return 'Search: "' + currentSearchTerm + '" (' + resultCount + ' results in ' + generationText + ')';
    } else {
        return 'Search: "' + currentSearchTerm + '" in ' + generationText;
    }
}

//--------------------------------------------------------------------------------------> remove active from all generation buttons
function removeActiveFromAllGenerationButtons() {
    removeActiveFromDesktopButtons();
    removeActiveFromMobileButtons();
}

//--------------------------------------------------------------------------------------> remove active from desktop buttons
function removeActiveFromDesktopButtons() {
    let desktopButtons = document.getElementsByClassName('generation_button');
    for (let buttonIndex = 0; buttonIndex < desktopButtons.length; buttonIndex++) {
        desktopButtons[buttonIndex].classList.remove('active');
    }
}

//--------------------------------------------------------------------------------------> remove active from mobile buttons
function removeActiveFromMobileButtons() {
    let mobileButtons = document.getElementsByClassName('generation_button_compact');
    for (let buttonIndex = 0; buttonIndex < mobileButtons.length; buttonIndex++) {
        mobileButtons[buttonIndex].classList.remove('active');
    }
}

//--------------------------------------------------------------------------------------> activate specific generation button
function activateSpecificGenerationButton(generationId) {
    if (generationId === 'all') {
        activateAllGenerationButtons();
    } else {
        activateSpecificGenerationById(generationId);
    }
}

//--------------------------------------------------------------------------------------> activate all generation buttons
function activateAllGenerationButtons() {
    activateDesktopAllButton();
    activateMobileAllButton();
}

//--------------------------------------------------------------------------------------> activate desktop all button
function activateDesktopAllButton() {
    let desktopAllButtons = document.getElementsByClassName('generation_button');
    for (let buttonIndex = 0; buttonIndex < desktopAllButtons.length; buttonIndex++) {
        if (desktopAllButtons[buttonIndex].classList.contains('generation_all')) {
            desktopAllButtons[buttonIndex].classList.add('active');
            break;
        }
    }
}

//--------------------------------------------------------------------------------------> activate mobile all button
function activateMobileAllButton() {
    let mobileAllButtons = document.getElementsByClassName('generation_button_compact');
    for (let buttonIndex = 0; buttonIndex < mobileAllButtons.length; buttonIndex++) {
        if (mobileAllButtons[buttonIndex].classList.contains('generation_all')) {
            mobileAllButtons[buttonIndex].classList.add('active');
            break;
        }
    }
}

//--------------------------------------------------------------------------------------> activate specific generation by ID
function activateSpecificGenerationById(generationId) {
    let expectedOnclick = 'loadGeneration(' + generationId + ')';
    
    activateDesktopButtonByOnclick(expectedOnclick);
    activateMobileButtonByOnclick(expectedOnclick);
}

//--------------------------------------------------------------------------------------> activate desktop button by onclick
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

//--------------------------------------------------------------------------------------> activate mobile button by onclick
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
        processImageLoadingState(img);
    }
    
    return images.length;
}

//--------------------------------------------------------------------------------------> process image loading state
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

//--------------------------------------------------------------------------------------> activate specific generation by ID
function activateSpecificGenerationById(generationId) {
    let expectedOnclick = 'loadGeneration(' + generationId + ')';
    
    activateDesktopButtonByOnclick(expectedOnclick);
    activateMobileButtonByOnclick(expectedOnclick);
}

//--------------------------------------------------------------------------------------> activate desktop button by onclick
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

//--------------------------------------------------------------------------------------> activate mobile button by onclick
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
        processImageLoadingState(img);
    }
    
    return images.length;
}

//--------------------------------------------------------------------------------------> process image loading state
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