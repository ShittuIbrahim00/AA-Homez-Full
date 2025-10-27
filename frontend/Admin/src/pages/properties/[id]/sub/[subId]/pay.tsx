import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAgents } from "@/hooks/agent.hooks";
import { payForSubProperty } from "@/hooks/property.hooks";
import Loader from "@/layouts/Loader";
import BackButton from "@/pages/properties/components/PropertyDetails/BackButton";
import { formatPrice, parsePriceString } from "@/utils/priceFormatter";
import { toastError, toastSuccess } from "@/utils/toastMsg";

const SubPropertyPaymentPage = () => {
  const router = useRouter();
  const { id: propertyId, subId: subPropertyId } = router.query;
  
  const { agents, loading: agentsLoading } = useAgents();

  const [subProperty, setSubProperty] = useState<any | null>(null);
  const [parentProperty, setParentProperty] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [payData, setPayData] = useState({
    aid: "",
    amount: "",
    soldTo: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);

  // Fetch sub-property data
  useEffect(() => {
    if (!propertyId || !subPropertyId) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("business-token") || 
                     localStorage.getItem("authToken") || 
                     localStorage.getItem("guard-token");
        
        if (!token) {
          setError("Authentication token missing");
          return;
        }
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property/${propertyId}`, {
          headers: { Authorization: token },
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch property data");
        }
        
        const data = await res.json();
        const parentProp = data.data;
        
        // Find the specific sub-property
        const sub = parentProp.SubProperties?.find(
          (s: any) => s.sid.toString() === (subPropertyId as string)
        );
        
        if (!sub) {
          setError("Sub-property not found");
          return;
        }
        
        setParentProperty(parentProp);
        setSubProperty(sub);
      } catch (err) {
        console.error("Error fetching sub-property:", err);
        setError("Failed to load sub-property data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [propertyId, subPropertyId]);

  // Pre-fill amount with sub-property price when sub-property loads
  useEffect(() => {
    if (subProperty && subProperty.price) {
      const priceNumber = parsePriceString(subProperty.price);
      setPayData(prev => ({
        ...prev,
        amount: priceNumber.toString()
      }));
    }
  }, [subProperty]);

  // Filter agents based on search term
  const filteredAgents = useMemo(() => {
    if (!searchTerm) return agents;
    return agents.filter(agent =>
      agent.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [agents, searchTerm]);

  // Handle agent selection
  const handleAgentSelect = (agent: any) => {
    setSelectedAgent(agent);
    setPayData(prev => ({
      ...prev,
      aid: agent.aid
    }));
    setSearchTerm(""); // Clear search term after selection
  };

  // Handle agent removal
  const handleRemoveAgent = () => {
    setSelectedAgent(null);
    setPayData(prev => ({
      ...prev,
      aid: ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!payData.aid || !payData.amount || !payData.soldTo) {
      toastError("All fields are required.");
      return;
    }

    if (!propertyId || !subPropertyId) {
      toastError("Property or sub-property ID is missing.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await payForSubProperty(
        Number(propertyId), 
        Number(subPropertyId), 
        {
          aid: payData.aid,
          amount: Number(payData.amount),
          soldTo: payData.soldTo,
        }
      );

      if (result.success) {
        toastSuccess(result.message || "Payment recorded successfully.");
        // Navigate back to the parent property page to refresh all data
        router.push(`/properties/${propertyId}`);
      } else {
        toastError(result.message || "Failed to process payment.");
      }
    } catch (error) {
      toastError("An error occurred during payment processing.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/properties")}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  if (!subProperty) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sub-Property Not Found</h2>
          <p className="text-gray-600">The sub-property you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push("/properties")}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <BackButton onClick={() => router.push(`/properties/${propertyId}/sub/${subPropertyId}`)} />
      
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pay for Sub-Property</h1>
        <p className="text-gray-600 mb-6">Assign this sub-property to an agent and record payment details</p>
        
        {/* Property Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-semibold text-lg text-gray-900">{subProperty.name}</h2>
              <p className="text-gray-600 text-sm">{subProperty.location}</p>
              {parentProperty && (
                <p className="text-gray-500 text-xs mt-1">Part of: {parentProperty.name}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-700">
                {formatPrice(subProperty.price)}
              </p>
              <p className="text-gray-500 text-sm">Sub-Property Price</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Agent Selection - Improved UI */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Agent
            </label>
            
            {selectedAgent ? (
              // Display selected agent
              <div className="border border-green-300 rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedAgent.imgUrl ? (
                      <img 
                        src={selectedAgent.imgUrl} 
                        alt={selectedAgent.fullName} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold">
                        {selectedAgent.fullName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{selectedAgent.fullName}</p>
                      <p className="text-sm text-gray-500">Agent ID: {selectedAgent.aid}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveAgent}
                    className="text-red-500 hover:text-red-700"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              // Agent search interface
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search agents by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                
                {agentsLoading ? (
                  <p className="text-center py-4 text-gray-500">Loading agents...</p>
                ) : (
                  <>
                    {searchTerm ? (
                      // Show filtered agents
                      <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                        {filteredAgents.length > 0 ? (
                          filteredAgents.map((agent) => (
                            <div
                              key={agent.aid}
                              onClick={() => handleAgentSelect(agent)}
                              className="p-3 border-b border-gray-200 last:border-b-0 hover:bg-orange-50 cursor-pointer flex items-center gap-3"
                            >
                              {agent.imgUrl ? (
                                <img 
                                  src={agent.imgUrl} 
                                  alt={agent.fullName} 
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                                  {agent.fullName.charAt(0)}
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{agent.fullName}</p>
                                <p className="text-sm text-gray-500">ID: {agent.aid}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center py-4 text-gray-500">No agents found matching "{searchTerm}"</p>
                        )}
                      </div>
                    ) : (
                      // Show all agents when no search term
                      <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                        <div className="p-3 text-sm text-gray-500 border-b border-gray-200">
                          Showing {agents.length} agents
                        </div>
                        {agents.slice(0, 10).map((agent) => (
                          <div
                            key={agent.aid}
                            onClick={() => handleAgentSelect(agent)}
                            className="p-3 border-b border-gray-200 last:border-b-0 hover:bg-orange-50 cursor-pointer flex items-center gap-3"
                          >
                            {agent.imgUrl ? (
                              <img 
                                src={agent.imgUrl} 
                                alt={agent.fullName} 
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                                {agent.fullName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{agent.fullName}</p>
                              <p className="text-sm text-gray-500">ID: {agent.aid}</p>
                            </div>
                          </div>
                        ))}
                        {agents.length > 10 && (
                          <div className="p-3 text-center text-sm text-gray-500">
                            Type to search through all {agents.length} agents
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount-input" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₦)
            </label>
            <input
              id="amount-input"
              type="number"
              value={payData.amount}
              onChange={(e) => setPayData({ ...payData, amount: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              min="0"
              step="0.01"
              placeholder="Enter payment amount"
            />
            <p className="mt-1 text-sm text-gray-500">
              Pre-filled with sub-property price: {formatPrice(subProperty.price)}
            </p>
          </div>

          {/* Sold To */}
          <div>
            <label htmlFor="soldto-input" className="block text-sm font-medium text-gray-700 mb-2">
              Sold To
            </label>
            <input
              id="soldto-input"
              type="text"
              value={payData.soldTo}
              onChange={(e) => setPayData({ ...payData, soldTo: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter buyer's name"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push(`/properties/${propertyId}/sub/${subPropertyId}`)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              disabled={isSubmitting || !payData.aid}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Confirm Payment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubPropertyPaymentPage;