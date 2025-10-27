import React, { useState, useEffect } from "react";
import { Notification } from "@/types/notification";
import Modal from "../notifications/Modal";
import Spinner from "./Spinner";
import { useAgents } from "@/hooks/agent.hooks"; // Add this import

interface Props {
  notification: Notification;
  onMarkAsRead?: () => Promise<void>;
  isMarking?: boolean;
  deleteNotification?: (sid: number) => void;
}

export default function NotificationCard({ notification, onMarkAsRead, isMarking, deleteNotification }: Props) {
  const { title, body, createdAt, data, isRead, sid } = notification;
  const [modalOpen, setModalOpen] = useState(false);
  const [hasMarkedRead, setHasMarkedRead] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { agents, loading: agentsLoading } = useAgents(); // Fetch agents data

  const formattedDate = new Date(createdAt).toLocaleString();

  // Find agent name by ID
  const getAgentName = (agentId: string | number) => {
    if (agentsLoading || !agents) return `Agent ${agentId}`;
    const agent = agents.find(a => a.aid === parseInt(agentId.toString()));
    return agent ? agent.fullName : `Agent ${agentId}`;
  };

  // Determine if it's a property or sub-property
  const getPropertyType = () => {
    if (data.subPropertyId) return "Sub-Property";
    if (data.propertyId) return "Property";
    return null;
  };

  // Get property identifier
  const getPropertyIdentifier = () => {
    if (data.subPropertyId) return data.subPropertyId;
    if (data.propertyId) return data.propertyId;
    return null;
  };

  useEffect(() => {
    if (modalOpen && !isRead && onMarkAsRead && !hasMarkedRead) {
      onMarkAsRead().then(() => setHasMarkedRead(true));
    }
  }, [modalOpen, isRead, onMarkAsRead, hasMarkedRead]);

  const handleDelete = async () => {
    if (!deleteNotification) return;
    setDeleting(true);
    await deleteNotification(sid);
    setDeleting(false);
    setShowDeleteModal(false);
    setModalOpen(false);
  };

  const handleOpenModal = () => {
    if (isMarking) return;
    setModalOpen(true);
  };

  // Function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get notification type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "commission":
        return "bg-green-100 text-green-800";
      case "system":
        return "bg-blue-100 text-blue-800";
      case "profile":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format currency based on the data
  const formatCurrency = (amount: number) => {
    // Check if it's in Naira (₦) or Dollars ($)
    const isNaira = body.includes("₦");
    if (isNaira) {
      return `₦${amount.toLocaleString()}`;
    } else {
      return `$${amount.toLocaleString()}`;
    }
  };

  return (
    <>
      <div
        className={`p-4 border rounded-lg shadow-sm transition-all duration-200 w-full cursor-pointer relative ${
          isRead 
            ? "bg-white border-gray-200 hover:shadow-md" 
            : "bg-blue-50 border-blue-200 hover:shadow-lg hover:border-blue-300"
        } ${isMarking ? "cursor-wait opacity-70" : ""}`}
        onClick={handleOpenModal}
        aria-disabled={isMarking}
      >
        {/* Delete button positioned at top right corner */}
        {deleteNotification && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete notification"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}

        <div className="pr-6">
          <div className="flex items-start justify-between">
            <h3 className={`font-semibold text-base sm:text-lg ${
              isRead ? "text-gray-700" : "text-gray-900"
            }`}>
              {title}
            </h3>
          </div>
          
          <p className={`text-sm mt-1 line-clamp-2 ${
            isRead ? "text-gray-600" : "text-gray-800"
          }`}>
            {body}
          </p>
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(data.type)}`}>
              {data.type}
            </span>
            
            {data.priority && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(data.priority)}`}>
                {data.priority}
              </span>
            )}
            
            <span className="text-xs text-gray-500 ml-auto">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Delete Notification</h2>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete this notification? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md flex items-center justify-center gap-2 transition-colors ${
                deleting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={deleting}
            >
              {deleting && <Spinner />} Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Notification Details Modal with Zillow-inspired design */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="max-h-[80vh] overflow-y-auto px-2 sm:px-4">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(data.type)}`}>
                {data.type}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {data.priority && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(data.priority)}`}>
                  Priority: {data.priority}
                </span>
              )}
              <span className="text-sm text-gray-500">{formattedDate}</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 text-base leading-relaxed">{body}</p>
          </div>

        
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.for && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">For</span>
                  <span className="text-sm text-gray-800">{data.for}</span>
                </div>
              )}
              
              {data.action && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Action</span>
                  <span className="text-sm text-gray-800">{data.action}</span>
                </div>
              )}
              
              {data.propertyName && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Property</span>
                  <span className="text-sm text-gray-800">{data.propertyName}</span>
                </div>
              )}
              
              {getPropertyType() && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</span>
                  <span className="text-sm text-gray-800">{getPropertyType()}</span>
                </div>
              )}
              
              {getPropertyIdentifier() && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">ID</span>
                  <span className="text-sm text-gray-800">{getPropertyIdentifier()}</span>
                </div>
              )}
              
              {data.amount && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</span>
                  <span className="text-sm text-gray-800">{formatCurrency(data.amount)}</span>
                </div>
              )}
              
              {data.soldTo && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sold To</span>
                  <span className="text-sm text-gray-800">{data.soldTo}</span>
                </div>
              )}
              
              {data.agentId && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Agent</span>
                  <span className="text-sm text-gray-800">{getAgentName(data.agentId)}</span>
                </div>
              )}
              
              {data.transactionId && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Transaction ID</span>
                  <span className="text-sm text-gray-800">{data.transactionId}</span>
                </div>
              )}
              
              {data.timestamp && (
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Timestamp</span>
                  <span className="text-sm text-gray-800">{new Date(data.timestamp).toLocaleString()}</span>
                </div>
              )}
              
              {data.error && (
                <div className="col-span-full">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Error</span>
                  <span className="text-sm text-red-600 bg-red-50 p-2 rounded block">{data.error}</span>
                </div>
              )}
            </div>
            
            {/* Show only key-value pairs for unknown fields */}
            {Object.entries(data).map(([key, value]) => {
              const knownKeys = [
                "for",
                "type",
                "action",
                "priority",
                "timestamp",
                "propertyId",
                "propertyName",
                "subPropertyId",
                "amount",
                "soldTo",
                "agentId",
                "transactionId",
                "error",
              ];

              if (knownKeys.includes(key)) return null;

              if (value !== null && typeof value === "object" && Object.keys(value).length === 0)
                return null;

              return (
                <div key={key} className="flex flex-col mt-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{key}</span>
                  <span className="text-sm text-gray-800">{JSON.stringify(value)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}