import { ArrowLeft, MoreVertical, Share, Trash2, Edit, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNotifications } from '@/utils/notifications';
import { cameraAPI } from '@/utils/nui';

interface GalleryAppProps {
  onBack: () => void;
}

interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  filename: string;
  date: string;
  filter?: string;
  effects?: string[];
}

export const GalleryApp = ({ onBack }: GalleryAppProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccess, showInfo } = useNotifications();

  // Load photos on component mount
  useEffect(() => {
    cameraAPI.getPhotos();
  }, []);

  // Listen for NUI messages from Lua
  useEffect(() => {
    const handleNUIMessage = (event: MessageEvent) => {
      if (event.data && event.data.action) {
        switch (event.data.action) {
          case 'photosLoaded':
            setPhotos(event.data.photos || []);
            setIsLoading(false);
            if (event.data.photos && event.data.photos.length > 0) {
              showInfo('Fotoğraflar Yüklendi', `${event.data.photos.length} fotoğraf bulundu`, 'gallery');
            }
            break;
          case 'photoTaken':
            // Add new photo to the list
            setPhotos(prev => [event.data.photo, ...prev]);
            break;
        }
      }
    };

    window.addEventListener('message', handleNUIMessage);
    return () => window.removeEventListener('message', handleNUIMessage);
  }, [showSuccess, showInfo]);

  const deletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null);
    }
    showSuccess('Fotoğraf Silindi', 'Fotoğraf başarıyla silindi', 'gallery');
  };

  if (selectedPhoto) {
    return (
      <div className="absolute inset-0 bg-black flex flex-col">
        {/* Photo Viewer Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent relative z-10">
          <button 
            className="oneui-button p-2" 
            onClick={() => setSelectedPhoto(null)}
            data-testid="photo-back"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="text-white text-center">
            <h2 className="font-medium">{selectedPhoto.filename}</h2>
            <p className="text-sm text-white/70">{selectedPhoto.date}</p>
          </div>
          <button 
            className="oneui-button p-2"
            data-testid="photo-menu"
          >
            <MoreVertical className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Photo Display */}
        <div className="flex-1 flex items-center justify-center">
          <img 
            src={selectedPhoto.url} 
            alt={selectedPhoto.filename}
            className="max-w-full max-h-full object-contain"
            data-testid="photo-viewer"
          />
        </div>

        {/* Photo Actions */}
        <div className="bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="flex justify-around">
            <button 
              className="oneui-button flex flex-col items-center space-y-1"
              data-testid="photo-share"
            >
              <Share className="w-6 h-6 text-white" />
              <span className="text-white text-xs">Share</span>
            </button>
            <button 
              className="oneui-button flex flex-col items-center space-y-1"
              data-testid="photo-edit"
            >
              <Edit className="w-6 h-6 text-white" />
              <span className="text-white text-xs">Edit</span>
            </button>
            <button 
              className="oneui-button flex flex-col items-center space-y-1"
              onClick={() => deletePhoto(selectedPhoto.id)}
              data-testid="photo-delete"
            >
              <Trash2 className="w-6 h-6 text-red-400" />
              <span className="text-red-400 text-xs">Delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-oneui-dark flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
          data-testid="gallery-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-white text-lg font-semibold">Gallery</h1>
          {!isLoading && photos.length > 0 && (
            <p className="text-white/60 text-sm">{photos.length} photos</p>
          )}
        </div>
        <button 
          className="oneui-button p-2"
          data-testid="gallery-menu"
        >
          <MoreVertical className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Photos Grid */}
      <div className="flex-1 p-4">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="w-16 h-16 bg-surface-dark/50 rounded-samsung mx-auto mb-4 flex items-center justify-center">
                📷
              </div>
              <h3 className="text-lg font-medium mb-2">Loading Photos...</h3>
              <p className="text-sm">Please wait while we load your photos.</p>
            </div>
          </div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <button
                key={photo.id}
                className="oneui-button aspect-square rounded-samsung-sm overflow-hidden bg-surface-dark/30"
                onClick={() => setSelectedPhoto(photo)}
                data-testid={`photo-${photo.id}`}
              >
                <img 
                  src={photo.thumbnail} 
                  alt={photo.filename}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="w-16 h-16 bg-surface-dark/50 rounded-samsung mx-auto mb-4 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white/40" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Photos</h3>
              <p className="text-sm">Take some photos with the camera app</p>
              <button 
                className="oneui-button mt-4 px-6 py-2 bg-samsung-blue text-white rounded-samsung-sm hover:bg-samsung-blue/80 transition-colors"
                onClick={() => onBack()}
              >
                Open Camera
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
