import React from "react";
import { FaUser, FaPhone } from "react-icons/fa";

interface ClientInfoFormProps {
  clientName: string;
  clientPhone: string;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ClientInfoForm: React.FC<ClientInfoFormProps> = ({
  clientName,
  clientPhone,
  loading,
  onChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label
          htmlFor="clientName"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          <div className="flex items-center">
            <FaUser className="mr-2 text-orange-500" />
            Client Name
          </div>
        </label>
        <input
          type="text"
          id="clientName"
          name="clientName"
          placeholder="Enter your full name"
          className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          onChange={onChange}
          value={clientName}
          required
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="clientPhone"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          <div className="flex items-center">
            <FaPhone className="mr-2 text-orange-500" />
            Phone Number
          </div>
        </label>
        <input
          type="tel"
          id="clientPhone"
          name="clientPhone"
          placeholder="Enter your phone number"
          className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          onChange={onChange}
          value={clientPhone}
          required
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default ClientInfoForm;