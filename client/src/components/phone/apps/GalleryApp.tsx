import { ArrowLeft, MoreVertical, Share, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';

interface GalleryAppProps {
  onBack: () => void;
}

interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  filename: string;
  date: string;
}

const mockPhotos: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
    filename: 'IMG_001.jpg',
    date: 'Jan 15, 2024'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
    filename: 'IMG_002.jpg',
    date: 'Jan 14, 2024'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
    filename: 'IMG_003.jpg',
    date: 'Jan 13, 2024'
  },
];

export const GalleryApp = ({ onBack }: GalleryAppProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

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
        <h1 className="text-white text-lg font-semibold">Gallery</h1>
        <button 
          className="oneui-button p-2"
          data-testid="gallery-menu"
        >
          <MoreVertical className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Photos Grid */}
      <div className="flex-1 p-4">
        {mockPhotos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {mockPhotos.map((photo) => (
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
                📷
              </div>
              <h3 className="text-lg font-medium mb-2">No Photos</h3>
              <p className="text-sm">Take some photos with the camera app</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
