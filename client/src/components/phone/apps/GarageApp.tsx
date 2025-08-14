import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Wrench, 
  Fuel, 
  MapPin, 
  Phone, 
  ArrowLeft, 
  RefreshCw,
  Plus,
  Trash2,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { useNotificationContext } from "@/context/NotificationContext";

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  name: string;
  garage: string;
  state: number; // 1: in garage, 0: out, 2: impounded
  fuel: number;
  engine: number;
  body: number;
  lastUsed?: string;
  isOwned: boolean;
}

interface GarageAppProps {
  onBack: () => void;
}

export const GarageApp = ({ onBack }: GarageAppProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showValetModal, setShowValetModal] = useState(false);
  const [valetLocation, setValetLocation] = useState("");
  const [activeTab, setActiveTab] = useState<"garage" | "out" | "impounded">("garage");
  const { showInfo, showSuccess, showWarning, showError } = useNotificationContext();

  // add mock vehicles
  const mockVehicles = [
    {
      id: 1,
      plate: "ABC123",
      model: "BMW M3",
      name: "BMW M3",
      garage: "Los Santos",
      state: 1,
      fuel: 100,
      engine: 100,
      body: 100,
      lastUsed: "2021-01-01",
      isOwned: true
    },
    {
      id: 2,
      plate: "XYZ789",
      model: "Mercedes-Benz S-Class",
      name: "Mercedes-Benz S-Class",
      garage: "Los Santos",
      state: 0,
      fuel: 80,
      engine: 90,
      body: 95,
      lastUsed: "2021-01-01",
      isOwned: true
    },
    {
      id: 3,
      plate: "DEF456",
      model: "Lamborghini Aventador",
      name: "Lamborghini Aventador",
      garage: "Los Santos",
      state: 2,
      fuel: 50,
      engine: 70,
      body: 80,
      lastUsed: "2021-01-01",
      isOwned: true
    },
  ];


  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = () => {
    setLoading(true);
    // This will trigger the server event to get vehicles
    if ('alt' in window) {
      // FiveM environment
      fetch(`https://gg-phone/getPlayerVehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
    }
    else {
      setVehicles(mockVehicles as unknown as Vehicle[]);
      setLoading(false);
    }
    
    // Listen for the response
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === 'playerVehiclesLoaded') {
        setVehicles(event.data.vehicles || []);
        setLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  };

  const getVehicleStatusText = (state: number) => {
    switch (state) {
      case 0: return "Out";
      case 1: return "In Garage";
      case 2: return "Impounded";
      default: return "Unknown";
    }
  };

  const getVehicleStatusColor = (state: number) => {
    switch (state) {
      case 0: return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case 1: return "bg-green-500/20 text-green-500 border-green-500/30";
      case 2: return "bg-red-500/20 text-red-500 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-500 border-gray-500/30";
    }
  };

  const getVehicleStatusIcon = (state: number) => {
    switch (state) {
      case 0: return <MapPin className="h-4 w-4" />;
      case 1: return <CheckCircle className="h-4 w-4" />;
      case 2: return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const requestValet = (vehicle: Vehicle) => {
    if (!valetLocation.trim()) {
      showWarning("Location Required", "Please enter a location for valet service", "garage");
      return;
    }

    if (vehicle.state === 2) {
      showError("Vehicle Impounded", "Cannot request valet for impounded vehicles", "garage");
      return;
    }

    if (vehicle.state === 0) {
      showError("Vehicle Already Out", "Vehicle is already out and cannot be retrieved", "garage");
      return;
    }

    // Request valet service
    if ('alt' in window) {
      fetch(`https://gg-phone/requestValet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehiclePlate: vehicle.plate,
          location: valetLocation
        })
      });
    }

    setShowValetModal(false);
    setValetLocation("");
    showInfo("Valet Requested", `Requesting valet service for ${vehicle.plate}`, "garage");
  };

  const renderVehicleCard = (vehicle: Vehicle) => (
    <div key={vehicle.id} className="bg-surface-dark/30 rounded-samsung-sm p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-white text-lg">{vehicle.name}</h3>
          <p className="text-white/60 text-sm">{vehicle.plate}</p>
        </div>
        <Badge 
          variant="secondary" 
          className={`text-xs border ${getVehicleStatusColor(vehicle.state)}`}
        >
          <div className="flex items-center space-x-1">
            {getVehicleStatusIcon(vehicle.state)}
            <span>{getVehicleStatusText(vehicle.state)}</span>
          </div>
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center space-x-2">
          <Fuel className="h-4 w-4 text-blue-400" />
          <span className="text-white/80 text-sm">{vehicle.fuel}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <Wrench className="h-4 w-4 text-orange-400" />
          <span className="text-white/80 text-sm">
            {Math.round((vehicle.engine / 1000) * 100)}%
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-3">
        <MapPin className="h-4 w-4 text-green-400" />
        <span className="text-white/60 text-sm">{vehicle.garage}</span>
      </div>

      {vehicle.lastUsed && (
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="h-4 w-4 text-purple-400" />
          <span className="text-white/60 text-sm">
            Last used: {new Date(vehicle.lastUsed).toLocaleDateString()}
          </span>
        </div>
      )}

      <div className="flex items-center space-x-2">
        {vehicle.state === 1 && (
          <Button
            onClick={() => {
              setSelectedVehicle(vehicle);
              setShowValetModal(true);
            }}
            size="sm"
            className="bg-samsung-blue hover:bg-samsung-blue/80 text-white border-0 rounded-samsung-sm text-xs px-3 py-2 h-8"
          >
            <Car className="h-3 w-3 mr-1" />
            Request Valet
          </Button>
        )}
        
        {vehicle.state === 0 && (
          <Button
            variant="outline"
            size="sm"
            className="border-green-500/30 text-green-500 hover:bg-green-500/10 rounded-samsung-sm text-xs px-3 py-2 h-8"
            disabled
          >
            <MapPin className="h-3 w-3 mr-1" />
            Already Out
          </Button>
        )}
        
        {vehicle.state === 2 && (
          <Button
            variant="outline"
            size="sm"
            className="border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-samsung-sm text-xs px-3 py-2 h-8"
            disabled
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            Impounded
          </Button>
        )}
      </div>
    </div>
  );

  const filteredVehicles = vehicles.filter(vehicle => {
    switch (activeTab) {
      case "garage": return vehicle.state === 1;
      case "out": return vehicle.state === 0;
      case "impounded": return vehicle.state === 2;
      default: return true;
    }
  });

  if (loading) {
    return (
      <div className="absolute inset-0 garage-app flex flex-col bg-gray-900">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 text-samsung-blue mx-auto mb-4 animate-spin" />
            <p className="text-white/60">Loading vehicles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 garage-app flex flex-col bg-gray-900">
      {/* App Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 mt-2">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
          data-testid="garage-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Garage</h1>
        <button 
          className="oneui-button p-2"
          onClick={loadVehicles}
          data-testid="garage-refresh"
        >
          <RefreshCw className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Vehicle Count */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-medium">Your Vehicles</h2>
            <p className="text-white/60 text-sm">
              {vehicles.length} total vehicle{vehicles.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-center">
              <p className="text-green-500 text-sm font-medium">
                {vehicles.filter(v => v.state === 1).length}
              </p>
              <p className="text-white/60 text-xs">In Garage</p>
            </div>
            <div className="text-center">
              <p className="text-yellow-500 text-sm font-medium">
                {vehicles.filter(v => v.state === 0).length}
              </p>
              <p className="text-white/60 text-xs">Out</p>
            </div>
            <div className="text-center">
              <p className="text-red-500 text-sm font-medium">
                {vehicles.filter(v => v.state === 2).length}
              </p>
              <p className="text-white/60 text-xs">Impounded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab("garage")}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
            activeTab === "garage"
              ? "text-samsung-blue border-b-2 border-samsung-blue"
              : "text-white/70"
          }`}
        >
          In Garage ({vehicles.filter(v => v.state === 1).length})
        </button>
        <button
          onClick={() => setActiveTab("out")}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
            activeTab === "out"
              ? "text-samsung-blue border-b-2 border-samsung-blue"
              : "text-white/70"
          }`}
        >
          Out ({vehicles.filter(v => v.state === 0).length})
        </button>
        <button
          onClick={() => setActiveTab("impounded")}
          className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
            activeTab === "impounded"
              ? "text-samsung-blue border-b-2 border-samsung-blue"
              : "text-white/70"
          }`}
        >
          Impounded ({vehicles.filter(v => v.state === 2).length})
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-4 flex-1 overflow-y-auto scrollbar-hide">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map(vehicle => renderVehicleCard(vehicle))
        ) : (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 text-lg font-medium">
              No vehicles {activeTab === "garage" ? "in garage" : activeTab === "out" ? "out" : "impounded"}
            </p>
            <p className="text-white/40 text-sm mt-2">
              {activeTab === "garage" 
                ? "All your vehicles are currently out or impounded" 
                : activeTab === "out" 
                ? "All your vehicles are safely in the garage" 
                : "No vehicles are currently impounded"
              }
            </p>
          </div>
        )}
      </div>

      {/* Valet Modal */}
      {showValetModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-samsung-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-white text-lg font-semibold mb-4">
              Request Valet Service
            </h3>
            
            <div className="mb-4">
              <p className="text-white/80 text-sm mb-2">Vehicle: {selectedVehicle.name}</p>
              <p className="text-white/60 text-sm mb-4">Plate: {selectedVehicle.plate}</p>
              
              <label className="block text-white/80 text-sm mb-2">
                Delivery Location
              </label>
              <Input
                value={valetLocation}
                onChange={(e) => setValetLocation(e.target.value)}
                placeholder="Enter location (e.g., Current Location)"
                className="bg-surface-dark/50 text-black placeholder-white/60 border-white/10 focus:border-samsung-blue rounded-samsung-sm"
              />
            </div>

            <div className="flex items-center space-x-2 mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-samsung-sm">
              <DollarSign className="h-4 w-4 text-yellow-500" />
              <span className="text-yellow-500 text-sm">Valet service fee: $50</span>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setShowValetModal(false)}
                variant="outline"
                className="flex-1 border-white/20 text-black hover:bg-white/20 rounded-samsung-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={() => requestValet(selectedVehicle)}
                className="flex-1 bg-samsung-blue hover:bg-samsung-blue/80 text-white border-0 rounded-samsung-sm"
              >
                <Car className="h-4 w-4 mr-2" />
                Request Valet
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
