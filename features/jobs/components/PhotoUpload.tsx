'use client';

import { useState, useRef } from 'react';

interface PhotoUploadProps {
  jobId: string;
  photoType: 'BEFORE' | 'AFTER';
  onUploadSuccess: () => void;
  onError: (error: string) => void;
}

export default function PhotoUpload({
  jobId,
  photoType,
  onUploadSuccess,
  onError,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError('Image size must be less than 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      onError('Please select an image first');
      return;
    }

    setUploading(true);
    try {
      // Get auth token
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      // Upload to ImageKit using the utility function
      const { uploadToImageKit } = await import('@/lib/imagekit');

      console.log('[PHOTO UPLOAD] Starting upload for job:', jobId, 'Type:', photoType);

      const imageKitResult = await uploadToImageKit(file, 'job-photos');

      if (!imageKitResult || !imageKitResult.url) {
        throw new Error('Failed to upload image to ImageKit');
      }

      console.log('[PHOTO UPLOAD] ImageKit upload successful, URL:', imageKitResult.url);

      // Save photo URL to backend
      const { apiClient } = await import('@/lib/api-client-singleton');

      console.log('[PHOTO UPLOAD] Saving photo to backend...');
      await apiClient.post(`/jobs/${jobId}/photos`, {
        imageUrl: imageKitResult.url,
        photoType,
      });

      console.log('[PHOTO UPLOAD] ✅ Photo saved successfully');

      // Reset form and preview
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setPreview(null);
      onUploadSuccess();
    } catch (error: any) {
      console.error('Photo upload error:', error);
      onError(error.message || 'Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-950 mb-2">
          Upload {photoType} Photo
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-950 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-2 file:border-indigo-600 file:text-indigo-700 file:font-semibold file:bg-white hover:file:bg-indigo-50 file:cursor-pointer cursor-pointer touch-manipulation min-h-[48px]"
          disabled={uploading}
        />
        <p className="text-xs text-gray-600 mt-1">Max file size: 10MB</p>
      </div>

      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt={`${photoType} preview`}
            className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200 min-h-[48px] touch-manipulation"
            >
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
            <button
              onClick={handleCancel}
              disabled={uploading}
              className="px-4 py-3 border-2 border-gray-400 text-gray-950 rounded-lg font-bold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-all duration-200 min-h-[48px] touch-manipulation"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
