import React, { useRef, useEffect } from "react";
import { FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaUser } from "react-icons/fa";
import Link from "next/link";
import moment from "moment";
import { createPortal } from "react-dom";

interface Schedule {
  scid: number;
  uid: number;
  aid: number;
  sid: number | null;
  pid: number | null;
  clientName: string;
  clientPhone: string;
  title: string;
  date: string;
  time: string;
  start: string;
  end: string;
  status: string;
  type: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  Agent?: { fullName?: string; phone?: string; rank?: string; avatar?: string };
  Property?: { name?: string; image?: string; mapLink?: string };
  SubProperty?: { name?: string; mapLink?: string };
}

interface ScheduleDetailsModalProps {
  open: boolean;
  schedule?: Schedule;
  onClose: () => void;
}

const statusColor = (status: any) => {
  // Ensure status is a string before calling toLowerCase
  const statusString = typeof status === 'string' ? status : '';
  switch (statusString.toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "declined":
      return "bg-red-100 text-red-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "";
  }
};

const ScheduleDetailsModal = ({ open, schedule, onClose }: ScheduleDetailsModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open || !schedule) return null;

  const modalContent = (
    // Portal approach - attach to body to cover entire viewport
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Background overlay - covers entire viewport */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      
      {/* Modal container - centered both vertically and horizontally with padding for small screens */}
      <div className="absolute inset-0 flex items-center justify-center p-0 sm:p-4 overflow-y-auto text-black">
        <div 
          ref={modalRef}
          className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-screen sm:max-h-[90vh] my-0 sm:my-8 mx-0 sm:mx-4"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
            aria-label="Close details modal"
          >
            <FaTimes className="w-6 h-6" />
          </button>

          {/* Modal Header */}
          <div className="border-b p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Schedule Details
            </h2>
          </div>

          {/* Modal Content - Scrollable Area */}
          <div className="overflow-y-auto flex-1 p-4 sm:p-6">
            <div className="space-y-6">
              {/* Client Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FaUser className="mr-2 text-orange-600" />
                  Client Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{schedule.clientName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium">{schedule.clientPhone || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-orange-600" />
                  Property Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{schedule.Property?.name || "N/A"}</p>
                  </div>
                  {schedule.pid && (
                    <div>
                      <p className="text-gray-600">Actions</p>
                      <Link href={`/properties/${schedule.pid}`} className="text-orange-600 hover:text-orange-800 font-medium inline-flex items-center mt-1">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                        View Property
                      </Link>
                    </div>
                  )}
                  {schedule.Property?.mapLink && (
                    <div className="md:col-span-2">
                      <a
                        href={schedule.Property.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:underline inline-flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                        </svg>
                        View Property Map
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Sub Property Info - Only show if there is a sub property */}
              {schedule.SubProperty?.name && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-orange-600" />
                    Sub-Property Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium">{schedule.SubProperty.name || "N/A"}</p>
                    </div>
                    {schedule.sid && schedule.pid && (
                      <div>
                        <p className="text-gray-600">Actions</p>
                        <Link href={`/properties/${schedule.pid}/sub/${schedule.sid}`} className="text-orange-600 hover:text-orange-800 font-medium inline-flex items-center mt-1">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                          </svg>
                          View Sub-Property
                        </Link>
                      </div>
                    )}
                    {schedule.SubProperty.mapLink && (
                      <div className="md:col-span-2">
                        <a
                          href={schedule.SubProperty.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:underline inline-flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                          </svg>
                          View Sub-Property Map
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Schedule Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FaCalendarAlt className="mr-2 text-orange-600" />
                  Schedule Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Title</p>
                    <p className="font-medium">{schedule.title || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium">{moment(schedule.date).format("MMMM D, YYYY") || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Time</p>
                    <p className="font-medium">
                      {/^\d+$/.test(schedule.time) 
                        ? (() => {
                            const minutes = parseInt(schedule.time, 10);
                            const hours = Math.floor(minutes / 60);
                            const mins = minutes % 60;
                            return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
                          })()
                        : schedule.time || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor(schedule.status)}`}>
                      {schedule.status || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t p-4 sm:p-6">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal at the document root using portal to ensure it covers everything
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
};

export default ScheduleDetailsModal;