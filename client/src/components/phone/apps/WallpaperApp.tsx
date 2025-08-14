import { ArrowLeft, Check, Image, Link, Camera } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface WallpaperAppProps {
  onBack: () => void;
  setWallpaper: (wallpaper: string) => void;
  currentWallpaper: string;
}

export const WallpaperApp = ({ onBack, setWallpaper, currentWallpaper }: WallpaperAppProps) => {
  const { t } = useLanguage();
  const [customUrl, setCustomUrl] = useState('');
  const [showGallery, setShowGallery] = useState(false);

  const wallpapers = [
    { id: 'default', name: 'Default Blue', preview: 'bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800' },
    { id: 'sunset', name: 'Sunset', preview: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600' },
    { id: 'ocean', name: 'Ocean', preview: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600' },
    { id: 'forest', name: 'Forest', preview: 'bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500' },
    { id: 'space', name: 'Space', preview: 'bg-gradient-to-br from-purple-900 via-blue-900 to-black' },
    { id: 'aurora', name: 'Aurora', preview: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600' },
  ];

  const handleCustomUrlSubmit = () => {
    if (customUrl.startsWith('http')) {
      setWallpaper(customUrl);
      setCustomUrl('');
    }
  };

  const handleGallerySelect = (imageUrl: string) => {
    setWallpaper(imageUrl);
    setShowGallery(false);
  };

  return (
    <div className="absolute inset-0 settings-background flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 mt-2">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
          data-testid="wallpaper-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">{t('wallpaper', 'settings')}</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Choose Wallpaper</h3>
          
          {/* Custom URL Input */}
          <div className="mb-6">
            <h4 className="text-white/80 text-sm font-medium mb-3 flex items-center">
              <Link className="w-4 h-4 mr-2" />
              Custom Image URL
            </h4>
            <div className="flex space-x-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 bg-white/10 text-white text-sm px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-samsung-blue"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomUrlSubmit();
                  }
                }}
              />
              <button
                className="bg-samsung-blue text-white px-4 py-2 rounded-lg text-sm hover:bg-samsung-blue/90 transition-colors"
                onClick={handleCustomUrlSubmit}
              >
                Set
              </button>
            </div>
          </div>

          {/* Gallery Selection */}
          <div className="mb-6">
            <h4 className="text-white/80 text-sm font-medium mb-3 flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              From Gallery
            </h4>
            <button
              className="w-full bg-surface-dark/30 text-white p-4 rounded-samsung-sm hover:bg-surface-dark/50 transition-colors"
              onClick={() => setShowGallery(!showGallery)}
            >
              <div className="flex items-center justify-between">
                <span>Select from your photos</span>
                <span className="text-white/60">→</span>
              </div>
            </button>
          </div>

          {/* Predefined Wallpapers */}
          <div className="mb-6">
            <h4 className="text-white/80 text-sm font-medium mb-3 flex items-center">
              <Image className="w-4 h-4 mr-2" />
              Built-in Wallpapers
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {wallpapers.map((wp) => (
                <button
                  key={wp.id}
                  className={`oneui-button relative overflow-hidden rounded-lg transition-all ${
                    currentWallpaper === wp.id 
                      ? 'ring-2 ring-samsung-blue' 
                      : 'hover:ring-1 hover:ring-white/30'
                  }`}
                  onClick={() => setWallpaper(wp.id)}
                  data-testid={`wallpaper-${wp.id}`}
                >
                  <div className={`h-24 w-full ${wp.preview} flex items-center justify-center`}>
                    <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                      {wp.name}
                    </span>
                  </div>
                  {currentWallpaper === wp.id && (
                    <div className="absolute top-2 right-2 bg-samsung-blue text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Current Wallpaper Preview */}
          {currentWallpaper && (
            <div className="mb-6">
              <h4 className="text-white/80 text-sm font-medium mb-3">Current Wallpaper</h4>
              <div className="bg-surface-dark/30 rounded-samsung-sm p-4">
                {currentWallpaper.startsWith('http') ? (
                  <div className="text-center">
                    <img 
                      src={currentWallpaper} 
                      alt="Custom wallpaper" 
                      className="w-full h-32 object-cover rounded-lg mx-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <div className="hidden text-white/60 text-sm mt-2">
                      Custom image loaded
                    </div>
                  </div>
                ) : (
                  <div className={`h-32 w-full ${wallpapers.find(w => w.id === currentWallpaper)?.preview || 'bg-gray-800'} rounded-lg flex items-center justify-center`}>
                    <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">
                      {wallpapers.find(w => w.id === currentWallpaper)?.name || 'Custom'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Gallery Modal */}
        {showGallery && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-samsung-lg p-6 w-96 max-w-[90vw] max-h-[80vh] overflow-y-auto">
              <h3 className="text-white text-lg font-semibold mb-4">Select Photo</h3>
              
              {/* Mock gallery photos - in real app this would load from actual gallery */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  'https://picsum.photos/200/300?random=1',
                  'https://picsum.photos/200/300?random=2',
                  'https://picsum.photos/200/300?random=3',
                  'https://picsum.photos/200/300?random=4',
                  'https://picsum.photos/200/300?random=5',
                  'https://picsum.photos/200/300?random=6'
                ].map((url, index) => (
                  <button
                    key={index}
                    className="oneui-button overflow-hidden rounded-lg hover:ring-2 hover:ring-samsung-blue transition-all"
                    onClick={() => handleGallerySelect(url)}
                  >
                    <img 
                      src={url} 
                      alt={`Gallery photo ${index + 1}`} 
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
              
              <button
                className="w-full bg-samsung-blue text-white p-3 rounded-samsung-sm hover:bg-samsung-blue/90 transition-colors"
                onClick={() => setShowGallery(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
