# PokéDex Web App

A modern, responsive PokéDex application built with vanilla JavaScript and the PokéAPI. Browse Pokémon by generations with detailed stats and evolution chains.

## Features

- **Generation Navigation** - Browse Pokémon by their original generations (1-9)
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Pokemon Cards** - Clean mini-card layout displaying sprites, names, and types
- **Detailed Stats** - Click any Pokémon to view detailed information including:
  - Base stats with visual progress bars
  - Height, weight, abilities
  - Evolution chain visualization
  - Multiple sprite views
- **Limiter** - Efficient loading with 30 Pokémon per page
- **Smooth Animations** - Hover effects and loading states

## Live Demo

Open `frontend/src/html/main.html` in your browser to start exploring!

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **API**: [PokéAPI](https://pokeapi.co/) - RESTful Pokémon data
- **Architecture**: Modular CSS, template-based rendering
- **Responsive**: Mobile-first design with CSS Grid

## Screenshots

### Desktop View
- Clean sidebar navigation with generation buttons
- Grid layout 
- Detailed modal with stats and evolution chains

### Mobile View  
- Stacked layout with sidebar on top
- Responsive grid adapting to screen size
- Touch-optimized interactions

## Project Structure

``` <!-- Outdated! -->
├── APIs/
│   └── src/js/
│       └── pokemon-data.js       # PokéAPI wrapper functions
├── frontend/
│   ├── src/
│   │   ├── html/
│   │   │   └── main.html         # Main application page
│   │   ├── js/
│   │   │   ├── script.js         # Core application logic
│   │   │   ├── template.js       # HTML template functions
│   │   │   └── loader.js         # Loading state management
│   │   └── css/
│   │       ├── main.css          # Layout and structure
│   │       ├── mini-cards.css    # Pokémon card styling
│   │       ├── header.css        # Header component
│   │       ├── sidebar.css       # Navigation sidebar
│   │       ├── cards.css         # Detail modal styling
│   │       ├── evolution.css     # Evolution chain styling
│   │       ├── footer.css        # Footer component
│   │       ├── assets.css        # UI components & Limiter
│   │       ├── fonts.css         # Typography utilities
│   │       └── responsive.css    # Mobile responsiveness
```

## Core Functionality

### API Integration
- Fetches Pokémon data from PokéAPI
- Loads generation-specific Pokémon lists
- Retrieves detailed stats and evolution chains
- Handles sprite URLs and fallbacks

### User Interface
- **Generation Selection**: Navigate between Pokémon generations
- **Card Grid**: Responsive mini-cards with hover effects  
- **Detail Modal**: Comprehensive Pokémon information
- **Limiter**: Navigate through large datasets efficiently

### Performance
- Lazy loading with Limiter (30 items per page)
- Efficient API calls with error handling
- Smooth loading states and transitions
- Optimized image loading with fallbacks

## Design System


## Current Status

**Version**: 1.0.0 - Initial Release  
**Pokémon Count**: 1000+ across 9 generations  
**Device Support**: Desktop, Tablet, Mobile  
**Browser Compatibility**: Modern browsers (ES6+)

## Future Enhancements aka TodoList

- Search functionality
- Type filtering
- Enhanced UI-Design Improvements
- Fixes for GenerationFiltering etc.

---

*using PokéAPI - The ultimate Pokémon data source*