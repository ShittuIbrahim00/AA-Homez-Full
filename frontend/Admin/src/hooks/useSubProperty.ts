// hooks/useSubProperty.ts
import { useEffect, useState } from "react";
import { useProperties, useProperty } from "@/hooks/useProperty";

interface Property {
  pid: number;
  name: string;
}

export function useFetchProperties(propertyId?: string | null) {
  const { properties, loading: propertiesLoading, error: propertiesError } = useProperties();
  const { property: singleProperty, loading: propertyLoading, error: propertyError } = useProperty(propertyId || "");
  const [propertyName, setPropertyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propertyId) {
      if (singleProperty) {
        setPropertyName(singleProperty.name || "");
        setLoading(false);
      }
      if (propertyError) {
        setError(propertyError);
        setLoading(false);
      }
    } else {
      setLoading(propertiesLoading);
      if (propertiesError) {
        setError(propertiesError);
        setLoading(false);
      }
    }
  }, [propertyId, singleProperty, propertiesLoading, propertyError, propertiesError]);

  return { properties, propertyName, loading, error };
}