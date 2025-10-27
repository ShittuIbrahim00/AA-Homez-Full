import React, { useEffect, useMemo, useState } from "react";
import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import { getCoordinatesFromMapLink, getDefaultCoordinates, type Coordinates } from "@/utils/mapUtils";

interface MapProps {
  mapLink?: string;
  latitude?: number;
  longitude?: number;
  propertyName?: string;
}

function Map({ mapLink, latitude, longitude, propertyName = "Property Location" }: MapProps) {
    const libraries = useMemo(() => ['places'], []);
    const [coordinates, setCoordinates] = useState<Coordinates>(() => {
        // Use provided coordinates if available, otherwise use default
        if (latitude !== undefined && longitude !== undefined) {
            return { latitude, longitude };
        }
        return getDefaultCoordinates();
    });
    const [loadingCoords, setLoadingCoords] = useState(!!mapLink);

    const mapCenter = useMemo(
        () => ({ lat: coordinates.latitude, lng: coordinates.longitude }),
        [coordinates]
    );

    const mapOptions = useMemo<google.maps.MapOptions>(
        () => ({
            disableDefaultUI: false, // Enable default UI for better user experience
            clickableIcons: true,
            scrollwheel: true,
        }),
        []
    );

    useEffect(() => {
        // Extract coordinates from mapLink if provided
        const extractCoordinates = async () => {
            if (mapLink) {
                setLoadingCoords(true);
                try {
                    const coords = await getCoordinatesFromMapLink(mapLink);
                    setCoordinates(coords);
                } catch (error) {
                    console.error('Failed to extract coordinates from mapLink:', error);
                    setCoordinates(getDefaultCoordinates());
                } finally {
                    setLoadingCoords(false);
                }
            } else if (latitude !== undefined && longitude !== undefined) {
                // Use provided coordinates
                setCoordinates({ latitude, longitude });
                setLoadingCoords(false);
            } else {
                // Use default coordinates
                setCoordinates(getDefaultCoordinates());
                setLoadingCoords(false);
            }
        };

        extractCoordinates();
    }, [mapLink, latitude, longitude]);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyDh1fpsN5cosHq8DzSRrRJgzkiBj9RUyXQ",
        libraries: libraries as any,
    });

    if (!isLoaded || loadingCoords) {
        return (
            <div style={{ 
                width: '100%', 
                height: '400px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                borderRadius: '8px'
            }}>
                Loading map...
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
            <GoogleMap
                options={mapOptions}
                zoom={14}
                center={mapCenter}
                mapTypeId={google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                onLoad={(map) => {
                  // console.log('Sub-Property Map Loaded')
                }}
            >
                <MarkerF
                    position={mapCenter}
                    onLoad={() => {
                      // console.log('Sub-Property Marker Loaded')
                    }}
                    options={{
                        title: propertyName,
                    }}
                />
            </GoogleMap>
        </div>
    );
}

export default Map;