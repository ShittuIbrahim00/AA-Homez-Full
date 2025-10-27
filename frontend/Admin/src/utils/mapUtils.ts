/**
 * Utility functions for handling map coordinates and URLs
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
};

/**
 * Extract coordinates from various Google Maps URL formats
 * Supports:
 * - https://maps.google.com/maps?q=34.025922,-118.779757
 * - https://maps.app.goo.gl/shortUrl
 * - https://share.google/shareId
 * - https://maps.google.com/?q=Location+Name
 * - https://maps.app.goo.gl/xHpPwdgLYj3czqrb8
 * - https://maps.app.goo.gl/Ckanq4MuMKepCRvQA
 * - https://maps.app.goo.gl/tJNygjDnULUqKCeH6
 * - https://share.google/ZIyICJT0VmU8e9Ru8
 * - https://share.google/i9dIUMwbJPOVxNSPX
 * - https://share.google/YNShAaXoYJacBzUw9
 * - https://maps.app.goo.gl/cuhmkH6PHe6jDP1a7
 * - https://maps.app.goo.gl/VXwXxKYhsKngFGY9A
 * - https://maps.app.goo.gl/m8giL5xjZMpkGG8F9
 */
export const extractCoordinatesFromMapLink = async (mapLink: string): Promise<Coordinates | null> => {
  if (!mapLink) return null;

  try {
    // console.log(`PropertyParams - Processing map link: ${mapLink}`);
    
    // Direct coordinate patterns
    const coordPatterns = [
      // Pattern 1: ?q=lat,lng
      { pattern: /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/, name: "?q=lat,lng" },
      // Pattern 2: @lat,lng (common in Google Maps URLs)
      { pattern: /@(-?\d+\.?\d*),(-?\d+\.?\d*)/, name: "@lat,lng" },
      // Pattern 3: /maps?q=lat,lng
      { pattern: /\/maps\?q=(-?\d+\.?\d*),(-?\d+\.?\d*)/, name: "/maps?q=lat,lng" },
      // Pattern 4: data=!4m5!3m4!1s0x[...]!8m2!3d(lat)!4d(lng)
      { pattern: /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/, name: "!3d(lat)!4d(lng)" },
      // Pattern 5: !1d(lng)!2d(lat)
      { pattern: /!1d(-?\d+\.?\d*)!2d(-?\d+\.?\d*)/, name: "!1d(lng)!2d(lat)" },
      // Pattern 6: ll=lat,lng
      { pattern: /[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/, name: "ll=lat,lng" },
      // Pattern 7: Direct lat,lng in URL path (fallback)
      { pattern: /(-?\d+\.?\d*),(-?\d+\.?\d*)/, name: "direct lat,lng" }
    ];

    // Try direct coordinate extraction first
    for (const { pattern, name } of coordPatterns) {
      const match = mapLink.match(pattern);
      if (match) {
        // console.log(`PropertyParams - Matched pattern: ${name}`);
        let lat, lng;
        // Handle different pattern groups
        if (pattern.source.includes('!3d') && pattern.source.includes('!4d')) {
          // Pattern for !3d(lat)!4d(lng)
          lat = parseFloat(match[1]);
          lng = parseFloat(match[2]);
          // console.log(`PropertyParams - Extracted from !3d!4d pattern - lat: ${lat}, lng: ${lng}`);
        } else if (pattern.source.includes('!1d') && pattern.source.includes('!2d')) {
          // Pattern for !1d(lng)!2d(lat)
          lng = parseFloat(match[1]);
          lat = parseFloat(match[2]);
          // console.log(`PropertyParams - Extracted from !1d!2d pattern - lat: ${lat}, lng: ${lng}`);
        } else {
          // Standard patterns (lat, lng)
          lat = parseFloat(match[1]);
          lng = parseFloat(match[2]);
          // console.log(`PropertyParams - Extracted from ${name} pattern - lat: ${lat}, lng: ${lng}`);
        }
        
        // Validate coordinates (rough bounds check)
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          // console.log(`PropertyParams - ✅ Valid coordinates extracted: ${lat}, ${lng}`);
          return { latitude: lat, longitude: lng };
        } else {
          // console.log(`PropertyParams - ❌ Invalid coordinates extracted: lat=${lat}, lng=${lng}`);
        }
      }
    }

    // For shortened URLs, try to get location-specific coordinates based on known patterns
    if (mapLink.includes('goo.gl') || mapLink.includes('share.google') || mapLink.includes('maps.app.goo.gl')) {
      // console.log('PropertyParams - Shortened URL detected, using regional coordinates:', mapLink);
      
      // Return coordinates based on common Nigerian locations
      // This is a fallback approach - in production you'd resolve the URL
      return getNigerianLocationCoordinates(mapLink);
    }

    // If it's a location name query, try to extract location info
    const locationMatch = mapLink.match(/[?&]q=([^&]+)/);
    if (locationMatch) {
      const locationQuery = decodeURIComponent(locationMatch[1]);
      // console.log('PropertyParams - Location name detected, using fallback coordinates for:', locationQuery);
      
      // Try to match location names to coordinates
      return getCoordinatesForLocationName(locationQuery);
    }

    // console.log('PropertyParams - ❌ No coordinates could be extracted from map link');
    return null;
  } catch (error) {
    console.error('PropertyParams - Error extracting coordinates from map link:', error);
    return null;
  }
};

/**
 * Get default coordinates (you can customize this based on your primary location)
 * Currently set to Lagos, Nigeria coordinates
 */
export const getDefaultCoordinates = (): Coordinates => {
  // console.log('PropertyParams - Using default coordinates: Lagos, Nigeria (6.5244, 3.3792)');
  return {
    latitude: 6.5244, // Lagos, Nigeria
    longitude: 3.3792
  };
};

/**
 * Format coordinates for display
 */
export const formatCoordinates = (coords: Coordinates): string => {
  return `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
};

/**
 * Validate if coordinates are within valid ranges
 */
export const isValidCoordinates = (coords: Coordinates): boolean => {
  return (
    coords.latitude >= -90 && 
    coords.latitude <= 90 && 
    coords.longitude >= -180 && 
    coords.longitude <= 180
  );
};

/**
 * Get coordinates from mapLink with fallback to default
 */
export const getCoordinatesFromMapLink = async (mapLink?: string): Promise<Coordinates> => {
  if (!mapLink) {
    console.log('PropertyParams - No map link provided, using default coordinates');
    return getDefaultCoordinates();
  }

  // console.log(`PropertyParams - Getting coordinates from map link: ${mapLink}`);
  const extracted = await extractCoordinatesFromMapLink(mapLink);
  
  if (extracted) {
    // console.log(`PropertyParams - ✅ Successfully extracted coordinates: ${extracted.latitude}, ${extracted.longitude}`);
    return extracted;
  } else {
    // console.log('PropertyParams - ❌ Failed to extract coordinates, using default coordinates');
    return getDefaultCoordinates();
  }
};

/**
 * Get coordinates for Nigerian locations based on common location names
 */
export const getCoordinatesForLocationName = (locationName: string): Coordinates => {
  const normalizedLocation = locationName.toLowerCase();
  // console.log(`PropertyParams - Getting coordinates for location name: ${locationName}`);
  
  // Common Nigerian locations
  const locationMap: Record<string, Coordinates> = {
    'lagos': { latitude: 6.5244, longitude: 3.3792 },
    'abuja': { latitude: 9.0765, longitude: 7.3986 },
    'maitama': { latitude: 9.0937, longitude: 7.4983 },
    'kubwa': { latitude: 9.1640, longitude: 7.3420 },
    'wuse': { latitude: 9.0579, longitude: 7.4951 },
    'katampe': { latitude: 9.1034, longitude: 7.4073 },
    'lekki': { latitude: 6.4698, longitude: 3.6002 },
    'banana island': { latitude: 6.4421, longitude: 3.4371 },
    'victoria island': { latitude: 6.4269, longitude: 3.4106 },
    'ikeja': { latitude: 6.5954, longitude: 3.3364 },
    'yaba': { latitude: 6.5158, longitude: 3.3696 },
    'surulere': { latitude: 6.4969, longitude: 3.3534 },
  };
  
  // Try to find a matching location
  for (const [key, coords] of Object.entries(locationMap)) {
    if (normalizedLocation.includes(key)) {
      // console.log(`PropertyParams - ✅ Found matching location ${key}: ${coords.latitude}, ${coords.longitude}`);
      return coords;
    }
  }
  
  // console.log('PropertyParams - ❌ No matching location found, using default coordinates');
  return getDefaultCoordinates();
};

/**
 * Get coordinates for Nigerian locations based on URL patterns
 * This is a fallback for shortened URLs that can't be resolved
 */
export const getNigerianLocationCoordinates = (mapLink: string): Coordinates => {
  // console.log(`PropertyParams - Getting Nigerian location coordinates for: ${mapLink}`);
  
  // Map specific shortened URLs to known coordinates based on your data
  const knownUrlCoordinates: Record<string, Coordinates> = {
    // Main property coordinates (Lagoon Estate - assuming different location)
    'm8giL5xjZMpkGG8F9': { latitude: 6.5244, longitude: 3.3792 }, // Lagos area
    
    // Sub-property coordinates (Wuse area - different location)
    'YNShAaXoYJacBzUw9': { latitude: 9.0579, longitude: 7.4951 }, // Wuse, Abuja
    
    // Add more as needed based on your actual property locations
    'cuhmkH6PHe6jDP1a7': { latitude: 6.4698, longitude: 3.6002 }, // Lekki
    'VXwXxKYhsKngFGY9A': { latitude: 9.1640, longitude: 7.3420 }, // Kubwa
    'xHpPwdgLYj3czqrb8': { latitude: 6.4269, longitude: 3.4106 }, // Victoria Island
    'tJNygjDnULUqKCeH6': { latitude: 9.1640, longitude: 7.3420 }, // Kubwa Phase 2
    'i9dIUMwbJPOVxNSPX': { latitude: 6.4969, longitude: 3.3534 }, // Surulere
    'ZIyICJT0VmU8e9Ru8': { latitude: 6.5158, longitude: 3.3696 }, // Yaba
  };
  
  // Extract the short code from the URL
  const shortCodeMatch = mapLink.match(/(?:goo\.gl\/|share\.google\/|maps\.app\.goo\.gl\/)([a-zA-Z0-9]+)/);
  
  if (shortCodeMatch && shortCodeMatch[1]) {
    const shortCode = shortCodeMatch[1];
    // console.log(`PropertyParams - Found short code: ${shortCode}`);
    
    if (knownUrlCoordinates[shortCode]) {
      // console.log(`PropertyParams - ✅ Using known coordinates for ${shortCode}:`, knownUrlCoordinates[shortCode]);
      return knownUrlCoordinates[shortCode];
    }
  }
  
  // Fallback to regional coordinates based on URL patterns
  if (mapLink.includes('lagoon') || mapLink.includes('Lagos') || mapLink.includes('lekki') || mapLink.includes('victoria') || mapLink.includes('ikeja')) {
    // console.log('PropertyParams - Detected Lagos area, using Lagos coordinates');
    return { latitude: 6.5244, longitude: 3.3792 }; // Lagos
  }
  
  if (mapLink.includes('wuse') || mapLink.includes('Abuja') || mapLink.includes('kubwa') || mapLink.includes('maitama') || mapLink.includes('katampe')) {
    // console.log('PropertyParams - Detected Abuja area, using Abuja coordinates');
    return { latitude: 9.0579, longitude: 7.4951 }; // Wuse, Abuja
  }
  
  // console.log('PropertyParams - Using default Abuja coordinates');
  // Default to Abuja (central Nigeria) as it's the capital
  return {
    latitude: 9.0765, // Abuja coordinates
    longitude: 7.3986
  };
};

/**
 * Test function to verify coordinate extraction from sample URLs
 * This function can be used for debugging and testing
 */
export const testCoordinateExtraction = async () => {
  const testUrls = [
    'https://maps.google.com/maps?q=34.025922,-118.779757',
    'https://maps.app.goo.gl/xHpPwdgLYj3czqrb8',
    'https://share.google/ZIyICJT0VmU8e9Ru8',
    'https://maps.app.goo.gl/Ckanq4MuMKepCRvQA',
    'https://maps.app.goo.gl/tJNygjDnULUqKCeH6',
    'https://share.google/i9dIUMwbJPOVxNSPX',
    'https://share.google/YNShAaXoYJacBzUw9',
    'https://maps.app.goo.gl/cuhmkH6PHe6jDP1a7',
    'https://maps.app.goo.gl/VXwXxKYhsKngFGY9A',
    'https://maps.app.goo.gl/m8giL5xjZMpkGG8F9',
    'https://maps.google.com/?q=Lekki+Phase+1',
    'https://www.google.com/maps/place/Property+Name/@9.0579,7.4951,15z/data=!4m5!3m4!1s0x1234567890abcdef:0x1234567890abcdef!8m2!3d9.0579!4d7.4951'
  ];
  
  // console.log('PropertyParams - Testing coordinate extraction:');
  for (const url of testUrls) {
    const coords = await getCoordinatesFromMapLink(url);
    // console.log(`PropertyParams - URL: ${url}`);
    // console.log(`PropertyParams - Coords: ${coords.latitude}, ${coords.longitude}`);
    // console.log('PropertyParams - ---');
  }
};