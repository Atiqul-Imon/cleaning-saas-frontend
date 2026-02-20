// ImageKit utility for client-side uploads
// Note: For production, you should use server-side authentication
// This is a simplified client-side implementation

export interface ImageKitUploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
}

export async function uploadToImageKit(
  file: File,
  folder: string = 'job-photos',
): Promise<ImageKitUploadResponse> {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !urlEndpoint) {
    throw new Error('ImageKit credentials not configured');
  }

  // Try direct upload first (ImageKit public key should have upload permissions)
  // If that fails, we can implement backend auth later
  try {
    return await uploadDirectly(file, folder, publicKey, urlEndpoint);
  } catch (error) {
    console.error('[IMAGEKIT] Direct upload failed, trying with auth...', error);
    // Fallback: try to get auth token from backend (if endpoint exists)
    try {
      const response = await fetch('/api/imagekit/auth', {
        method: 'GET',
      });

      if (response.ok) {
        const authData = await response.json();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('folder', folder);
        formData.append('token', authData.token);
        formData.append('signature', authData.signature);
        formData.append('expire', authData.expire.toString());
        formData.append('publicKey', publicKey);

        const uploadResponse = await fetch(`${urlEndpoint}/api/v1/files/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image to ImageKit');
        }

        return uploadResponse.json();
      }
    } catch (authError) {
      console.error('[IMAGEKIT] Auth upload also failed:', authError);
    }

    // Re-throw original error
    throw error;
  }
}

// Direct upload (requires public key with upload permissions)
async function uploadDirectly(
  file: File,
  folder: string,
  publicKey: string,
  urlEndpoint: string,
): Promise<ImageKitUploadResponse> {
  console.log('[IMAGEKIT] Uploading file directly to ImageKit');
  console.log('[IMAGEKIT] File name:', file.name);
  console.log('[IMAGEKIT] File size:', file.size);
  console.log('[IMAGEKIT] Folder:', folder);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', `${folder}/${Date.now()}-${file.name}`);
  formData.append('folder', folder);
  formData.append('publicKey', publicKey);

  console.log('[IMAGEKIT] Sending request to:', `${urlEndpoint}/api/v1/files/upload`);

  const response = await fetch(`${urlEndpoint}/api/v1/files/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[IMAGEKIT] Upload failed:', errorText);
    throw new Error(`ImageKit upload failed: ${errorText}`);
  }

  const data = await response.json();
  console.log('[IMAGEKIT] ✅ Upload successful:', data.url);

  if (!data.url) {
    throw new Error('ImageKit returned no URL');
  }

  return {
    fileId: data.fileId,
    name: data.name,
    url: data.url,
    thumbnailUrl: data.thumbnailUrl || data.url,
    height: data.height,
    width: data.width,
  };
}
