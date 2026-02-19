'use client';

import { useState } from 'react';

interface Photo {
  id: string;
  imageUrl: string;
  photoType: 'BEFORE' | 'AFTER';
  timestamp: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  onDelete?: (photoId: string) => void;
  canDelete?: boolean;
}

export default function PhotoGallery({ photos, onDelete, canDelete = false }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const beforePhotos = photos.filter((p) => p.photoType === 'BEFORE');
  const afterPhotos = photos.filter((p) => p.photoType === 'AFTER');

  if (photos.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-gray-200">
        <svg
          className="w-12 h-12 text-gray-400 mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-600 font-medium">No photos uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Before Photos */}
      {beforePhotos.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-950 mb-3">Before Photos</h3>
          <div className="grid grid-cols-2 gap-4">
            {beforePhotos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.imageUrl}
                  alt="Before"
                  loading="lazy"
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:border-indigo-500 transition-all duration-200 touch-manipulation"
                  onClick={() => setSelectedPhoto(photo)}
                />
                {canDelete && onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // eslint-disable-next-line no-alert
                      if (window.confirm('Are you sure you want to delete this photo?')) {
                        onDelete(photo.id);
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* After Photos */}
      {afterPhotos.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-950 mb-3">After Photos</h3>
          <div className="grid grid-cols-2 gap-4">
            {afterPhotos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.imageUrl}
                  alt="After"
                  loading="lazy"
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:border-indigo-500 transition-all duration-200 touch-manipulation"
                  onClick={() => setSelectedPhoto(photo)}
                />
                {canDelete && onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // eslint-disable-next-line no-alert
                      if (window.confirm('Are you sure you want to delete this photo?')) {
                        onDelete(photo.id);
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-4xl w-full relative">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.photoType}
              className="w-full h-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
