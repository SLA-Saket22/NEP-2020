export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Export options */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-4">
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Export PDF</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Export Excel</button>
        <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">Export CSV</button>
      </div>

      {/* Report Types */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Faculty-wise Timetable</h3>
          <p className="text-sm text-gray-600">Preview or download faculty timetables</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Program-wise Timetable</h3>
          <p className="text-sm text-gray-600">Preview or download program schedules</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Room-wise Timetable</h3>
          <p className="text-sm text-gray-600">Preview or download room allocations</p>
        </div>
      </div>
    </div>
  );
}
