/**
 * Mirrors backend JSR-380 @Email pattern.
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Mirrors backend @Future annotation. 
 * Blocks past dates and times.
 */
export const isFutureDate = (dateString: string): boolean => {
  if (!dateString) return false;
  const selectedDate = new Date(dateString);
  const now = new Date();
  return selectedDate > now;
};

/**
 * Validates strict geospatial bounds.
 * Lat: ±90, Lng: ±180
 */
export const isValidGeoBounds = (lat: number, lng: number): boolean => {
  const isLatValid = lat >= -90 && lat <= 90;
  const isLngValid = lng >= -180 && lng <= 180;
  return isLatValid && isLngValid;
};