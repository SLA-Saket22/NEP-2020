import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const overview = [
  { title: "Total Programs", value: 12 },
  { title: "Total Courses", value: 48 },
  { title: "Faculty Count", value: 25 },
  { title: "Rooms/Labs Count", value: 15 },
];

const facultyWorkload = [
  { name: "Light", value: 8 },
  { name: "Moderate", value: 12 },
  { name: "Heavy", value: 5 },
];

const roomUtilization = [
  { name: "Mon", utilization: 80 },
  { name: "Tue", utilization: 65 },
  { name: "Wed", utilization: 90 },
  { name: "Thu", utilization: 70 },
  { name: "Fri", utilization: 85 },
];

const COLORS = ["#60a5fa", "#34d399", "#fbbf24"];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {overview.map((item) => (
          <div
            key={item.title}
            className="bg-white p-6 rounded-2xl shadow text-center"
          >
            <h3 className="text-gray-500 text-sm">{item.title}</h3>
            <p className="text-2xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">
            Faculty Workload Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={facultyWorkload}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {facultyWorkload.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">Room Utilization</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roomUtilization}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="utilization" fill="#60a5fa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl shadow flex gap-4 flex-wrap">
        <button className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700">
          Generate Timetable
        </button>
        <button className="bg-green-500 text-white px-5 py-2 rounded-xl shadow hover:bg-green-600">
          Upload Course Data
        </button>
      </div>
    </div>
  );
}
