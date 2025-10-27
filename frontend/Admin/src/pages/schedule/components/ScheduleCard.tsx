import Image from "next/image";

export default function ScheduleCard({
  schedule,
  onApprove,
  onDecline,
  onReschedule,
}: {
  schedule: any;
  onApprove: (id: number) => void;
  onDecline: (id: number) => void;
  onReschedule: (id: number) => void;
}) {
  const statusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Declined": return "bg-red-100 text-red-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
      <div className="relative w-full h-48">
        <Image src={schedule.propertyImage} alt={schedule.property} fill className="object-cover" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Image src={schedule.agentAvatar} alt={schedule.agentName} width={40} height={40} className="rounded-full" />
          <h2 className="text-lg font-semibold text-gray-900">{schedule.agentName}</h2>
        </div>
        <p className="text-gray-600">{schedule.property} - {schedule.subProperty}</p>
        <p className="mt-2 text-sm text-gray-600"><strong>Requested:</strong> {schedule.requestedDate} at {schedule.requestedTime}</p>
        <p className="text-sm text-gray-600"><strong>Details:</strong> {schedule.details}</p>
        <span className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium ${statusColor(schedule.status)}`}>
          {schedule.status}
        </span>

        {schedule.status === "Pending" && (
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button onClick={() => onApprove(schedule.id)} className="bg-green-600 text-white px-3 py-2 rounded text-sm">Approve</button>
            <button onClick={() => onDecline(schedule.id)} className="bg-red-600 text-white px-3 py-2 rounded text-sm">Decline</button>
            <button onClick={() => onReschedule(schedule.id)} className="bg-yellow-500 text-white px-3 py-2 rounded text-sm">Reschedule</button>
          </div>
        )}
      </div>
    </div>
  );
}
