/**
 * WhatsApp Share Utilities
 * Handles sharing images and invoices via Web Share API (mobile) or download (desktop)
 */

/**
 * Check if device supports Web Share API with files
 */
export function canShareFiles(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    'share' in navigator &&
    'canShare' in navigator &&
    navigator.canShare !== undefined
  );
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

/**
 * Download a file from URL
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

/**
 * Convert image URL to File object for Web Share API
 */
export async function urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const blob = await response.blob();
  return new File([blob], filename, { type: mimeType });
}

/**
 * Share files via Web Share API (mobile)
 */
export async function shareFilesViaWebShare(
  files: File[],
  text?: string,
  title?: string,
): Promise<void> {
  if (!canShareFiles()) {
    throw new Error('Web Share API not supported on this device');
  }

  const shareData: ShareData = {
    files,
    ...(text && { text }),
    ...(title && { title }),
  };

  // Check if we can share these files
  if (!navigator.canShare(shareData)) {
    throw new Error('Cannot share these files');
  }

  await navigator.share(shareData);
}

/**
 * Share job photos via Web Share API or download ZIP
 */
export async function shareJobPhotos(
  jobId: string,
  clientName: string,
  businessName?: string,
): Promise<void> {
  const isMobile = isMobileDevice();
  const canShare = canShareFiles();

  if (isMobile && canShare) {
    // Mobile: Use Web Share API
    try {
      // Fetch photos from API
      const { apiClient } = await import('@/lib/api-client-singleton');
      const photosResponse = await apiClient.get(`/jobs/${jobId}`);
      const job = photosResponse as {
        photos: { id: string; imageUrl: string; photoType: string }[];
      };

      if (!job.photos || job.photos.length === 0) {
        throw new Error('No photos found for this job');
      }

      // Convert photo URLs to File objects
      const photoFiles = await Promise.all(
        job.photos.map(async (photo, index) => {
          const filename = `${photo.photoType.toLowerCase()}-${index + 1}.jpg`;
          return urlToFile(photo.imageUrl, filename, 'image/jpeg');
        }),
      );

      // Share via Web Share API
      const businessText = businessName ? `Thank you for choosing ${businessName}!` : 'Thank you!';
      const message = `✨ Job Photos\n\nHello ${clientName},\n\nHere are the photos from your cleaning job.\n\n${businessText}`;
      await shareFilesViaWebShare(photoFiles, message, 'Job Photos');
    } catch (error) {
      console.error('Error sharing photos via Web Share API:', error);
      // Fallback to download
      await downloadJobPhotosZip(jobId);
    }
  } else {
    // Desktop: Download ZIP
    await downloadJobPhotosZip(jobId);
  }
}

/**
 * Download job photos as ZIP file
 */
export async function downloadJobPhotosZip(jobId: string): Promise<void> {
  try {
    const { apiClient } = await import('@/lib/api-client-singleton');
    const { createClient } = await import('@/lib/supabase');
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${apiClient.getBaseUrl()}/jobs/${jobId}/photos/download`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download photos: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `job-${jobId}-photos.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading photos ZIP:', error);
    throw error;
  }
}

/**
 * Share invoice PDF via Web Share API or download
 */
export async function shareInvoice(
  invoiceId: string,
  invoiceNumber: string,
  clientName: string,
  businessName: string,
): Promise<void> {
  const isMobile = isMobileDevice();
  const canShare = canShareFiles();

  if (isMobile && canShare) {
    // Mobile: Use Web Share API
    try {
      // Fetch invoice PDF
      const { apiClient } = await import('@/lib/api-client-singleton');
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${apiClient.getBaseUrl()}/invoices/${invoiceId}/pdf`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch invoice PDF: ${response.statusText}`);
      }

      const blob = await response.blob();
      const pdfFile = new File([blob], `invoice-${invoiceNumber}.pdf`, {
        type: 'application/pdf',
      });

      // Share via Web Share API
      const message = `📄 Invoice ${invoiceNumber}\n\nHello ${clientName},\n\nPlease find your invoice attached.\n\nThank you for choosing ${businessName}!`;
      await shareFilesViaWebShare([pdfFile], message, `Invoice ${invoiceNumber}`);
    } catch (error) {
      console.error('Error sharing invoice via Web Share API:', error);
      // Fallback to download
      await downloadInvoicePdf(invoiceId, invoiceNumber);
    }
  } else {
    // Desktop: Download PDF
    await downloadInvoicePdf(invoiceId, invoiceNumber);
  }
}

/**
 * Download invoice PDF
 */
export async function downloadInvoicePdf(invoiceId: string, invoiceNumber: string): Promise<void> {
  try {
    const { apiClient } = await import('@/lib/api-client-singleton');
    const { createClient } = await import('@/lib/supabase');
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${apiClient.getBaseUrl()}/invoices/${invoiceId}/pdf`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download invoice: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `invoice-${invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading invoice PDF:', error);
    throw error;
  }
}
