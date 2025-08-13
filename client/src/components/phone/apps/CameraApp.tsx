import { ArrowLeft, Camera, SwitchCamera, Zap, Timer, Settings, Palette, Sparkles, Sun, Moon, Droplets, Snowflake, Heart, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNotifications } from '@/utils/notifications';
import { cameraAPI } from '@/utils/nui';

interface CameraAppProps {
  onBack: () => void;
}

interface CameraFilter {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  preview: string;
  cssFilter: string;
  category: 'basic' | 'artistic' | 'vintage' | 'beauty';
}

interface CameraEffect {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  active: boolean;
}

const cameraFilters: CameraFilter[] = [
  { id: 'none', name: 'None', icon: Camera, preview: 'none', cssFilter: 'none', category: 'basic' },
  { id: 'vivid', name: 'Vivid', icon: Sun, preview: 'vivid', cssFilter: 'saturate(1.5) contrast(1.2)', category: 'basic' },
  { id: 'dramatic', name: 'Dramatic', icon: Moon, preview: 'dramatic', cssFilter: 'contrast(1.5) brightness(0.9) saturate(1.3)', category: 'basic' },
  { id: 'warm', name: 'Warm', icon: Sun, preview: 'warm', cssFilter: 'sepia(0.3) saturate(1.2) hue-rotate(10deg)', category: 'basic' },
  { id: 'cool', name: 'Cool', icon: Snowflake, preview: 'cool', cssFilter: 'hue-rotate(200deg) saturate(1.1)', category: 'basic' },
  { id: 'vintage', name: 'Vintage', icon: Star, preview: 'vintage', cssFilter: 'sepia(0.5) contrast(1.2) brightness(1.1)', category: 'vintage' },
  { id: 'noir', name: 'Noir', icon: Moon, preview: 'noir', cssFilter: 'grayscale(1) contrast(1.3)', category: 'vintage' },
  { id: 'retro', name: 'Retro', icon: Heart, preview: 'retro', cssFilter: 'sepia(0.8) saturate(2) hue-rotate(315deg)', category: 'vintage' },
  { id: 'dream', name: 'Dream', icon: Sparkles, preview: 'dream', cssFilter: 'blur(0.5px) brightness(1.1) saturate(1.3)', category: 'artistic' },
  { id: 'glow', name: 'Glow', icon: Sun, preview: 'glow', cssFilter: 'brightness(1.2) saturate(1.4) blur(0.3px)', category: 'artistic' },
  { id: 'soft', name: 'Soft', icon: Droplets, preview: 'soft', cssFilter: 'blur(0.8px) brightness(1.05)', category: 'beauty' },
  { id: 'smooth', name: 'Smooth', icon: Heart, preview: 'smooth', cssFilter: 'blur(0.4px) saturate(1.1) brightness(1.02)', category: 'beauty' }
];

const cameraEffects: CameraEffect[] = [
  { id: 'grid', name: 'Grid', icon: Settings, description: 'Rule of thirds grid', active: false },
  { id: 'timer', name: 'Timer', icon: Timer, description: '3 second delay', active: false },
  { id: 'hdr', name: 'HDR', icon: Sun, description: 'High dynamic range', active: false },
  { id: 'night', name: 'Night', icon: Moon, description: 'Enhanced low light', active: false },
  { id: 'portrait', name: 'Portrait', icon: Camera, description: 'Background blur', active: false },
  { id: 'macro', name: 'Macro', icon: Sparkles, description: 'Close-up focus', active: false }
];

export const CameraApp = ({ onBack }: CameraAppProps) => {
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video' | 'portrait' | 'night' | 'pro'>('photo');
  const [selectedFilter, setSelectedFilter] = useState<CameraFilter>(cameraFilters[0]);
  const [activeEffects, setActiveEffects] = useState<CameraEffect[]>(cameraEffects);
  const [showFilters, setShowFilters] = useState(false);
  const [showEffects, setShowEffects] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'basic' | 'artistic' | 'vintage' | 'beauty'>('basic');
  const { showSuccess, showError } = useNotifications();

  // Listen for NUI messages from Lua
  useEffect(() => {
    const handleNUIMessage = (event: MessageEvent) => {
      if (event.data && event.data.action) {
        switch (event.data.action) {
          case 'photoTaken':
            showSuccess('Fotoğraf Çekildi!', 'Fotoğraf başarıyla kaydedildi', 'camera');
            break;
          case 'cameraError':
            showError('Kamera Hatası', event.data.error, 'camera');
            break;
        }
      }
    };

    window.addEventListener('message', handleNUIMessage);
    return () => window.removeEventListener('message', handleNUIMessage);
  }, [showSuccess, showError]);

  const toggleEffect = (effectId: string) => {
    setActiveEffects(prev => prev.map(effect => 
      effect.id === effectId 
        ? { ...effect, active: !effect.active }
        : effect
    ));
  };

  const handleCapture = () => {
    // Get active effects
    const activeEffectNames = activeEffects.filter(e => e.active).map(e => e.name);
    console.log('Capturing photo with filter:', selectedFilter.name, 'and effects:', activeEffectNames);
    
    // Show loading notification
    showSuccess('Fotoğraf Çekiliyor...', 'Lütfen bekleyin', 'camera');
    
    // Trigger photo capture via NUI
    cameraAPI.takePhoto(selectedFilter.id, activeEffectNames, selectedFilter.cssFilter);
  };

  const filteredFilters = cameraFilters.filter(filter => filter.category === filterCategory);
  const isGridActive = activeEffects.find(e => e.id === 'grid')?.active || false;

  return (
    <div className="absolute inset-0 bg-black flex flex-col">
      {/* Camera Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent relative z-10 mt-2">
        <button 
          className="oneui-button p-2" 
          onClick={onBack}
          data-testid="camera-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        
        {/* Camera Mode Indicator */}
        <div className="flex items-center space-x-2">
          <div className="bg-black/30 px-3 py-1 rounded-full">
            <span className="text-white text-sm font-medium capitalize">{cameraMode}</span>
          </div>
          {selectedFilter.id !== 'none' && (
            <div className="bg-samsung-blue/80 px-3 py-1 rounded-full">
              <span className="text-white text-sm font-medium">{selectedFilter.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button 
            className={`oneui-button p-2 ${isFlashOn ? 'text-yellow-400' : 'text-white'}`}
            onClick={() => setIsFlashOn(!isFlashOn)}
            data-testid="flash-toggle"
          >
            <Zap className="w-5 h-5" />
          </button>
          <button 
            className={`oneui-button p-2 ${showEffects ? 'text-samsung-blue' : 'text-white'}`}
            onClick={() => {
              setShowEffects(!showEffects);
              setShowFilters(false);
            }}
            data-testid="effects-toggle"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button 
            className={`oneui-button p-2 ${showFilters ? 'text-samsung-blue' : 'text-white'}`}
            onClick={() => {
              setShowFilters(!showFilters);
              setShowEffects(false);
            }}
            data-testid="filters-toggle"
          >
            <Palette className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Camera Viewfinder */}
      <div className="flex-1 relative bg-gray-900 flex items-center justify-center overflow-hidden">
        {/* Camera feed with applied filter */}
        <div 
          className="w-full h-full relative"
          style={{ filter: selectedFilter.cssFilter }}
        >
          {/* Placeholder for camera feed */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-white/50 text-center">
              <Camera className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg">Camera View</p>
              <p className="text-sm">Filter: {selectedFilter.name}</p>
            </div>
          </div>

          {/* Active effects overlays */}
          {activeEffects.find(e => e.id === 'portrait' && e.active) && (
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 pointer-events-none" />
          )}

          {activeEffects.find(e => e.id === 'night' && e.active) && (
            <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />
          )}
        </div>

        {/* Grid overlay */}
        {isGridActive && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full grid grid-cols-3 grid-rows-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border border-white/20" />
              ))}
            </div>
          </div>
        )}

        {/* Focus indicator */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-20 h-20 border-2 border-white/60 rounded-lg opacity-0 animate-pulse" id="focus-indicator" />
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-4 z-20 max-h-80">
          {/* Filter Categories */}
          <div className="flex justify-center mb-4">
            <div className="bg-black/50 rounded-full p-1 flex">
              {(['basic', 'artistic', 'vintage', 'beauty'] as const).map(category => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    filterCategory === category 
                      ? 'bg-samsung-blue text-white' 
                      : 'text-white/70'
                  }`}
                  onClick={() => setFilterCategory(category)}
                  data-testid={`filter-category-${category}`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto">
            {filteredFilters.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <button
                  key={filter.id}
                  className={`oneui-button flex flex-col items-center space-y-2 p-3 rounded-samsung-sm transition-all duration-200 ${
                    selectedFilter.id === filter.id
                      ? 'bg-samsung-blue/30 border border-samsung-blue'
                      : 'bg-black/30 border border-white/10'
                  }`}
                  onClick={() => setSelectedFilter(filter)}
                  data-testid={`filter-${filter.id}`}
                >
                  <div 
                    className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-samsung-sm flex items-center justify-center"
                    style={{ filter: filter.cssFilter }}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-xs font-medium">{filter.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Effects Panel */}
      {showEffects && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-4 z-20 max-h-80">
          <div className="mb-4">
            <h3 className="text-white text-lg font-semibold mb-3 text-center">Camera Effects</h3>
          </div>

          {/* Effects Grid */}
          <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
            {activeEffects.map((effect) => {
              const IconComponent = effect.icon;
              return (
                <button
                  key={effect.id}
                  className={`oneui-button flex items-center space-x-3 p-3 rounded-samsung-sm transition-all duration-200 ${
                    effect.active
                      ? 'bg-samsung-blue/30 border border-samsung-blue'
                      : 'bg-black/30 border border-white/10'
                  }`}
                  onClick={() => toggleEffect(effect.id)}
                  data-testid={`effect-${effect.id}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    effect.active ? 'bg-samsung-blue' : 'bg-white/20'
                  }`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white text-sm font-medium">{effect.name}</p>
                    <p className="text-white/60 text-xs">{effect.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Camera Controls */}
      <div className="bg-gradient-to-t from-black/70 to-transparent p-6 relative z-10">
        {/* Mode Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-black/50 rounded-full p-1 flex">
            {(['photo', 'video', 'portrait', 'night', 'pro'] as const).map(mode => (
              <button
                key={mode}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  cameraMode === mode 
                    ? 'bg-samsung-blue text-white' 
                    : 'text-white/70'
                }`}
                onClick={() => setCameraMode(mode)}
                data-testid={`mode-${mode}`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Capture Controls */}
        <div className="flex items-center justify-between">
          <button 
            className="oneui-button w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
            data-testid="gallery-quick"
          >
            <div className="w-8 h-8 bg-white/30 rounded" />
          </button>
          
          <button 
            className={`oneui-button w-20 h-20 rounded-full flex items-center justify-center relative transition-all duration-200 ${
              cameraMode === 'video' 
                ? 'bg-red-500' 
                : 'bg-white'
            }`}
            onClick={handleCapture}
            data-testid="capture-button"
          >
            {cameraMode === 'video' ? (
              <div className="w-6 h-6 bg-white rounded-sm" />
            ) : (
              <div className="w-16 h-16 bg-white border-4 border-gray-300 rounded-full" />
            )}
          </button>
          
          <button 
            className="oneui-button w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
            data-testid="switch-camera"
          >
            <SwitchCamera className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Additional Pro Controls */}
        {cameraMode === 'pro' && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-white text-sm">
              <span>ISO</span>
              <div className="flex space-x-2">
                {['Auto', '100', '200', '400', '800'].map(iso => (
                  <button key={iso} className="oneui-button px-2 py-1 bg-black/30 rounded text-xs">
                    {iso}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-white text-sm">
              <span>Exposure</span>
              <input 
                type="range" 
                min="-2" 
                max="2" 
                step="0.1" 
                className="w-32"
                data-testid="exposure-slider"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
