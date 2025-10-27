import { useState, useMemo } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAgents } from "@/hooks/agent.hooks";
import { payForSubProperty } from "@/hooks/property.hooks";

interface PayForSubPropertyModalProps {
  propertyId: string;
  subPropertyId: string;
  isOpen: boolean;
  onClose: () => void;
}

const PayForSubPropertyModal: React.FC<PayForSubPropertyModalProps> = ({
  propertyId,
  subPropertyId,
  isOpen,
  onClose,
}) => {
  const { agents, loading: agentsLoading } = useAgents();
  const [payData, setPayData] = useState({
    aid: "",
    amount: "",
    soldTo: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter agents based on search term
  const filteredAgents = useMemo(() => {
    if (!searchTerm) return agents;
    return agents.filter(agent =>
      agent.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [agents, searchTerm]);

  const handleSubmit = async () => {
    if (!payData.aid || !payData.amount || !payData.soldTo) {
      toast.error("All fields are required.");
      return;
    }

    setIsSubmitting(true);

    const result = await payForSubProperty(Number(propertyId), Number(subPropertyId), {
      aid: payData.aid,
      amount: Number(payData.amount),
      soldTo: payData.soldTo,
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message || "Payment recorded for sub-property.");
      onClose();
    } else {
      toast.error(result.message || "Failed to process payment.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-4">Pay for Sub-Property</h2>

        <div className="space-y-4">
          {/* Agent Search */}
          <div>
            <label className="block font-medium mb-1">Select Agent</label>
            {agentsLoading ? (
              <p>Loading agents...</p>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded">
                  <select
                    value={payData.aid}
                    onChange={(e) => setPayData({ ...payData, aid: e.target.value })}
                    className="w-full p-2 rounded"
                    size={Math.min(filteredAgents.length, 5)}
                  >
                    <option value="">-- Choose Agent --</option>
                    {filteredAgents.map((agent) => (
                      <option key={agent.aid} value={agent.aid}>
                        {agent.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                {filteredAgents.length === 0 && searchTerm && (
                  <p className="text-gray-500 text-sm">No agents found</p>
                )}
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block font-medium mb-1">Amount</label>
            <input
              type="number"
              value={payData.amount}
              onChange={(e) => setPayData({ ...payData, amount: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          {/* Sold To */}
          <div>
            <label className="block font-medium mb-1">Sold To</label>
            <input
              type="text"
              value={payData.soldTo}
              onChange={(e) => setPayData({ ...payData, soldTo: e.target.value })}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayForSubPropertyModal;