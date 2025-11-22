import { useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const periods = [1, 2, 3, 4, 5, 6];

export default function Generator() {
  const [program, setProgram] = useState("B.Sc. CS");

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 items-center">
        <select
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option>B.Sc. CS</option>
          <option>B.A. English</option>
          <option>B.Com</option>
        </select>
        <select className="border rounded-lg px-3 py-2">
          <option>Semester 1</option>
          <option>Semester 2</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
          Generate (AI/ML)
        </button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow">
          Manual Edit
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow">
          Export
        </button>
      </div>

      {/* Timetable Grid */}
      <div className="overflow-x-auto">
        <table className="border text-sm w-full bg-white rounded-xl shadow">
          <thead>
            <tr>
              <th className="border p-2">Day</th>
              {periods.map((p) => (
                <th key={p} className="border p-2">P{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d}>
                <td className="border p-2 font-medium">{d}</td>
                {periods.map((p) => (
                  <td key={p} className="border p-2 text-xs text-center bg-blue-50">
                    CS101 <br /> (Dr. Sharma) <br /> R101
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
