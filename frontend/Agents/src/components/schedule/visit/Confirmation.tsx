import React from "react";
import { useRouter } from "next/router";
import BackHeader from "@/components/Custom/BackHeader";

interface ConfirmationProps {
  scheduleInfo: string | null;
  onBackToSchedule: () => void;
  onClose: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({
  scheduleInfo,
  onBackToSchedule,
  onClose
}) => {
  const router = useRouter();

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 md:py-8 md:mt-24 text-black bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <BackHeader text="Back to Schedule" />
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Visit Scheduled Successfully!</h2>
            <p className="mb-6 text-gray-600">Your property visit has been successfully scheduled. You will receive a confirmation shortly.</p>
            
            {scheduleInfo && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-300 text-left">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h3 className="font-bold text-yellow-800 text-lg mb-1">Important Information</h3>
                    <p className="text-yellow-700">{scheduleInfo}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button
                onClick={onBackToSchedule}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition text-center"
              >
                View My Schedule
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;