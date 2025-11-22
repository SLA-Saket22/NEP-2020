import { useState } from "react";
import * as XLSX from "xlsx"; // install with: npm install xlsx
import { handleError, handleSuccess } from "../utilies/utilies";
import { ToastContainer } from "react-toastify";
import axios from "axios";

const initialFaculty = [
  {
    empId: "F001",
    name: "Dr. Sharma",
    expertiseMajor: "AI",
    expertiseMinor: "ML",
    phone: "9876543210",
    timetable: {
      Mon: { 1: true, 2: false },
      Tue: { 1: true, 3: true },
    },
  },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const periods = [1, 2, 3, 4, 5, 6];

export default function Faculty() {
  const [facultyList, setFacultyList] = useState(initialFaculty);
  const [selected, setSelected] = useState(initialFaculty[0]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [previewData, setPreviewData] = useState([]); // ⬅️ Holds unconfirmed imported data
  const [showPreview, setShowPreview] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    empId: "",
    name: "",
    expertiseMajor: "",
    expertiseMinor: "",
    phone: "",
  });
  const [dragActive, setDragActive] = useState(false);

  let successList = [];
  let errorList = [];

  const facultyGet = async () => {
    try {
      const res = await axios.get("http://localhost:3002/faculty");
      setFacultyList(res.data);
      console.log(res.data);
      handleSuccess("Successfully Updated");
    } catch (error) {
      console.error("Error fetching students:", err);
    }
  };

  const facultyPost = async () => {
    for (const fac of previewData) {
      try {
        const { data } = await axios.post("http://localhost:3002/faculty", {
          empId: fac.empId,
          name: fac.name,
          expertiseMajor: fac.expertiseMajor,
          expertiseMinor: fac.expertiseMinor,
          phone: fac.phone,
        });

        const { success, message } = data;

        if (success) {
          successList.push(fac.name);
        } else {
          errorList.push(`${fac.name}: ${message}`);
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unknown error";

        errorList.push(`${fac.name}: ${msg}`);

        console.error(`❌ Error importing ${fac.name}:`, msg);
      }
    }
    if (successList.length > 0) {
      handleSuccess(`✅ Imported ${successList.length} `);
      console.log(successList);
    }
    if (errorList.length > 0) {
      errorList.forEach((msg) => handleError(`⚠️ ${msg}`));
    }
  };

  const filteredFaculty = facultyList.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  
  );

  // ✅ Manual Add
  const handleAddFaculty = async (e) => {
    e.preventDefault();
    const { empId, name, expertiseMajor, expertiseMinor, phone } = newFaculty;
    if (!empId || !name || !expertiseMajor || !expertiseMinor || !phone)
      return handleError("Please fill all fields!");

    try {
      const { data } = await axios.post("http://localhost:3002/faculty", {
        empId,
        name,
        expertiseMajor,
        expertiseMinor,
        phone,
      });

      if (data.success) {
        handleSuccess("Faculty added successfully!");
        setNewFaculty({
          empId: "",
          name: "",
          expertiseMajor: "",
          expertiseMinor: "",
          phone: "",
        });
        setShowForm(false);
        await facultyGet(); // ✅ Refresh from backend
      } else handleError(data.message || "Error adding faculty");
    } catch (err) {
      handleError("Server error while adding faculty");
    }
  };

  // ✅ Handle Excel/CSV Upload
  const handleFileUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const imported = rows.map((r) => ({
        empId: r["Employee ID"] || "",
        name: r["Name"] || "",
        expertiseMajor: r["Expertise Major"] || "",
        expertiseMinor: r["Expertise Minor"] || "",
        phone: r["Phone"] || "",
        timetable: {},
      }));

      setPreviewData(imported);
      setShowPreview(true);

      // ✅ Reset file input (important)
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    };

    reader.readAsArrayBuffer(file);
  };

  // ✅ Confirm Import
  const handleConfirmImport = async () => {
  await facultyPost(); // ✅ wait for completion
  await facultyGet();  // ✅ refresh from backend instead of local preview
  setPreviewData([]);
  setShowPreview(false);
};
  

  const handleCancelImport = () => {
    setPreviewData([]);
    setShowPreview(false);
  };

  // ✅ Drag Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const togglePeriod = async (day, period) => {
    const updatedList = facultyList.map((f) => {
      if (f.empId === selected.empId) {
        const newTable = { ...f.timetable };
        newTable[day] = newTable[day] || {};
        newTable[day][period] = !newTable[day][period];
        return { ...f, timetable: newTable };
      }
      return f;
    });

    setFacultyList(updatedList);
    const updatedFaculty = updatedList.find((f) => f.empId === selected.empId);
    setSelected(updatedFaculty);

    try {
      await axios.put(`http://localhost:3002/faculty/${updatedFaculty.empId}`, {
        timetable: updatedFaculty.timetable,
      });
    } catch (err) {
      handleError("Failed to update timetable");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Section */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <input
            type="text"
            placeholder="Search faculty..."
            className="w-2/3 p-2 border rounded-lg text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            + Add
          </button>
        </div>

        {/* Add Faculty Form */}
        {showForm && (
          <form
            onSubmit={handleAddFaculty}
            className="border p-3 rounded-lg bg-gray-50 mb-3 space-y-2"
          >
            {["empId", "name", "expertiseMajor", "expertiseMinor", "phone"].map(
              (field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={
                    field === "empId"
                      ? "Employee ID"
                      : field
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())
                  }
                  className="w-full p-2 border rounded text-sm"
                  value={newFaculty[field]}
                  onChange={(e) =>
                    setNewFaculty({ ...newFaculty, [field]: e.target.value })
                  }
                />
              )
            )}
            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-1 rounded w-full"
            >
              Add Faculty
            </button>

            {/* Drag-Drop Upload */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`mt-3 border-2 border-dashed rounded-lg p-4 text-center text-sm ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
            >
              <p className="text-gray-600">
                Drag & drop Excel/CSV file here, or{" "}
                <label className="text-blue-600 cursor-pointer font-semibold">
                  browse
                  <input
                    type="file"
                    accept=".xlsx, .csv"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                  />
                </label>
              </p>
            </div>
          </form>
        )}

        {/* Faculty List */}
        {filteredFaculty.map((f) => (
          <div
            key={f.empId}
            onClick={() => setSelected(f)}
            className={`p-4 rounded-xl shadow cursor-pointer transition h-80 overflow-y-auto" ${
              selected.empId === f.empId
                ? "bg-blue-50 border border-blue-400"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <h3 className="font-semibold">{f.name}</h3>
            <p className="text-xs text-gray-500">
              {f.expertiseMajor} / {f.expertiseMinor}
              
            </p>
            <p className="text-xs text-gray-400">{f.phone}</p>
          </div>
        ))}
      </div>

      {/* Faculty Details */}
      {selected && (
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-2">
            {selected.name} ({selected.empId})
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Major: {selected.expertiseMajor} | Minor: {selected.expertiseMinor}
          </p>
          <p className="text-sm text-gray-600 mb-4">Phone: {selected.phone}</p>

          <h3 className="font-semibold mb-2">Timetable</h3>
          <table className="border w-full text-center text-sm">
            <thead>
              <tr>
                <th className="border p-2">Day</th>
                {periods.map((p) => (
                  <th key={p} className="border p-2">
                    P{p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((d) => (
                <tr key={d}>
                  <td className="border p-2 font-medium">{d}</td>
                  {periods.map((p) => (
                    <td key={p} className="border p-2">
                      <input
                        type="checkbox"
                        checked={!!selected.timetable?.[d]?.[p]}
                        onChange={() => togglePeriod(d, p)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold mb-4">
              Preview Imported Faculty
            </h2>
            <table className="border w-full text-center text-sm mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Emp ID</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Major</th>
                  <th className="border p-2">Minor</th>
                  <th className="border p-2">Phone</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((f, i) => (
                  <tr key={i}>
                    <td className="border p-2">{f.empId}</td>
                    <td className="border p-2">{f.name}</td>
                    <td className="border p-2">{f.expertiseMajor}</td>
                    <td className="border p-2">{f.expertiseMinor}</td>
                    <td className="border p-2">{f.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelImport}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Confirm Import
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
