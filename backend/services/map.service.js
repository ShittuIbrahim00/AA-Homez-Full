import axios from "axios";

/**
 * Transform a user-provided Google Maps link into an iframe-safe embeddable URL.
 * Keeps original mapLink untouched and returns both.
 */
export const transformMapLink = async (mapLink, fallbackLocation = "") => {
  let finalMapLink = mapLink;

  try {
    // Step 1: Expand short Google redirect links (maps.app.goo.gl)
    if (mapLink.includes("maps.app.goo.gl")) {
      try {
        const res = await axios.get(mapLink, {
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 400,
        });
        if (res.headers.location) finalMapLink = res.headers.location;
      } catch (err) {
        if (err.response?.headers?.location) {
          finalMapLink = err.response.headers.location;
        }
      }
    }

    // Step 2: If finalMapLink isn't iframe-safe, transform it
    if (!finalMapLink.includes("output=embed")) {
      const coordMatch = finalMapLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) {
        // Extract coordinates
        const [_, lat, lng] = coordMatch;
        finalMapLink = `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
      } else {
        // Fallback: use place name or fallbackLocation
        const placeMatch = finalMapLink.match(/q=([^&]+)/);
        const place = placeMatch
          ? decodeURIComponent(placeMatch[1])
          : fallbackLocation;
        finalMapLink = `https://www.google.com/maps?q=${encodeURIComponent(
          place
        )}&output=embed`;
      }
    }
  } catch (error) {
    console.error("Map transformation error:", error.message);
    // Graceful fallback
    finalMapLink = `https://www.google.com/maps?q=${encodeURIComponent(
      fallbackLocation || "Nigeria"
    )}&output=embed`;
  }

  return { mapLink, finalMapLink };
};
