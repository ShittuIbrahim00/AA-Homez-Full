import React from "react";

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

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule?: Schedule;
  formatISODate: (isoStr: string) => string;
}

const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  onClose,
  schedule,
  formatISODate,
}) => {
  if (!isOpen || !schedule) return null;

  // Check if we have a property or subproperty name
  const hasProperty = schedule.Property?.name;
  const hasSubProperty = schedule.SubProperty?.name;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 md:p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg sm:rounded-xl shadow-2xl border border-gray-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-1 sm:top-2 sm:right-2 md:top-4 md:right-4 text-gray-500 hover:text-gray-700 focus:outline-none text-lg sm:text-xl md:text-2xl"
          aria-label="Close details modal"
        >
          &times;
        </button>

        {/* Modal Content */}
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6 border-b pb-2 sm:pb-3">
            Schedule Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base text-gray-800">
            {/* Client Info */}
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                Client
              </h3>
              <p className="mb-1">
                <span className="font-semibold">Name:</span>{" "}
                {schedule.clientName}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {schedule.clientPhone}
              </p>
            </div>

            {/* Agent Info */}
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                Agent
              </h3>
              <p className="mb-1">
                <span className="font-semibold">Name:</span>{" "}
                {schedule.Agent?.fullName || "N/A"}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Phone:</span>{" "}
                {schedule.Agent?.phone || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Rank:</span>{" "}
                {schedule.Agent?.rank || "N/A"}
              </p>
            </div>

            {/* Property Info - only show if property exists */}
            {hasProperty && (
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  Property
                </h3>
                <p className="mb-1">
                  <span className="font-semibold">Name:</span>{" "}
                  {schedule.Property?.name || "N/A"}
                </p>
                {schedule.Property?.mapLink && (
                  <a
                    href={schedule.Property.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline text-xs sm:text-sm"
                  >
                    View Property Map
                  </a>
                )}
              </div>
            )}

            {/* Sub Property Info - only show if subproperty exists */}
            {hasSubProperty && (
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  Sub Property
                </h3>
                <p className="mb-1">
                  <span className="font-semibold">Name:</span>{" "}
                  {schedule.SubProperty?.name || "N/A"}
                </p>
                {schedule.SubProperty?.mapLink && (
                  <a
                    href={schedule.SubProperty.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline text-xs sm:text-sm"
                  >
                    View Sub-Property Map
                  </a>
                )}
              </div>
            )}

            {/* If neither property nor subproperty exists, show a single section */}
            {!hasProperty && !hasSubProperty && (
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  Property
                </h3>
                <p>
                  <span className="font-semibold">Name:</span> N/A
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="my-3 sm:my-4 md:my-6 border-t" />

          {/* Schedule Info */}
          <div className="space-y-2 text-xs sm:text-sm md:text-base text-gray-800">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Schedule Info
            </h3>
            <p>
              <span className="font-semibold">Title:</span>{" "}
              {schedule.title}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(schedule.date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Time:</span>{" "}
              {schedule.time}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {schedule.status}
            </p>
            <p>
              <span className="font-semibold">Created At:</span>{" "}
              {formatISODate(schedule.createdAt)}
            </p>
            <p>
              <span className="font-semibold">Updated At:</span>{" "}
              {formatISODate(schedule.updatedAt)}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-4 sm:mt-6 md:mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 rounded-md bg-gray-100 hover:bg-orange-600 hover:text-white text-gray-700 font-medium border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 text-xs sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;