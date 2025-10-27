import React, { useEffect, useRef } from 'react';

interface ActionDropdownProps {
  schedule: any;
  onView: (schedule: any) => void;
  onApprove: (id: number) => void;
  onDecline: (id: number) => void;
  onReschedule: (id: number) => void;
  onClose: () => void;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  schedule,
  onView,
  onApprove,
  onDecline,
  onReschedule,
  onClose,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Close dropdown on Escape key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView(schedule);
    onClose();
  };

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApprove(schedule.scid);
    onClose();
  };

  const handleDecline = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDecline(schedule.scid);
    onClose();
  };

  const handleReschedule = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReschedule(schedule.scid);
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="options-menu"
    >
      <button
        onClick={handleView}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        role="menuitem"
      >
        View Details
      </button>

      {schedule.status.toLowerCase() === "pending" && (
        <>
          <button
            onClick={handleApprove}
            className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
            role="menuitem"
          >
            Approve
          </button>
          <button
            onClick={handleDecline}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            role="menuitem"
          >
            Decline
          </button>
          <button
            onClick={handleReschedule}
            className="block w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-gray-100"
            role="menuitem"
          >
            Reschedule
          </button>
        </>
      )}
    </div>
  );
};

export default ActionDropdown;