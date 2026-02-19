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

  // Get authentication token from backend
  // For security, we should get this from the backend API
  const response = await fetch('/api/imagekit/auth', {
    method: 'GET',
  });

  if (!response.ok) {
    // Fallback: try direct upload (less secure, but works for MVP)
    return uploadDirectly(file, folder, publicKey, urlEndpoint);
  }

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

// Fallback direct upload (requires public key with upload permissions)
async function uploadDirectly(
  file: File,
  folder: string,
  publicKey: string,
  urlEndpoint: string,
): Promise<ImageKitUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);
  formData.append('folder', folder);
  formData.append('publicKey', publicKey);

  const response = await fetch(`${urlEndpoint}/api/v1/files/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ImageKit upload failed: ${error}`);
  }

  const data = await response.json();
  return {
    fileId: data.fileId,
    name: data.name,
    url: data.url,
    thumbnailUrl: data.thumbnailUrl || data.url,
    height: data.height,
    width: data.width,
  };
}
