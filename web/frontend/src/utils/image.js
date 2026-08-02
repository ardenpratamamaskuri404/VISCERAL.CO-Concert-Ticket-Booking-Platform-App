export const getImageUrl = (pathOrUrl, type = 'events') => {
  if (!pathOrUrl) {
    if (type === 'events') {
      return 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80';
    } else {
      return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
    }
  }

  // If it's already a full http/https URL, return it directly
  if (pathOrUrl.startsWith('http')) {
    return pathOrUrl;
  }

  // Otherwise, construct the URL pointing to our Hono static assets server
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3005';
  
  // Ensure we don't double slash if the path already has a leading slash
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl.slice(1) : pathOrUrl;
  
  return `${backendUrl}/assets/${type}/${cleanPath}`;
};