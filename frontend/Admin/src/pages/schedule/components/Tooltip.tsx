export default function Tooltip({ hoveredEvent, position }) {
  const statusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Declined": return "bg-red-100 text-red-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "";
    }
  };

  return (
    <div
      className="absolute bg-white border rounded shadow-lg p-3 w-64 z-50"
      style={{ top: position.y, left: position.x }}
    >
      <h3 className="font-semibold mb-1">{hoveredEvent.agentName}</h3>
      <p className="text-sm"><strong>Property:</strong> {hoveredEvent.property} - {hoveredEvent.subProperty}</p>
      <p className="text-sm"><strong>Date & Time:</strong> {hoveredEvent.requestedDate} at {hoveredEvent.requestedTime}</p>
      <p className="text-sm"><strong>Status:</strong> <span className={`${statusColor(hoveredEvent.status)} px-2 py-1 rounded`}>{hoveredEvent.status}</span></p>
      <p className="text-sm"><strong>Details:</strong> {hoveredEvent.details}</p>
    </div>
  );
}
