import React, { useState, useEffect } from "react";
import { Notification } from "@/types/notification";
import Modal from "../notifications/Modal";
import Spinner from "./Spinner";

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

  const formattedDate = new Date(createdAt).toLocaleString();

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

  return (
    <>
      <div
        className={`p-4 border rounded-lg shadow-sm hover:shadow-md transition w-full cursor-pointer relative ${
          isRead 
            ? "bg-white border-gray-200" 
            : "bg-blue-50 border-blue-200 border-l-4 border-l-blue-500"
        } ${isMarking ? "cursor-wait" : ""}`}
        onClick={handleOpenModal}
        aria-disabled={isMarking}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {!isRead && (
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
              )}
              <h3 className={`font-semibold text-base sm:text-lg ${
                isRead ? "text-gray-700" : "text-gray-900"
              }`}>
                {title}
              </h3>
            </div>
            <p className="text-gray-700 text-sm mt-1 line-clamp-2 sm:line-clamp-1">
              {body}
            </p>
            <p className="text-xs text-gray-500 mt-2">{formattedDate}</p>
          </div>
          
          <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
            isRead 
              ? "bg-gray-100 text-gray-600" 
              : "bg-blue-100 text-blue-800"
          }`}>
            {isRead ? "Read" : "Unread"}
          </div>
        </div>
        
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
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Delete Notification</h2>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete this notification? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded flex items-center justify-center gap-2 ${
                deleting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={deleting}
            >
              {deleting && <Spinner className="h-4 w-4" />} Delete
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="max-h-[80vh] overflow-y-auto px-2 sm:px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isRead 
                ? "bg-gray-100 text-gray-600" 
                : "bg-blue-100 text-blue-800"
            }`}>
              {isRead ? "Read" : "Unread"}
            </span>
          </div>
          <p className="mb-4 text-gray-700 text-sm">{body}</p>
          <div className="border-t pt-4 text-sm space-y-2">
            <h3 className="font-semibold mb-2 text-gray-800">Details:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {data.priority && (
                <li>
                  <strong>Priority:</strong>{" "}
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      data.priority === "high"
                        ? "bg-red-200 text-red-800"
                        : data.priority === "medium"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {data.priority.charAt(0).toUpperCase() + data.priority.slice(1)}
                  </span>
                </li>
              )}
              {data.timestamp && (
                <li>
                  <strong>Date:</strong>{" "}
                  {new Date(data.timestamp).toLocaleString()}
                </li>
              )}
              {data.propertyName && (
                <li>
                  <strong>Property:</strong> {data.propertyName}
                </li>
              )}
              {data.propertyId && (
                <li>
                  <strong>Property ID:</strong> {data.propertyId}
                </li>
              )}
              {data.amount && (
                <li>
                  <strong>Amount:</strong> ₦{data.amount.toLocaleString()}
                </li>
              )}
              {data.transactionId && (
                <li>
                  <strong>Transaction ID:</strong> {data.transactionId}
                </li>
              )}
              {data.action && (
                <li>
                  <strong>Action:</strong> {data.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </li>
              )}
              {data.type && (
                <li>
                  <strong>Category:</strong> {data.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </li>
              )}

              {Object.entries(data).map(([key, value]) => {
                const agentRelevantKeys = [
                  "type",
                  "action",
                  "priority",
                  "timestamp",
                  "propertyName",
                  "amount",
                  "clientName",
                  "date",
                  "time"
                ];

                if (!agentRelevantKeys.includes(key) || value === undefined || value === null) {
                  return null;
                }

                const handledKeys = [
                  "priority", "timestamp", "propertyName", 
                  "amount", "action", "type"
                ];
                
                if (handledKeys.includes(key)) {
                  return null;
                }

                const formattedKey = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase());

                let displayValue = value;
                if (typeof value === "object") {
                  displayValue = JSON.stringify(value, null, 2);
                }

                if (key === "date" && typeof value === "string") {
                  displayValue = new Date(value).toLocaleDateString();
                }

                return (
                  <li key={key}>
                    <strong>{formattedKey}:</strong> {displayValue}
                  </li>
                );
              })}

            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
}