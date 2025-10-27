// Environment variable validation utility
export const validateEnvVars = () => {
  const requiredVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
    'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️  Missing required environment variables:', missingVars);
    return false;
  }
  
  // Validate API URL format
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl && !apiUrl.startsWith('http')) {
    console.warn('⚠️  Invalid API URL format. Should start with http:// or https://');
    return false;
  }
  
  // Validate Google Maps API key
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (googleMapsApiKey && googleMapsApiKey.length < 10) {
    console.warn('⚠️  Google Maps API key seems invalid. Please check your .env.local file.');
    return false;
  }
  
  // Validate Google Client ID
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (googleClientId && googleClientId.length < 10) {
    console.warn('⚠️  Google Client ID seems invalid. Please check your .env.local file.');
    return false;
  }
  
  console.log('✅ Environment variables validation passed');
  return true;
};

// Call this during app initialization
if (typeof window === 'undefined') {
  // Server-side only
  validateEnvVars();
}