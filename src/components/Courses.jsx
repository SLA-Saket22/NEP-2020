import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

// Sample faculty expertise
const facultyList = ["Dr. Sharma", "Prof. Gupta", "Dr. Ramesh", "Saket", "Prof. Anita"];

// Sample programs
const programs = ["B.Sc. CS", "B.A. English", "B.Com", "M.Sc. Physics"];

// Initial sample courses
const initialCourses = [
  {
    code: "CS101",
    title: "Intro to Programming",
    credits: 4,
    type: "Theory",
    program: "B.Sc. CS",
    faculty: ["Dr. Sharma"],
  },
  {
    code: "ENG201",
    title: "English Literature",
    credits: 3,
    type: "Theory",
    program: "B.A. English",
    faculty: ["Prof. Gupta", "Prof. Anita"],
  },
];

export default function Courses() {
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const [filterProgram, setFilterProgram] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    credits: "",
    type: "Theory",
    program: "",
    faculty: [],
  });

  // Filter logic
  const filteredCourses = courses.filter(
    (c) =>
      (c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())) &&
      (filterProgram === "" || c.program === filterProgram)
  );

  // Handle faculty selection (multi-select)
  const toggleFaculty = (name) => {
    setFormData((prev) => ({
      ...prev,
      faculty: prev.faculty.includes(name)
        ? prev.faculty.filter((f) => f !== name)
        : [...prev.faculty, name],
    }));
  };

  // Save new/edit course
  const handleSave = () => {
    setCourses((prev) => [...prev, formData]);
    setIsOpen(false);
    setFormData({
      code: "",
      title: "",
      credits: "",
      type: "Theory",
      program: "",
      faculty: [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Search + Filter + Add */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search by code or title..."
          className="border rounded-lg px-3 py-2 flex-1 max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterProgram}
          onChange={(e) => setFilterProgram(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Programs</option>
          {programs.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          + Add Course
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="p-3">Code</th>
              <th className="p-3">Title</th>
              <th className="p-3">Credits</th>
              <th className="p-3">Type</th>
              <th className="p-3">Program</th>
              <th className="p-3">Assigned Faculty</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((c, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="p-3">{c.code}</td>
                <td className="p-3">{c.title}</td>
                <td className="p-3">{c.credits}</td>
                <td className="p-3">{c.type}</td>
                <td className="p-3">{c.program}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {c.faculty.map((f) => (
                      <span
                        key={f}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add Course</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Course Code"
                className="border rounded-lg px-3 py-2 w-full"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Course Title"
                className="border rounded-lg px-3 py-2 w-full"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Credits"
                className="border rounded-lg px-3 py-2 w-full"
                value={formData.credits}
                onChange={(e) =>
                  setFormData({ ...formData, credits: e.target.value })
                }
              />

              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full"
              >
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
              </select>

              <select
                value={formData.program}
                onChange={(e) =>
                  setFormData({ ...formData, program: e.target.value })
                }
                className="border rounded-lg px-3 py-2 w-full"
              >
                <option value="">Select Program</option>
                {programs.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {/* Faculty Multi-select */}
              <div>
                <p className="text-sm font-medium mb-2">Assign Faculty</p>
                <div className="flex flex-wrap gap-2">
                  {facultyList.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFaculty(f)}
                      className={`px-3 py-1 rounded-lg border ${
                        formData.faculty.includes(f)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="mt-6 text-right">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700"
              >
                Save Course
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
