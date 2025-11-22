const rooms = [
  { id: "R101", name: "Classroom 1", capacity: 40, type: "Classroom" },
  { id: "Lab1", name: "Computer Lab", capacity: 25, type: "Lab" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const periods = [1, 2, 3, 4, 5, 6];

export default function Rooms() {
  return (
    <div className="space-y-6">
      <table className="w-full border bg-white rounded-xl shadow text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Room ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Capacity</th>
            <th className="p-2 border">Type</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2 border">{r.id}</td>
              <td className="p-2 border">{r.name}</td>
              <td className="p-2 border">{r.capacity}</td>
              <td className="p-2 border">{r.type}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <h3 className="font-semibold mb-3">Usage Heatmap</h3>
        <table className="border text-center text-xs">
          <thead>
            <tr>
              <th className="border p-1">Day</th>
              {periods.map((p) => (
                <th key={p} className="border p-1">P{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d}>
                <td className="border p-1 font-medium">{d}</td>
                {periods.map((p) => (
                  <td
                    key={p}
                    className={`border p-2 ${
                      Math.random() > 0.6 ? "bg-red-400" : "bg-green-200"
                    }`}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
