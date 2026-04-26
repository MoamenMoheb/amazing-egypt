export const getAssetUrl = (path: string) => {
  // If the path already includes the base url (e.g. during dev), or is an external URL, don't double it
  if (path.startsWith('http')) return path;
  
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${base}${cleanPath}`;
};
