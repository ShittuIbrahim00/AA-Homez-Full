"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { getCoordinatesFromMapLink, getDefaultCoordinates, type Coordinates } from "@/utils/mapUtils";

// Dynamically import leaflet components to avoid SSR issues
let L: any;

interface SubPropertyMapInnerProps {
  latitude?: number;
  longitude?: number;
  mapLink?: string;
  propertyName?: string;
}

export default function SubPropertyMapInner({
  latitude,
  longitude,
  mapLink,
  propertyName = "Sub-Property",
}: SubPropertyMapInnerProps) {
  const [coordinates, setCoordinates] = useState<Coordinates>(() => {
    // Use provided coordinates if available, otherwise use default
    if (latitude !== undefined && longitude !== undefined) {
      // console.log(`SubPropertyParams - MapInner: Using provided coordinates: ${latitude}, ${longitude}`);
      return { latitude, longitude };
    }
    // console.log('SubPropertyParams - MapInner: Using default coordinates initially');
    return getDefaultCoordinates();
  });
  const [loading, setLoading] = useState(!!mapLink);
  const [mapInstance, setMapInstance] = useState<any>(null);

  // Fix for missing marker icons - using dynamic imports
  useEffect(() => {
    if (typeof window !== "undefined") {
      L = require("leaflet");
      
      // Simple approach to fix marker icons without complex dynamic imports
      try {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: require("leaflet/dist/images/marker-icon.png").default,
          iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
          shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
        });
      } catch (error) {
        console.warn("SubPropertyParams - MapInner: Failed to load marker icons, using defaults:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Extract coordinates from mapLink if provided
    const extractCoordinates = async () => {
      if (mapLink) {
        // console.log(`SubPropertyParams - MapInner: Map link provided: ${mapLink}`);
        setLoading(true);
      
        try {
          const coords = await getCoordinatesFromMapLink(mapLink);
          // console.log(`SubPropertyParams - MapInner: Final coordinates to be used: ${coords.latitude}, ${coords.longitude}`);
     
          setCoordinates(coords);
        } catch (error) {
          console.error('SubPropertyParams - MapInner: Failed to extract coordinates from mapLink:', error);
          console.error('SubPropertyParams - MapInner: Map link that failed:', mapLink);
          setCoordinates(getDefaultCoordinates());
        } finally {
          setLoading(false);
        }
      } else if (latitude !== undefined && longitude !== undefined) {
        // Use provided coordinates
        // console.log(`SubPropertyParams - MapInner: Using provided coordinates: ${latitude}, ${longitude}`);
  
        setCoordinates({ latitude, longitude });
        setLoading(false);
      } else {
        // Use default coordinates
        // console.log('SubPropertyParams - MapInner: Using default coordinates');
   
        setCoordinates(getDefaultCoordinates());
        setLoading(false);
      }
    };

    extractCoordinates();
  }, [mapLink, latitude, longitude]);

  useEffect(() => {
    if (loading || !L || typeof window === "undefined") return; // Don't initialize map while loading coordinates or on server

    // Prevent multiple maps on re-render
    const existingMap = L.DomUtil.get("subPropertyMap");
    if (existingMap && (existingMap as any)._leaflet_id) {
      (existingMap as any)._leaflet_id = null;
    }

    // console.log(`SubPropertyParams - MapInner: Initializing map at final coordinates: ${coordinates.latitude}, ${coordinates.longitude}`);
  
    
    // Initialize map with extracted coordinates
    const map = L.map("subPropertyMap").setView([coordinates.latitude, coordinates.longitude], 15);
    setMapInstance(map);

    // Add tiles with better styling
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    // Marker with custom popup content
    const popupContent = mapLink 
      ? `<div class="text-center"><strong>${propertyName}</strong><br/><a href="${mapLink}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline;">View in Google Maps</a></div>`
      : `<div class="text-center"><strong>${propertyName}</strong></div>`;
    
    const marker = L.marker([coordinates.latitude, coordinates.longitude])
      .addTo(map)
      .bindPopup(popupContent, {
        className: 'custom-popup'
      });
    
    // Open popup by default
    marker.openPopup();

    return () => {
      map.remove();
      setMapInstance(null);
    };
  }, [coordinates, loading, mapLink, propertyName]);

  if (loading || typeof window === "undefined") {
    return (
      <div
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
          color: "#6b7280",
        }}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="subPropertyMap"
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "12px",
        zIndex: 0,
      }}
    />
  );
}