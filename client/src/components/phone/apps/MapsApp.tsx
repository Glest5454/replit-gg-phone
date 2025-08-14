import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import "leaflet/dist/leaflet.css";
import { 
  MapPin, 
  Navigation, 
  Search, 
  Star, 
  Clock, 
  Phone, 
  Car, 
  Navigation2,
  RotateCcw,
  Bookmark,
  Share,
  ArrowLeft,
  MoreVertical,
  User,
  Heart,
  Plus,
  Trash2,
  Users
} from "lucide-react";
import { useNotificationContext } from "@/context/NotificationContext";

interface Location {
  id: string;
  name: string;
  address: string;
  category: string;
  rating?: number;
  distance?: string;
  lat: number;
  lng: number;
  phone?: string;
  isBookmarked?: boolean;
}

interface Route {
  duration: string;
  distance: string;
  steps: string[];
}

interface PlayerLocation {
  x: number;
  y: number;
  z: number;
  heading: number;
  street: string;
  crossing: string;
  zone: string;
}

interface NearbyPlayer {
  id: string;
  name: string;
  phone: string;
  distance: number;
  coords: {
    x: number;
    y: number;
    z: number;
  };
}

interface FavoriteLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
  category: string;
  created_at: string;
}

interface MapsAppProps {
  onBack: () => void;
}

export const MapsApp = ({ onBack }: MapsAppProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState<Location>({
    id: "current",
    name: "Your Location",
    address: "Los Santos, San Andreas",
    category: "current",
    lat: 34.0522,
    lng: -118.2437,
  });
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
  const [nearbyPlaces, setNearbyPlaces] = useState<Location[]>([]);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [showRoute, setShowRoute] = useState(false);
  const [routeInfo, setRouteInfo] = useState<Route | null>(null);
  const [activeTab, setActiveTab] = useState<"explore" | "search" | "saved" | "nearby" | "favorites">("explore");
  const [savedPlaces, setSavedPlaces] = useState<Location[]>([]);
  const [favoriteLocations, setFavoriteLocations] = useState<FavoriteLocation[]>([]);
  const [nearbyPlayers, setNearbyPlayers] = useState<NearbyPlayer[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [shareTarget, setShareTarget] = useState("");
  const [favoriteName, setFavoriteName] = useState("");
  const [favoriteCategory, setFavoriteCategory] = useState("personal");
  const [playerLocation, setPlayerLocation] = useState<PlayerLocation | null>(null);
  const [showMapView, setShowMapView] = useState(false);
  const [mapViewType, setMapViewType] = useState<"atlas" | "satellite" | "grid">("atlas");
  
  const { showInfo, showSuccess, showWarning, showError } = useNotificationContext();

  useEffect(() => {
    loadNearbyPlaces();
    loadSavedPlaces();
    loadFavoriteLocations();
    loadNearbyPlayers();
    loadPlayerLocation();
  }, []);
  // add player location mock data and use it for map view
  useEffect(() => {
    if (showMapView && playerLocation) {
      // Initialize Leaflet map when map view is shown
      const initMap = async () => {
        try {
          const L = await import('leaflet');
          
          // Remove existing map if any
          const existingMap = document.getElementById('gta-map');
          if (existingMap) {
            existingMap.innerHTML = '';
          }

          // Create map container
          const mapContainer = document.getElementById('gta-map');
          if (!mapContainer) return;

          // Initialize map with GTA V coordinates
          const map = L.map('gta-map', {
            center: [playerLocation.y, playerLocation.x],
            zoom: 3,
            minZoom: 0,
            maxZoom: 5,
            zoomControl: true,
            attributionControl: false,
            dragging: true,
            touchZoom: true,
            scrollWheelZoom: true, // Enable mouse wheel zooming
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
            crs: L.CRS.Simple, // önemli
          });

          // Add tile layer based on map view type
          let tileUrl = '';
          let attribution = '';
          switch (mapViewType) {
            case 'satellite':
              // 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              tileUrl = 'https://assets.loaf-scripts.com/map-tiles/gtav/main/render/{z}/{x}/{y}.jpg';
              attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
              break;
            case 'grid':
              // 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              tileUrl = 'https://assets.loaf-scripts.com/map-tiles/gtav/main/game/{z}/{x}/{y}.jpg';
              attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
              break;
            default: // atlas
              tileUrl = 'https://assets.loaf-scripts.com/map-tiles/gtav/main/print/{z}/{x}/{y}.jpg';
              attribution = 'Map tiles';
              break;
          }

          L.tileLayer(tileUrl, {
              tileSize: 256,
              updateWhenIdle: true,
              updateWhenZooming: false,
              minZoom: 0,
              maxZoom: 5,
              noWrap: true,
              attribution: attribution
          }).addTo(map);

          // Add player location marker
          const playerIcon = L.divIcon({
            className: 'player-marker',
            html: '<div class="w-4 h-4 bg-samsung-blue rounded-full border-2 border-white"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });

          L.marker([playerLocation.y, playerLocation.x], { icon: playerIcon })
            .addTo(map)
            .bindPopup('Your Location')
            .openPopup();

          // Add nearby places markers
          nearbyPlaces.forEach(place => {
            // Choose marker color based on category
            let markerColor = 'bg-orange-500'; // default
            switch (place.category.toLowerCase()) {
              case 'hospital':
                markerColor = 'bg-red-500';
                break;
              case 'police station':
                markerColor = 'bg-blue-500';
                break;
              case 'fire station':
                markerColor = 'bg-red-600';
                break;
              case 'bank':
                markerColor = 'bg-green-500';
                break;
              case 'airport':
                markerColor = 'bg-purple-500';
                break;
              case 'gas station':
                markerColor = 'bg-yellow-500';
                break;
              case 'store':
                markerColor = 'bg-indigo-500';
                break;
              case 'entertainment':
                markerColor = 'bg-pink-500';
                break;
              case 'recreation':
                markerColor = 'bg-teal-500';
                break;
              case 'landmark':
                markerColor = 'bg-amber-500';
                break;
              case 'service':
                markerColor = 'bg-cyan-500';
                break;
              case 'emergency':
                markerColor = 'bg-red-700';
                break;
              default:
                markerColor = 'bg-orange-500';
            }

            const placeIcon = L.divIcon({
              className: 'place-marker',
              html: `<div class="w-3 h-3 ${markerColor} rounded-full border border-white shadow-lg"></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            });

            L.marker([place.lng, place.lat], { icon: placeIcon })
              .addTo(map)
              .bindPopup(`
                <div class="text-center">
                  <h3 class="font-bold text-sm mb-1">${place.name}</h3>
                  <p class="text-xs text-gray-600 mb-2">${place.address}</p>
                  <div class="flex items-center justify-between text-xs">
                    <span class="bg-gray-200 px-2 py-1 rounded">${place.category}</span>
                    <span class="text-gray-500">${place.distance}</span>
                  </div>
                </div>
              `);
          });

          // Store map instance for cleanup
          (window as any).gtaMap = map;

        } catch (error) {
          console.error('Failed to initialize map:', error);
        }
      };

      initMap();

      // Cleanup function
      return () => {
        if ((window as any).gtaMap) {
          (window as any).gtaMap.remove();
          (window as any).gtaMap = null;
        }
      };
    }
  }, [showMapView, playerLocation, mapViewType, nearbyPlaces]);

  const loadPlayerLocation = () => {
    // Listen for player location data from FiveM
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === 'openPhone' && event.data.playerData?.location) {
        const location = event.data.playerData.location;
        setPlayerLocation(location);
        
        // Update current location with player's actual location
        setCurrentLocation({
          id: "current",
          name: "Your Location",
          address: `${location.street}, ${location.zone}`,
          category: "current",
          lat: location.x,
          lng: location.y,
        });
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Add mock data for development/testing
    if (!('alt' in window)) {
      // Mock player location for development
      const mockLocation: PlayerLocation = {
        x: 60.2437,
        y: -140.0522,
        z: 0,
        heading: 0,
        street: "Mock Street",
        crossing: "Mock Crossing",
        zone: "Los Santos"
      };
      setPlayerLocation(mockLocation);
      
      // Update current location with mock data
      setCurrentLocation({
        id: "current",
        name: "Your Location",
        address: `${mockLocation.street}, ${mockLocation.zone}`,
        category: "current",
        lat: mockLocation.x,
        lng: mockLocation.y,
      });
    }
    
    return () => window.removeEventListener('message', handleMessage);
  };

  const loadNearbyPlaces = () => {
    // GTA V realistic locations
    setNearbyPlaces([
      {
        id: "1",
        name: "Pillbox Medical Center",
        address: "1854 S Crusade Rd, Los Santos",
        category: "Hospital",
        rating: 4.2,
        distance: "0.8 km",
        lat: 60.2437,
        lng: -140.0522, // orta nokta
        phone: "(555) 123-4567",
      },
      {
        id: "2",
        name: "Los Santos Police Department",
        address: "1555 S Highway Patrol, Los Santos",
        category: "Police Station",
        rating: 3.8,
        distance: "1.2 km",
        lat: 62.2417, // biraz doğuda
        lng: -141.0502, // biraz güneydoğuda
        phone: "(555) 911-0000",
      },
      {
        id: "3",
        name: "Diamond Casino & Resort",
        address: "Vinewood Hills, Los Santos",
        category: "Entertainment",
        rating: 4.7,
        distance: "2.1 km",
        lat: 59.2537, // biraz batıda
        lng: -138.0622, // kuzeybatıda
        phone: "(555) 777-8888",
      },
      {
        id: "4",
        name: "Los Santos International Airport",
        address: "1 World Way, Los Santos",
        category: "Airport",
        rating: 4.1,
        distance: "5.2 km",
        lat: 55.2737, // daha batıda
        lng: -145.0322, // güneybatıda
        phone: "(555) 555-1234",
      },
      {
        id: "5",
        name: "Los Santos Customs",
        address: "La Mesa, Los Santos",
        category: "Service",
        rating: 4.3,
        distance: "2.8 km",
        lat: 61.2237, // doğuda
        lng: -142.0422, // güneydoğuda
        phone: "(555) 333-4444",
      },
      {
        id: "6",
        name: "Los Santos Bank",
        address: "Downtown Los Santos",
        category: "Bank",
        rating: 4.0,
        distance: "2.3 km",
        lat: 59.2437, // batıda
        lng: -141.0422, // güneybatıda
        phone: "(555) 222-3333",
      }
    ]
    );
  };

  const loadSavedPlaces = () => {
    // Mock saved places
    setSavedPlaces([
      {
        id: "saved1",
        name: "Home",
        address: "123 Grove Street, Los Santos",
        category: "Home",
        lat: 34.0422,
        lng: -118.2337,
        isBookmarked: true,
      },
      {
        id: "saved2",
        name: "Work",
        address: "Maze Bank Building, Los Santos",
        category: "Work",
        lat: 34.0562,
        lng: -118.2477,
        isBookmarked: true,
      },
    ]);
  };

  const loadFavoriteLocations = () => {
    // Request favorite locations from server
    if ('alt' in window) {
      fetch(`https://gg-phone/getFavoriteLocations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
    }

    // Listen for response
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === 'favoriteLocationsLoaded') {
        setFavoriteLocations(event.data.locations || []);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  };

  const loadNearbyPlayers = () => {
    // Request nearby players from server
    if ('alt' in window) {
      fetch(`https://gg-phone/getNearbyPlayers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
    }

    // Listen for response
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === 'nearbyPlayersLoaded') {
        setNearbyPlayers(event.data.players || []);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Mock search results
    const results = nearbyPlaces.filter(place =>
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(results);
    setActiveTab("search");
    
    if (results.length === 0) {
      showWarning("No results found", `No places found for "${searchQuery}"`, "maps");
    }
  };

  const getDirections = (destination: Location) => {
    setSelectedLocation(destination);
    setShowRoute(true);
    
    // Mock route calculation
    setRouteInfo({
      duration: "12 min",
      distance: "4.2 km",
      steps: [
        "Head south on Main Street",
        "Turn right onto Highway 101",
        "Continue for 2.1 km",
        "Turn left onto destination street",
        "Arrive at destination",
      ],
    });

    showSuccess("Route calculated", `Directions to ${destination.name}`, "maps");
  };

  const toggleBookmark = (location: Location) => {
    if (location.isBookmarked) {
      setSavedPlaces(prev => prev.filter(p => p.id !== location.id));
    } else {
      setSavedPlaces(prev => [...prev, { ...location, isBookmarked: true }]);
    }
    
    // Update the location in nearby places or search results
    setNearbyPlaces(prev => prev.map(p => 
      p.id === location.id ? { ...p, isBookmarked: !p.isBookmarked } : p
    ));
    setSearchResults(prev => prev.map(p => 
      p.id === location.id ? { ...p, isBookmarked: !p.isBookmarked } : p
    ));

    if (location.isBookmarked) {
      showInfo("Removed from saved", `${location.name} removed from saved places`, "maps");
    } else {
      showSuccess("Saved", `${location.name} saved to your places`, "maps");
    }
  };

  const shareLocation = (location: Location) => {
    setSelectedLocation(location);
    setShowShareModal(true);
  };

  const sendLocationShare = () => {
    if (!shareTarget.trim() || !selectedLocation) return;

    // Send location share request to server
    if ('alt' in window) {
      fetch(`https://gg-phone/shareLocation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetNumber: shareTarget,
          locationData: {
            name: selectedLocation.name,
            address: selectedLocation.address,
            coords: { x: selectedLocation.lat, y: selectedLocation.lng, z: 0 },
            category: selectedLocation.category
          }
        })
      });
    }

    setShowShareModal(false);
    setShareTarget("");
    showSuccess("Location shared", `Shared ${selectedLocation.name} with ${shareTarget}`, "maps");
  };

  const saveToFavorites = (location: Location) => {
    setSelectedLocation(location);
    setFavoriteName(location.name);
    setShowFavoriteModal(true);
  };

  const saveFavoriteLocation = () => {
    if (!favoriteName.trim() || !selectedLocation) return;

    // Save favorite location to server
    if ('alt' in window) {
      fetch(`https://gg-phone/saveFavoriteLocation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: favoriteName,
          address: selectedLocation.address,
          coords: { x: selectedLocation.lat, y: selectedLocation.lng, z: 0 },
          category: favoriteCategory
        })
      });
    }

    setShowFavoriteModal(false);
    setFavoriteName("");
    showSuccess("Saved to favorites", `${favoriteName} added to favorites`, "maps");
  };

  const deleteFavoriteLocation = (locationId: string) => {
    // Delete favorite location from server
    if ('alt' in window) {
      fetch(`https://gg-phone/deleteFavoriteLocation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationId })
      });
    }

    setFavoriteLocations(prev => prev.filter(loc => loc.id !== locationId));
    showSuccess("Deleted", "Favorite location removed", "maps");
  };

  const startNavigation = (location: Location) => {
    // Send navigation request to FiveM client
    if ('alt' in window) {
      fetch(`https://gg-phone/startNavigation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coordinates: {
            x: location.lat,
            y: location.lng,
            z: 0
          }
        })
      });
    }
    
    // Return to Maps main page
    setShowRoute(false);
    setSelectedLocation(null);
    setRouteInfo(null);
    
    showSuccess("Navigation Started", `Waypoint set for ${location.name}`, "maps");
  };

  const handleMapViewTypeChange = (newType: "atlas" | "satellite" | "grid") => {
    setMapViewType(newType);
    // Force map refresh by reinitializing
    setShowMapView(false);
    setTimeout(() => setShowMapView(true), 100);
    // Force map refresh by reinitializing
    if ((window as any).gtaMap) {
      (window as any).gtaMap.remove();
      (window as any).gtaMap = null;
    }
    // Trigger map reinitialization
    setTimeout(() => {
      if (showMapView && playerLocation) {
        const initMap = async () => {
          try {
            const L = await import('leaflet');
            
            // Remove existing map if any
            const existingMap = document.getElementById('gta-map');
            if (existingMap) {
              existingMap.innerHTML = '';
            }

            // Create map container
            const mapContainer = document.getElementById('gta-map');
            if (!mapContainer) return;

            // Initialize map with GTA V coordinates
            const map = L.map('gta-map', {
              center: [playerLocation.y, playerLocation.x],
              zoom: 11,
              zoomControl: false,
              attributionControl: false,
              dragging: true,
              touchZoom: true,
              scrollWheelZoom: true, // Enable mouse wheel zooming
              doubleClickZoom: false,
              boxZoom: false,
              keyboard: false,
              crs: L.CRS.Simple, // önemli
            });

            // Add tile layer based on new map view type
            let tileUrl = '';
            let attribution = '';
            switch (newType) {
              case 'satellite':
                // tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
                tileUrl = 'https://assets.loaf-scripts.com/map-tiles/gtav/main/render/{z}/{x}/{y}.jpg';
                attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
                break;
              case 'grid':
                // tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                tileUrl = 'https://assets.loaf-scripts.com/map-tiles/gtav/main/game/{z}/{x}/{y}.jpg';
                attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
                break;
              default: // atlas - GTA V specific tiles
                tileUrl = 'https://assets.loaf-scripts.com/map-tiles/gtav/main/print/0/0/0.jpg';
                attribution = 'Map tiles © Loaf Scripts';
                break;
            }

            L.tileLayer(tileUrl, {
              tileSize: 256,
              updateWhenIdle: true,
              updateWhenZooming: false,
              minZoom: 0,
              maxZoom: 5,
              noWrap: true,
              attribution: attribution
            }).addTo(map);

            // Add player location marker
            const playerIcon = L.divIcon({
              className: 'player-marker',
              html: '<div class="w-4 h-4 bg-samsung-blue rounded-full border-2 border-white"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            });

            L.marker([playerLocation.y, playerLocation.x], { icon: playerIcon })
              .addTo(map)
              .bindPopup('Your Location')
              .openPopup();

            // Add nearby places markers
            nearbyPlaces.forEach(place => {
              // Choose marker color based on category
              let markerColor = 'bg-orange-500'; // default
              switch (place.category.toLowerCase()) {
                case 'hospital':
                  markerColor = 'bg-red-500';
                  break;
                case 'police station':
                  markerColor = 'bg-blue-500';
                  break;
                case 'fire station':
                  markerColor = 'bg-red-600';
                  break;
                case 'bank':
                  markerColor = 'bg-green-500';
                  break;
                case 'airport':
                  markerColor = 'bg-purple-500';
                  break;
                case 'gas station':
                  markerColor = 'bg-yellow-500';
                  break;
                case 'store':
                  markerColor = 'bg-indigo-500';
                  break;
                case 'entertainment':
                  markerColor = 'bg-pink-500';
                  break;
                case 'recreation':
                  markerColor = 'bg-teal-500';
                  break;
                case 'landmark':
                  markerColor = 'bg-amber-500';
                  break;
                case 'service':
                  markerColor = 'bg-cyan-500';
                  break;
                case 'emergency':
                  markerColor = 'bg-red-700';
                  break;
                default:
                  markerColor = 'bg-orange-500';
              }

              const placeIcon = L.divIcon({
                className: 'place-marker',
                html: `<div class="w-3 h-3 ${markerColor} rounded-full border border-white shadow-lg"></div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6]
              });

              L.marker([place.lng, place.lat], { icon: placeIcon })
                .addTo(map)
                .bindPopup(`
                  <div class="text-center">
                    <h3 class="font-bold text-sm mb-1">${place.name}</h3>
                    <p class="text-xs text-gray-600 mb-2">${place.address}</p>
                    <div class="flex items-center justify-between text-xs">
                      <span class="bg-gray-200 px-2 py-1 rounded">${place.category}</span>
                      <span class="text-gray-500">${place.distance}</span>
                    </div>
                  </div>
                `);
            });

            // Store map instance for cleanup
            (window as any).gtaMap = map;
            
            // Invalidate map size to ensure proper rendering
            setTimeout(() => {
              map.invalidateSize();
            }, 100);

          } catch (error) {
            console.error('Failed to refresh map:', error);
          }
        };

        initMap();
      }
    }, 50);
  };

  const callPlace = (phone?: string) => {
    if (phone) {
      showInfo("Calling...", `Calling ${phone}`, "maps");
    }
  };

  const renderLocationCard = (location: Location, showActions = true) => (
    <div key={location.id} className="bg-surface-dark/30 rounded-samsung-sm p-3 mb-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm">{location.name}</h3>
          <p className="text-white/60 text-xs mt-1">{location.address}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="secondary" className="text-xs bg-samsung-blue/20 text-samsung-blue border-samsung-blue/30">
              {location.category}
            </Badge>
            {location.rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs text-white/60">{location.rating}</span>
              </div>
            )}
            {location.distance && (
              <span className="text-xs text-white/60">{location.distance}</span>
            )}
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex items-center space-x-1 mt-3">
          <Button
            onClick={() => getDirections(location)}
            size="sm"
            className="bg-samsung-blue hover:bg-samsung-blue/80 text-white border-0 rounded-samsung-sm text-xs px-2 py-1 h-7"
          >
            <Navigation className="h-3 w-3 mr-1" />
            Directions
          </Button>
          {location.phone && (
            <Button
              onClick={() => callPlace(location.phone)}
              variant="outline"
              size="sm"
              className="border-white/20 text-black hover:bg-white/10 rounded-samsung-sm text-xs px-2 py-1 h-7"
            >
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
          )}
          <Button
            onClick={() => toggleBookmark(location)}
            variant="ghost"
            size="sm"
            className={`text-white hover:bg-white/10 rounded-samsung-sm text-xs px-2 py-1 h-7 ${
              location.isBookmarked ? "text-samsung-blue" : ""
            }`}
          >
            <Bookmark className={`h-3 w-3 ${location.isBookmarked ? "fill-current" : ""}`} />
          </Button>
          <Button
            onClick={() => shareLocation(location)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 rounded-samsung-sm text-xs px-2 py-1 h-7"
          >
            <Share className="h-3 w-3" />
          </Button>
          <Button
            onClick={() => saveToFavorites(location)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 rounded-samsung-sm text-xs px-2 py-1 h-7"
          >
            <Heart className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );

  const renderNearbyPlayerCard = (player: NearbyPlayer) => (
    <div key={player.id} className="bg-surface-dark/30 rounded-samsung-sm p-3 mb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-samsung-blue rounded-full p-2">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{player.name}</h3>
            <p className="text-white/60 text-xs">{player.phone}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/80 text-sm font-medium">{player.distance}m</p>
          <Button
            onClick={() => shareLocation({
              id: `player_${player.id}`,
              name: `${player.name}'s Location`,
              address: `${player.distance}m away`,
              category: "Player",
              lat: player.coords.x,
              lng: player.coords.y
            })}
            size="sm"
            variant="ghost"
            className="text-samsung-blue hover:bg-samsung-blue/10 rounded-samsung-sm text-xs px-2 py-1 h-7"
          >
            <Share className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderFavoriteLocationCard = (location: FavoriteLocation) => (
    <div key={location.id} className="bg-surface-dark/30 rounded-samsung-sm p-3 mb-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm">{location.name}</h3>
          <p className="text-white/60 text-xs mt-1">{location.address}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-500 border-purple-500/30">
              {location.category}
            </Badge>
            <span className="text-xs text-white/40">
              {new Date(location.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            onClick={() => getDirections({
              id: location.id,
              name: location.name,
              address: location.address,
              category: location.category,
              lat: location.coordinates.x,
              lng: location.coordinates.y
            })}
            size="sm"
            className="bg-samsung-blue hover:bg-samsung-blue/80 text-white border-0 rounded-samsung-sm text-xs px-2 py-1 h-7"
          >
            <Navigation className="h-3 w-3 mr-1" />
            Go
          </Button>
          <Button
            onClick={() => deleteFavoriteLocation(location.id)}
            variant="ghost"
            size="sm"
            className="text-red-400 hover:bg-red-500/10 rounded-samsung-sm text-xs px-2 py-1 h-7"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (showMapView) {
    return (
      <div className="absolute inset-0 maps-app flex flex-col bg-gray-900">
        {/* Map Header */}
        <div className="bg-samsung-blue text-white p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setShowMapView(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-samsung-blue/80 p-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <h2 className="font-semibold text-lg">GTA V Map</h2>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <Button
                  onClick={() => handleMapViewTypeChange("atlas")}
                  size="sm"
                  className={`text-xs px-2 py-1 h-6 ${
                    mapViewType === "atlas" 
                      ? "bg-white text-samsung-blue" 
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  Atlas
                </Button>
                <Button
                  onClick={() => handleMapViewTypeChange("satellite")}
                  size="sm"
                  className={`text-xs px-2 py-1 h-6 ${
                    mapViewType === "satellite" 
                      ? "bg-white text-samsung-blue" 
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  Satellite
                </Button>
                <Button
                  onClick={() => handleMapViewTypeChange("grid")}
                  size="sm"
                  className={`text-xs px-2 py-1 h-6 ${
                    mapViewType === "grid" 
                      ? "bg-white text-samsung-blue" 
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  Grid
                </Button>
              </div>
            </div>
            <div className="w-8" />
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div id="gta-map" className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-center text-white/60">
              <MapPin className="h-12 w-12 mx-auto mb-2" />
              <p>Map loading...</p>
              <p className="text-sm">View: {mapViewType}</p>
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="p-4 border-t border-white/10 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-white/80 text-sm">
              {playerLocation && (
                <span>Your location: {playerLocation.street}, {playerLocation.zone}</span>
              )}
            </div>
            <Button
              onClick={() => {
                if (playerLocation) {
                  startNavigation({
                    id: "current",
                    name: "Your Location",
                    address: `${playerLocation.street}, ${playerLocation.zone}`,
                    category: "current",
                    lat: playerLocation.x,
                    lng: playerLocation.y
                  });
                }
              }}
              size="sm"
              className="bg-samsung-blue hover:bg-samsung-blue/80 text-white border-0 rounded-samsung-sm text-xs px-2 py-1 h-7"
            >
              <Navigation className="h-3 w-4 mr-1" />
              Set Waypoint
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showRoute && selectedLocation && routeInfo) {
    return (
      <div className="absolute inset-0 maps-app flex flex-col bg-gray-900">
        {/* Route Header */}
        <div className="bg-samsung-blue text-white p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setShowRoute(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-samsung-blue/80 p-2 -ml-2"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <h2 className="font-semibold text-lg">Route to {selectedLocation.name}</h2>
              <div className="flex items-center justify-center space-x-4 mt-1">
                <span className="text-sm text-white/80">{routeInfo.duration}</span>
                <span className="text-sm text-white/60">•</span>
                <span className="text-sm text-white/80">{routeInfo.distance}</span>
              </div>
            </div>
            <div className="w-8" />
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-green-900/20 h-48 flex items-center justify-center border-b border-white/10">
          <div className="text-center">
            <Navigation2 className="h-12 w-12 text-green-400 mx-auto mb-2" />
            <p className="text-green-400 font-medium">Navigation Active</p>
            <p className="text-sm text-green-400/80">Follow the route below</p>
          </div>
        </div>

        {/* Route Steps */}
        <div className="p-6 flex-1 overflow-y-auto">
          <h3 className="font-semibold text-white mb-4">Route Steps</h3>
          <div className="space-y-3">
            {routeInfo.steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="bg-samsung-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <p className="text-white/80 flex-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 border-t border-white/10">
          <div className="flex space-x-3">
            <Button 
              onClick={() => startNavigation(selectedLocation)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-samsung-sm"
            >
              <Car className="h-4 w-4 mr-2" />
              Start Navigation
            </Button>
            {/*<Button 
              variant="outline" 
              onClick={() => shareLocation(selectedLocation)}
              className="border-white/20 text-black hover:bg-white/10 rounded-samsung-sm"
            >
              <Share className="h-4 w-4" />
            </Button>
            */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 maps-app flex flex-col bg-gray-900">
      {/* App Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 mt-2">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
          data-testid="maps-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Maps</h1>
        <button 
          className="oneui-button p-2"
          data-testid="maps-menu"
        >
          <MoreVertical className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places..."
              className="bg-surface-dark/50 text-black placeholder-white/60 pl-10 border-white/10 focus:border-samsung-blue rounded-samsung-sm"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button
            onClick={handleSearch}
            variant="secondary"
            size="sm"
            className="bg-samsung-blue hover:bg-samsung-blue/80 text-white border-0 rounded-samsung-sm"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Current Location */}
      <div className="bg-samsung-blue/20 p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="bg-samsung-blue rounded-full p-2">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-white">{currentLocation.name}</p>
            <p className="text-sm text-white/60">{currentLocation.address}</p>
            {playerLocation && (
              <p className="text-xs text-white/40 mt-1">
                {playerLocation.street} • {playerLocation.zone}
              </p>
            )}
          </div>
          <div className="flex space-x-1">
            <Button
              onClick={() => setShowMapView(true)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 rounded-samsung-sm text-xs px-2 py-1 h-7"
            >
              <MapPin className="h-3 w-3" />
              Map
            </Button>
            <Button
              onClick={() => shareLocation(currentLocation)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 rounded-samsung-sm text-xs px-2 py-1 h-7"
            >
              <Share className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab("explore")}
          className={`flex-shrink-0 py-3 px-4 text-center font-medium transition-colors duration-200 ${
            activeTab === "explore"
              ? "text-samsung-blue border-b-2 border-samsung-blue"
              : "text-white/70"
          }`}
        >
          Explore
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={`flex-shrink-0 py-3 px-4 text-center font-medium transition-colors duration-200 ${
            activeTab === "search"
              ? "text-samsung-blue border-b-2 border-samsung-blue"
              : "text-white/70"
          }`}
        >
          Search
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-shrink-0 py-3 px-4 text-center font-medium transition-colors duration-200 ${
            activeTab === "saved"
              ? "text-samsung-blue border-b-2 border-samsung-blue"
              : "text-white/70"
          }`}
        >
          Saved
        </button>
        <button
          onClick={() => setActiveTab("nearby")}
          className={`flex-shrink-0 py-3 px-4 text-center font-medium transition-colors duration-200 ${
            activeTab === "nearby"
              ? "text-samsung-blue border-b-2 border-samsung-blue"
              : "text-white/70"
          }`}
        >
          <Users className="h-3 w-3 mr-1 inline" />
          Nearby
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`flex-shrink-0 py-3 px-4 text-center font-medium transition-colors duration-200 ${
            activeTab === "favorites"
              ? "text-samsung-blue border-b-2 border-samsung-blue"
              : "text-white/70"
          }`}
        >
          <Heart className="h-3 w-3 mr-1 inline" />
          Favorites
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-2 flex-1 overflow-y-auto scrollbar-hide">
        {activeTab === "explore" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-white">Nearby Places</h2>
              <Button
                onClick={() => setShowMapView(true)}
                size="sm"
                className="bg-samsung-blue hover:bg-samsung-blue/80 text-white border-0 rounded-samsung-sm text-xs px-2 py-1 h-7"
              >
                <MapPin className="h-3 w-3 mr-1" />
                View Map
              </Button>
            </div>
            {nearbyPlaces.map(place => renderLocationCard(place))}
          </div>
        )}

        {activeTab === "search" && (
          <div>
            <h2 className="text-base font-semibold text-white mb-3">
              Search Results
              {searchQuery && (
                <span className="text-sm font-normal text-white/60">
                  {" "}for "{searchQuery}"
                </span>
              )}
            </h2>
            {searchResults.length > 0 ? (
              searchResults.map(place => renderLocationCard(place))
            ) : searchQuery ? (
              <div className="text-center py-6">
                <Search className="h-10 w-10 text-white/40 mx-auto mb-3" />
                <p className="text-white/60">No results found for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="text-center py-6">
                <Search className="h-10 w-10 text-white/40 mx-auto mb-3" />
                <p className="text-white/60">Search for places, addresses, or points of interest</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div>
            <h2 className="text-base font-semibold text-white mb-3">Saved Places</h2>
            {savedPlaces.length > 0 ? (
              savedPlaces.map(place => renderLocationCard(place))
            ) : (
              <div className="text-center py-6">
                <Bookmark className="h-10 w-10 text-white/40 mx-auto mb-3" />
                <p className="text-white/60">No saved places yet</p>
                <p className="text-sm text-white/40 mt-2">
                  Save places you visit frequently for quick access
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "nearby" && (
          <div>
            <h2 className="text-base font-semibold text-white mb-3">Nearby Players</h2>
            {nearbyPlayers.length > 0 ? (
              nearbyPlayers.map(player => renderNearbyPlayerCard(player))
            ) : (
              <div className="text-center py-6">
                <Users className="h-10 w-10 text-white/40 mx-auto mb-3" />
                <p className="text-white/60">No nearby players</p>
                <p className="text-sm text-white/40 mt-2">
                  Players within 100 meters will appear here
                </p>
      </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div>
            <h2 className="text-base font-semibold text-white mb-3">Favorite Locations</h2>
            {favoriteLocations.length > 0 ? (
              favoriteLocations.map(location => renderFavoriteLocationCard(location))
            ) : (
              <div className="text-center py-6">
                <Heart className="h-10 w-10 text-white/40 mx-auto mb-3" />
                <p className="text-white/60">No favorite locations yet</p>
                <p className="text-sm text-white/40 mt-2">
                  Save locations to your favorites for quick access
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Share Location Modal */}
      {showShareModal && selectedLocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-samsung-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-white text-lg font-semibold mb-4">
              Share Location
            </h3>
            
            <div className="mb-4">
              <p className="text-white/80 text-sm mb-2">Location: {selectedLocation.name}</p>
              <p className="text-white/60 text-sm mb-4">{selectedLocation.address}</p>
              
              <label className="block text-white/80 text-sm mb-2">
                Phone Number
              </label>
              <Input
                value={shareTarget}
                onChange={(e) => setShareTarget(e.target.value)}
                placeholder="Enter phone number"
                className="bg-surface-dark/50 text-black placeholder-white/60 border-white/10 focus:border-samsung-blue rounded-samsung-sm"
              />
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setShowShareModal(false)}
                variant="outline"
                className="flex-1 border-white/20 text-black hover:bg-white/10 rounded-samsung-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={sendLocationShare}
                className="flex-1 bg-samsung-blue hover:bg-samsung-blue/80 text-white border-0 rounded-samsung-sm"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Save to Favorites Modal */}
      {showFavoriteModal && selectedLocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-samsung-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-white text-lg font-semibold mb-4">
              Save to Favorites
            </h3>
            
            <div className="mb-4">
              <p className="text-white/80 text-sm mb-2">Location: {selectedLocation.name}</p>
              <p className="text-white/60 text-sm mb-4">{selectedLocation.address}</p>
              
              <label className="block text-white/80 text-sm mb-2">
                Name
              </label>
              <Input
                value={favoriteName}
                onChange={(e) => setFavoriteName(e.target.value)}
                placeholder="Enter a name for this location"
                className="bg-surface-dark/50 text-black placeholder-white/60 border-white/10 focus:border-samsung-blue rounded-samsung-sm"
              />
              
              <label className="block text-white/80 text-sm mb-2 mt-3">
                Category
              </label>
              <select
                value={favoriteCategory}
                onChange={(e) => setFavoriteCategory(e.target.value)}
                className="w-full bg-surface-dark/50 text-black border border-white/10 focus:border-samsung-blue rounded-samsung-sm p-2"
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="home">Home</option>
                <option value="entertainment">Entertainment</option>
                <option value="shopping">Shopping</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setShowFavoriteModal(false)}
                variant="outline"
                className="flex-1 border-white/20 text-black hover:bg-white/10 rounded-samsung-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={saveFavoriteLocation}
                className="flex-1 bg-samsung-blue hover:bg-samsung-blue/80 text-white border-0 rounded-samsung-sm"
              >
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};