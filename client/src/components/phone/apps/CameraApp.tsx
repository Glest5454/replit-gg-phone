import { ArrowLeft, Camera, SwitchCamera, Zap, Timer, Settings } from 'lucide-react';
import { useState } from 'react';

interface CameraAppProps {
  onBack: () => void;
}

export const CameraApp = ({ onBack }: CameraAppProps) => {
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');

  const handleCapture = () => {
    // This would trigger the FiveM screenshot functionality
    console.log('Capturing photo...');
  };

  return (
    <div className="absolute inset-0 bg-black flex flex-col">
      {/* Camera Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent relative z-10">
        <button 
          className="oneui-button p-2" 
          onClick={onBack}
          data-testid="camera-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center space-x-4">
          <button 
            className={`oneui-button p-2 ${isFlashOn ? 'text-yellow-400' : 'text-white'}`}
            onClick={() => setIsFlashOn(!isFlashOn)}
            data-testid="flash-toggle"
          >
            <Zap className="w-5 h-5" />
          </button>
          <button 
            className="oneui-button p-2 text-white"
            data-testid="timer-toggle"
          >
            <Timer className="w-5 h-5" />
          </button>
          <button 
            className="oneui-button p-2 text-white"
            data-testid="camera-settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Camera Viewfinder */}
      <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
        {/* Placeholder for camera feed */}
        <div className="text-white/50 text-center">
          <Camera className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg">Camera View</p>
          <p className="text-sm">Integration with FiveM screenshot system</p>
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>
      </div>

      {/* Camera Controls */}
      <div className="bg-gradient-to-t from-black/70 to-transparent p-6">
        {/* Mode Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-black/50 rounded-full p-1 flex">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                cameraMode === 'photo' 
                  ? 'bg-samsung-blue text-white' 
                  : 'text-white/70'
              }`}
              onClick={() => setCameraMode('photo')}
              data-testid="mode-photo"
            >
              Photo
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                cameraMode === 'video' 
                  ? 'bg-samsung-blue text-white' 
                  : 'text-white/70'
              }`}
              onClick={() => setCameraMode('video')}
              data-testid="mode-video"
            >
              Video
            </button>
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
            className="oneui-button w-20 h-20 bg-white rounded-full flex items-center justify-center relative"
            onClick={handleCapture}
            data-testid="capture-button"
          >
            <div className="w-16 h-16 bg-white border-4 border-gray-300 rounded-full" />
          </button>
          
          <button 
            className="oneui-button w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
            data-testid="switch-camera"
          >
            <SwitchCamera className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
