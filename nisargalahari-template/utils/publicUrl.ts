/**
 * Utility function to get public URLs for assets
 * This helps with proper URL construction in different environments
 */

export const publicUrl = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In development, use relative path
  if (process.env.NODE_ENV === 'development') {
    return `/${cleanPath}`;
  }
  
  // In production, you can configure your domain here
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  return `${baseUrl}/${cleanPath}`;
};

/**
 * Get the full URL for a given path
 * Useful for meta tags and external links
 */
export const getFullUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return `${window.location.origin}${cleanPath}`;
  }
  
  // Server-side: use environment variable or default
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}${cleanPath}`;
};
