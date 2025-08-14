# Maps Application Features

## Overview
The Maps application has been enhanced with new navigation and mapping capabilities, integrating with GTA V's native waypoint system and providing an interactive map interface.

## New Features

### 1. Navigation System
- **Start Navigation Button**: When pressed in the route view, it returns to the Maps main page and sets a waypoint on the player's GTA V map
- **Waypoint Integration**: Uses FiveM's `SetNewWaypoint` native to mark locations on the in-game map
- **Automatic Return**: After starting navigation, users are automatically returned to the Maps main interface

### 2. Interactive GTA V Map
- **Leaflet Integration**: Uses the Leaflet.js library for interactive map functionality
- **Three Map Views**:
  - **Atlas**: Standard OpenStreetMap tiles for general navigation
  - **Satellite**: High-resolution satellite imagery from Esri
  - **Grid**: Grid-based OpenStreetMap view for precise location reference

### 3. Map Features
- **Player Location Marker**: Blue marker showing the player's current position
- **Nearby Places**: Orange markers for points of interest around the player
- **Interactive Markers**: Click markers to see location names and details
- **Map Controls**: Touch-friendly controls optimized for mobile phone interface

### 4. Enhanced UI
- **Map View Button**: Added to both the current location section and nearby places tab
- **View Type Toggle**: Easy switching between Atlas, Satellite, and Grid views
- **Set Waypoint Button**: Quick waypoint setting for the player's current location
- **Responsive Design**: Optimized for phone screen dimensions

## Technical Implementation

### NUI Callbacks
- `startNavigation`: Handles waypoint setting requests from the UI
- Coordinates are sent to the FiveM client for processing

### Map Initialization
- Dynamic Leaflet import for optimal performance
- Automatic cleanup when leaving map view
- Responsive tile loading based on view type selection

### Coordinate System
- GTA V coordinate system integration
- Proper mapping between game coordinates and map display
- Player location updates in real-time

## Usage Instructions

1. **Accessing the Map**: 
   - Click the "Map" button in the current location section
   - Or click "View Map" in the Nearby Places tab

2. **Changing Map Views**:
   - Use the Atlas, Satellite, or Grid buttons in the map header
   - Each view provides different visual information

3. **Starting Navigation**:
   - Select a location and get directions
   - Press "Start Navigation" to set a waypoint
   - The waypoint will appear on your GTA V map

4. **Setting Waypoints**:
   - Use the "Set Waypoint" button in map view for your current location
   - Or navigate to specific places through the search function

## Dependencies
- **Leaflet.js**: Interactive mapping library
- **FiveM Natives**: `SetNewWaypoint` for waypoint functionality
- **React Hooks**: State management for map view and navigation

## Future Enhancements
- Custom GTA V map tiles for authentic game experience
- Route visualization on the interactive map
- Real-time traffic and road condition updates
- Integration with in-game GPS systems
