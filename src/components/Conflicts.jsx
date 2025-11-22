const conflicts = [
  { type: "Faculty Clash", detail: "Dr. Sharma double-booked at Mon P2" },
  { type: "Room Double-booking", detail: "R101 booked by CS101 and ENG201" },
  { type: "Unplaced Course", detail: "ENG305 has no slot" },
];

export default function Conflicts() {
  return (
    <div className="space-y-4">
      {conflicts.map((c, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold">{c.type}</h3>
          <p className="text-sm text-gray-600">{c.detail}</p>
          <div className="mt-2 flex gap-2">
            <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
              Suggest Fix
            </button>
            <button className="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm">
              Manual Override
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
