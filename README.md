# PokéDex Web App

A responsive PokéDex application built with vanilla JavaScript and the PokéAPI for browsing Pokémon across generations with real-time search functionality.

## Features

- Real-time search by name or Pokédex number
- Generation-based navigation (1-9 plus "All Generations")
- Detailed Pokémon information with stats and evolution chains
- Responsive design for desktop, tablet, and mobile
- Interactive cards with type-based styling
- Efficient pagination system

## Browser Compatibility

- Chrome 55+
- Firefox 52+
- Safari 10.1+
- Edge 79+

Requires ES6+ support for async/await and template literals.

## Project Structure

```
├── APIs/src/js/
│   ├── pokemon-api-base.js      # Core API calls and data fetching
│   ├── pokemon-details.js       # Evolution processing and enhanced details
│   ├── pokemon-generations.js   # Generation management
│   └── pokemon-init.js          # Application initialization
├── frontend/src/
│   ├── html/main.html           # Main application
│   ├── js/
│   │   ├── script.js            # Main application orchestration
│   │   ├── script-helpers.js    # Business logic and data processing
│   │   ├── render.js            # UI rendering coordination
│   │   ├── render-helpers.js    # DOM manipulation utilities
│   │   ├── template.js          # Template logic and data preparation
│   │   ├── template-helpers.js  # Pure HTML template generation
│   │   ├── loader.js            # Loading state management
│   │   ├── loader-helpers.js    # Loading DOM utilities
│   │   ├── logger.js            # Application logging system
│   │   └── logger-helpers.js    # Logging configuration and utilities
│   └── css/                     # Modular styling system
└── resources/                   # Icons and assets
```

## Architecture

### Code Organization
The application follows a modular architecture with clear separation of concerns:

- **Orchestration Layer** (script.js, render.js): Main application flow and high-level UI coordination
- **Helper Layer** (script-helpers.js, render-helpers.js): Business logic and DOM manipulation utilities  
- **Template Layer** (template.js, template-helpers.js): Logic-driven template preparation and pure HTML generation
- **API Layer** (pokemon-api-base.js, pokemon-details.js): Data fetching and processing
- **Utility Layer** (loader.js, logger.js): Loading states and application logging

### Function Design
All functions are limited to maximum 20 lines for maintainability and follow the single responsibility principle.

## Logging System

The application includes a comprehensive logging system for development and debugging:

### Logger Configuration
- **Granular Control**: Individual log categories can be enabled/disabled
- **Categories**: API calls, rendering, pagination, search, generation loading, evolution processing, errors
- **Runtime Toggle**: Logging can be toggled on/off through the UI without restart

### Logger Functions
```javascript
// Available logging categories
apiLogs, renderLogs, pageLogs, generationLogs, searchLogs, 
pokemonLogs, loadingLogs, paginationLogs, evolutionLogs, 
appLogs, errorLogs

// Control functions
enableAllLogs(), disableAllLogs(), enableImportantLogs(), enableOnlyErrors()
```

### Development Features
- Detailed operation tracking for API calls
- Performance monitoring with timing logs
- Error handling with context information
- State change notifications
- Search operation logging with result counts

## Getting Started

1. Open `frontend/src/html/main.html` in a modern browser
2. Use the generation sidebar to browse Pokémon by generation
3. Search for specific Pokémon using the search bar
4. Click any Pokémon card for detailed information

No build process required - runs directly in the browser with vanilla JavaScript.

## Tech Stack

- Frontend: Vanilla JavaScript (ES6+), HTML5, CSS3
- API: PokéAPI (https://pokeapi.co/)
- Architecture: Modular file structure with helper pattern
- Performance: Promise.all for parallel requests, optimized pagination

---

Powered by PokéAPI - The RESTful Pokémon API