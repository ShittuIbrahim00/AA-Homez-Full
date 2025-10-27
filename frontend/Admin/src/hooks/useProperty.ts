import { useState, useEffect } from 'react';
import axios from 'axios';
import { Property, SubProperty } from '@/types/property';
import { toast } from 'react-toastify';

// Get auth token helper
const getAuthToken = () => {
  const token =
    localStorage.getItem('business-token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('guard-token');

  if (!token) {
    throw new Error('Auth token missing. Please login again.');
  }
  
  return token;
};

// API base URL from environment variable
const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/property`;

// ======================
// PROPERTY HOOKS
// ======================

// Fetch all properties
export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE}`, {
        headers: {
          Authorization: token,
        },
      });
      
      setProperties(response.data.data || []);
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError(err.response?.data?.message || 'Failed to fetch properties');
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return { properties, loading, error, refetch: fetchProperties };
};

// Fetch single property
export const useProperty = (id: string | number) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE}/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      
      setProperty(response.data.data);
    } catch (err: any) {
      console.error('Error fetching property:', err);
      setError(err.response?.data?.message || 'Failed to fetch property');
      toast.error('Failed to fetch property');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  return { property, loading, error, refetch: fetchProperty };
};

// Create property
export const useCreateProperty = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createProperty = async (formData: FormData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const response = await axios.post(`${API_BASE}/add`, formData, {
        headers: {
          Authorization: token,
        },
      });
      
      toast.success('Property created successfully');
      return response.data;
    } catch (err: any) {
      console.error('Error creating property:', err);
      const message = err.response?.data?.message || 'Failed to create property';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProperty, loading, error };
};

// Update property
export const useUpdateProperty = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateProperty = async (id: number, payload: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const response = await axios.patch(`${API_BASE}/update/${id}`, payload, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });
      
      toast.success('Property updated successfully');
      return response.data;
    } catch (err: any) {
      console.error('Error updating property:', err);
      const message = err.response?.data?.message || 'Failed to update property';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProperty, loading, error };
};

// Delete property
export const useDeleteProperty = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProperty = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const response = await axios.delete(`${API_BASE}/delete/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      
      toast.success('Property deleted successfully');
      return response.data;
    } catch (err: any) {
      console.error('Error deleting property:', err);
      const message = err.response?.data?.message || 'Failed to delete property';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteProperty, loading, error };
};

// ======================
// SUB-PROPERTY HOOKS
// ======================

// Fetch sub-properties for a property
export const useSubProperties = (propertyId: string | number) => {
  const [subProperties, setSubProperties] = useState<SubProperty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubProperties = async () => {
    if (!propertyId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE}/${propertyId}`, {
        headers: {
          Authorization: token,
        },
      });
      
      setSubProperties(response.data.data?.SubProperties || []);
    } catch (err: any) {
      console.error('Error fetching sub-properties:', err);
      setError(err.response?.data?.message || 'Failed to fetch sub-properties');
      toast.error('Failed to fetch sub-properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubProperties();
  }, [propertyId]);

  return { subProperties, loading, error, refetch: fetchSubProperties };
};

// Fetch single sub-property
export const useSubProperty = (propertyId: string | number, subPropertyId: string | number) => {
  const [subProperty, setSubProperty] = useState<SubProperty | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubProperty = async () => {
    if (!propertyId || !subPropertyId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE}/${propertyId}`, {
        headers: {
          Authorization: token,
        },
      });
      
      const sub = response.data.data?.SubProperties?.find(
        (s: SubProperty) => s.sid.toString() === subPropertyId.toString()
      );
      
      setSubProperty(sub || null);
    } catch (err: any) {
      console.error('Error fetching sub-property:', err);
      setError(err.response?.data?.message || 'Failed to fetch sub-property');
      toast.error('Failed to fetch sub-property');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubProperty();
  }, [propertyId, subPropertyId]);

  return { subProperty, loading, error, refetch: fetchSubProperty };
};

// Create sub-property
export const useCreateSubProperty = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createSubProperty = async (propertyId: number, payload: FormData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const response = await axios.post(`${API_BASE}/sub/add/${propertyId}`, payload, {
        headers: {
          Authorization: token,
        },
      });
      
      toast.success('Sub-property created successfully');
      return response.data;
    } catch (err: any) {
      console.error('Error creating sub-property:', err);
      const message = err.response?.data?.message || 'Failed to create sub-property';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createSubProperty, loading, error };
};

// Update sub-property
export const useUpdateSubProperty = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateSubProperty = async (subPropertyId: number, payload: FormData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const response = await axios.patch(`${API_BASE}/sub/update/${subPropertyId}`, payload, {
        headers: {
          Authorization: token,
        },
      });
      
      toast.success('Sub-property updated successfully');
      return response.data;
    } catch (err: any) {
      console.error('Error updating sub-property:', err);
      const message = err.response?.data?.message || 'Failed to update sub-property';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateSubProperty, loading, error };
};

// Delete sub-property
export const useDeleteSubProperty = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSubProperty = async (subPropertyId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const response = await axios.delete(`${API_BASE}/sub/delete/${subPropertyId}`, {
        headers: {
          Authorization: token,
        },
      });
      
      toast.success('Sub-property deleted successfully');
      return response.data;
    } catch (err: any) {
      console.error('Error deleting sub-property:', err);
      const message = err.response?.data?.message || 'Failed to delete sub-property';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteSubProperty, loading, error };
};

// Pay for property
export const usePayForProperty = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const payForProperty = async (propertyId: number, payload: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const response = await axios.post(`${API_BASE}/${propertyId}/pay`, payload, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.data?.status || response.data?.success) {
        toast.success(response.data.message || 'Payment successful');
        return response.data;
      } else {
        throw new Error(response.data.message || 'Payment failed');
      }
    } catch (err: any) {
      console.error('Error paying for property:', err);
      const message = err.response?.data?.message || 'Failed to process payment';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { payForProperty, loading, error };
};

// Pay for sub-property
export const usePayForSubProperty = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const payForSubProperty = async (propertyId: number, subPropertyId: number, payload: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const response = await axios.post(
        `${API_BASE}/${propertyId}/sub-properties/${subPropertyId}/pay`,
        payload,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.data?.status || response.data?.success) {
        toast.success(response.data.message || 'Payment successful');
        return response.data;
      } else {
        throw new Error(response.data.message || 'Payment failed');
      }
    } catch (err: any) {
      console.error('Error paying for sub-property:', err);
      const message = err.response?.data?.message || 'Failed to process payment';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { payForSubProperty, loading, error };
};