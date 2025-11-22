import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Header({ role }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-blue-600 text-white flex items-center justify-between px-6 shadow z-50">
      {/* Logo + Title */}
      <div className="flex items-center gap-3 font-bold text-lg">
        <img
          src="https://img.icons8.com/ios-filled/50/ffffff/calendar.png"
          alt="logo"
          className="w-6 h-6"
        />
        NEP Timetable Generator
      </div>

      {/* Role + Profile */}
      <div className="flex items-center gap-6">
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
          {role}
        </span>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <span>Profile</span>
            <ChevronDown size={18} />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-xl shadow-lg">
              <ul className="text-sm">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Settings
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
