import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Courses from "./components/Courses";
import Faculty from "./components/Faculty";
import Rooms from "./components/Rooms";
import Generator from "./components/Generator";
import Conflicts from "./components/Conflicts";
import Reports from "./components/Reports";
import Students from "./components/Students";

export default function App() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [role] = useState("Admin"); // Admin / Faculty / Student

  // Switch view based on sidebar selection
  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return <Dashboard />;
      case "Students":
        return <Students />;
      case "Programs & Courses":
        return <Courses/>;
      case "Faculty":
        return <Faculty/>;
      case "Rooms & Labs":
        return <Rooms/>;
      case "Timetable Generator":
        return <Generator/>;
      case "Conflicts & Reports":
        return <Conflicts/>;
      case "Export & Settings":
        return <Reports/>;
      default:
        return alert("Choose proper option");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header role={role} />

      <div className="flex flex-1 pt-16">
        {/* Sidebar only for Admin */}
        {role === "Admin" && (
          <Sidebar active={activeSection} setActive={setActiveSection} />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">{activeSection}</h2>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
