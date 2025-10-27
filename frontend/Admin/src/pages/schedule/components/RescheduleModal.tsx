export default function RescheduleModal({ onClose, onSubmit, date, time, setDate, setTime }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>
        <label className="block mb-2">New Date</label>
        <input
          type="date"
          className="border p-2 rounded w-full mb-4"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <label className="block mb-2">New Time</label>
        <input
          type="time"
          className="border p-2 rounded w-full mb-4"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={onSubmit} className="px-4 py-2 bg-yellow-500 text-white rounded">Submit</button>
        </div>
      </div>
    </div>
  );
}
