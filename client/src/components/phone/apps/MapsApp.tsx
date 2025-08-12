import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [activeTab, setActiveTab] = useState<"explore" | "search" | "saved">("explore");
  const [savedPlaces, setSavedPlaces] = useState<Location[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadNearbyPlaces();
    loadSavedPlaces();
  }, []);

  const loadNearbyPlaces = () => {
    // Mock nearby places - in real app this would be API call
    setNearbyPlaces([
      {
        id: "1",
        name: "Pillbox Medical Center",
        address: "1854 S Crusade Rd, Los Santos",
        category: "Hospital",
        rating: 4.2,
        distance: "0.8 km",
        lat: 34.0542,
        lng: -118.2457,
        phone: "(555) 123-4567",
      },
      {
        id: "2",
        name: "Los Santos Police Department",
        address: "1555 S Highway Patrol, Los Santos",
        category: "Police Station",
        rating: 3.8,
        distance: "1.2 km",
        lat: 34.0502,
        lng: -118.2417,
        phone: "(555) 911-0000",
      },
      {
        id: "3",
        name: "Diamond Casino & Resort",
        address: "Vinewood Hills, Los Santos",
        category: "Entertainment",
        rating: 4.7,
        distance: "2.1 km",
        lat: 34.0622,
        lng: -118.2537,
        phone: "(555) 777-8888",
      },
      {
        id: "4",
        name: "Los Santos International Airport",
        address: "1 World Way, Los Santos",
        category: "Airport",
        rating: 4.1,
        distance: "5.2 km",
        lat: 34.0322,
        lng: -118.2737,
        phone: "(555) 555-1234",
      },
      {
        id: "5",
        name: "Maze Bank Tower",
        address: "Pillbox Hill, Los Santos",
        category: "Office Building",
        rating: 4.5,
        distance: "0.5 km",
        lat: 34.0562,
        lng: -118.2477,
      },
    ]);
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
      toast({
        title: "No results found",
        description: `No places found for "${searchQuery}"`,
        variant: "destructive",
      });
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

    toast({
      title: "Route calculated",
      description: `Directions to ${destination.name}`,
    });
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

    toast({
      title: location.isBookmarked ? "Removed from saved" : "Saved",
      description: location.isBookmarked 
        ? `${location.name} removed from saved places`
        : `${location.name} saved to your places`,
    });
  };

  const shareLocation = (location: Location) => {
    toast({
      title: "Location shared",
      description: `Shared ${location.name} location`,
    });
  };

  const callPlace = (phone?: string) => {
    if (phone) {
      toast({
        title: "Calling...",
        description: `Calling ${phone}`,
      });
    }
  };

  const renderLocationCard = (location: Location, showActions = true) => (
    <Card key={location.id} className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-3">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{location.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{location.address}</p>
            <div className="flex items-center space-x-3 mt-2">
              <Badge variant="secondary" className="text-xs">
                {location.category}
              </Badge>
              {location.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{location.rating}</span>
                </div>
              )}
              {location.distance && (
                <span className="text-sm text-gray-600 dark:text-gray-400">{location.distance}</span>
              )}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center space-x-2 mt-4">
            <Button
              onClick={() => getDirections(location)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Navigation className="h-3 w-3 mr-1" />
              Directions
            </Button>
            {location.phone && (
              <Button
                onClick={() => callPlace(location.phone)}
                variant="outline"
                size="sm"
              >
                <Phone className="h-3 w-3 mr-1" />
                Call
              </Button>
            )}
            <Button
              onClick={() => toggleBookmark(location)}
              variant="ghost"
              size="sm"
              className={location.isBookmarked ? "text-blue-600" : ""}
            >
              <Bookmark className={`h-3 w-3 ${location.isBookmarked ? "fill-current" : ""}`} />
            </Button>
            <Button
              onClick={() => shareLocation(location)}
              variant="ghost"
              size="sm"
            >
              <Share className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  if (showRoute && selectedLocation && routeInfo) {
    return (
      <div className="h-full bg-white dark:bg-gray-900">
        {/* Route Header */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setShowRoute(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-700 p-2"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <h2 className="font-semibold">Route to {selectedLocation.name}</h2>
              <div className="flex items-center justify-center space-x-4 mt-1">
                <span className="text-sm">{routeInfo.duration}</span>
                <span className="text-sm">•</span>
                <span className="text-sm">{routeInfo.distance}</span>
              </div>
            </div>
            <div className="w-8" />
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-green-100 dark:bg-green-900 h-48 flex items-center justify-center">
          <div className="text-center">
            <Navigation2 className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="text-green-700 dark:text-green-300 font-medium">Navigation Active</p>
            <p className="text-sm text-green-600 dark:text-green-400">Follow the route below</p>
          </div>
        </div>

        {/* Route Steps */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Route Steps</h3>
          <div className="space-y-3">
            {routeInfo.steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300 flex-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <Car className="h-4 w-4 mr-2" />
              Start Navigation
            </Button>
            <Button variant="outline" onClick={() => shareLocation(selectedLocation)}>
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
          data-testid="contacts-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold">Maps</h1>
        <div className="flex items-center space-x-2 mt-3">
          <div className="flex-1 relative">
         
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places..."
              className="bg-white text-gray-900 pl-10 border-0"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button
            onClick={handleSearch}
            variant="secondary"
            size="sm"
            className="bg-blue-700 hover:bg-blue-800 text-white border-0"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Current Location */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 rounded-full p-2">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{currentLocation.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{currentLocation.address}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("explore")}
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === "explore"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Explore
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === "search"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Search
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === "saved"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Saved
        </button>
      </div>

      {/* Content */}
      <div className="p-4 h-full overflow-y-auto">
        {activeTab === "explore" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nearby Places</h2>
            {nearbyPlaces.map(place => renderLocationCard(place))}
          </div>
        )}

        {activeTab === "search" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Search Results
              {searchQuery && (
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                  {" "}for "{searchQuery}"
                </span>
              )}
            </h2>
            {searchResults.length > 0 ? (
              searchResults.map(place => renderLocationCard(place))
            ) : searchQuery ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No results found for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Search for places, addresses, or points of interest</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Saved Places</h2>
            {savedPlaces.length > 0 ? (
              savedPlaces.map(place => renderLocationCard(place))
            ) : (
              <div className="text-center py-8">
                <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No saved places yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Save places you visit frequently for quick access
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};