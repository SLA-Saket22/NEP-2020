const menuItems = [
  "Dashboard",
  "Students",
  "Programs & Courses",
  "Faculty",
  "Rooms & Labs",
  "Timetable Generator",
  "Conflicts & Reports",
  "Export & Settings",
];

export default function Sidebar({ active, setActive }) {
  return (
    <aside className="w-64 bg-white shadow-md h-full p-4 hidden md:block">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`w-full text-left px-4 py-2 rounded-xl transition ${
              active === item
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
