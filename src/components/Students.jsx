// src/pages/Students.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utilies/utilies";

// --- Sample student dataset ---
const sampleStudents = [
  {
    id: "STU_001",
    name: "Amit Sharma",
    program: "FYUP",
    batchYear: "2024",
    universityRoll: "U001245",
    phone: "9876543210",
  },
  {
    id: "STU_002",
    name: "Riya Patel",
    program: "B.Ed.",
    batchYear: "2023",
    universityRoll: "U001567",
    phone: "9123456789",
  },
];

export default function Students() {
  const [students, setStudents] = useState(sampleStudents);
  const [previewData, setPreviewData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("All");
  const [isImporting, setIsImporting] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Drag and drop setup ---
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Convert Excel rows → preview format
      const parsedStudents = jsonData.map((row, idx) => ({
        student_id: row["id"] || row["Student ID"] || `TEMP_${idx + 1}`,
        name: row["name"] || row["Name"] || "Unnamed",
        program: row["program"] || row["Program"] || "FYUP",
        batch_year: row["Batch Year"] || row["batchYear"] || "2024",
        university_roll: row["University Roll"] || row["universityRoll"] || "NA",
        phone: row["Phone"] || row["phone"] || "0000000000",
        minor: row["Minor"],
      }));

      setPreviewData(parsedStudents);
      setShowPreview(true);
    };

    reader.readAsArrayBuffer(file);
  };

  //--- to get data from server ---

  const serverGetData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3002/students");
      setStudents(res.data);
      handleSuccess("Successfully Updated");
    } catch (error) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 2️⃣ Fetch once when component mounts
  useEffect(() => {
    serverGetData();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // --- Confirm Import ---

  const handleConfirmImport = async (e) => {
    e.preventDefault();

    if (isImporting) return; // prevent double clicks
    setIsImporting(true);

    let successList = [];
    let errorList = [];

    for (const stu of previewData) {
      try {
        const { data } = await axios.post("http://localhost:3002/students", {
          student_id: stu.id,
          name: stu.name,
          program: stu.program,
          batch_year: stu.batchYear,
          university_roll: stu.universityRoll,
          phone: stu.phone,
          minor: stu.minor,
        });

        const { success, message } = data;

        if (success) {
          successList.push(stu.name);
        } else {
          errorList.push(`${stu.name}: ${message}`);
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Unknown error";

        errorList.push(`${stu.name}: ${msg}`);

        console.error(`❌ Error importing ${stu.name}:`, msg);
      }
    }

    // ✅ Show success combined message
    if (successList.length > 0) {
      handleSuccess(`✅ Imported ${successList.length} `);
    }

    // ❌ Show each error separately
    if (errorList.length > 0) {
      errorList.forEach((msg) => handleError(`⚠️ ${msg}`));
    }

    // Reset preview UI
    setShowPreview(false);
    setPreviewData([]);
    serverGetData();

    if (loading) {
      handleSuccess("Updating the record");
    }
  };

  const handleCancelImport = () => {
    setPreviewData([]);
    setShowPreview(false);
  };

  // --- Filter + search logic ---
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.student_id.toLowerCase().includes(search.toLowerCase());
    const matchesProgram =
      programFilter === "All" || s.program === programFilter;
    return matchesSearch && matchesProgram;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Students</h1>

      {/* Upload box */}
      {!showPreview && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center cursor-pointer ${
            isDragActive ? "bg-blue-50 border-blue-400" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-600">Drop the file here ...</p>
          ) : (
            <p className="text-gray-600">
              Drag & drop an Excel/CSV file here, or click to upload
            </p>
          )}
        </div>
      )}

      {/* Preview Table before import */}
      {showPreview && (
        <div className="border rounded-lg shadow mb-6 p-4 bg-white h-80 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">Preview Import Data</h2>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Program</th>
                <th className="p-2 border">Batch Year</th>
                <th className="p-2 border">University Roll</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Minor</th>
              </tr>
            </thead>
            <tbody>
              {previewData.map((s, idx) => (
                <tr key={idx} className="hover:bg-blue-50">
                  <td className="p-2 border">{s.id}</td>
                  <td className="p-2 border">{s.name}</td>
                  <td className="p-2 border">{s.program}</td>
                  <td className="p-2 border">{s.batchYear}</td>
                  <td className="p-2 border">{s.universityRoll}</td>
                  <td className="p-2 border">{s.phone}</td>
                  <td className="p-2 border">{s.minor}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={handleCancelImport}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmImport}
              disabled={isImporting}
              className={`px-4 py-2 rounded text-white flex items-center justify-center gap-2
    ${
      isImporting
        ? "bg-green-400 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700"
    }`}
            >
              {isImporting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Importing...
                </>
              ) : (
                "Confirm Import"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-64 focus:ring focus:ring-blue-300"
        />
        <select
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="All">All Programs</option>
          <option value="FYUP">FYUP</option>
          <option value="B.Ed.">B.Ed.</option>
          <option value="M.Ed.">M.Ed.</option>
          <option value="ITEP">ITEP</option>
        </select>
        <button
          onClick={serverGetData}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 animate-spin-slow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v6h6M20 20v-6h-6M4 10a9 9 0 0114.09-6.36L20 6M20 14a9 9 0 01-14.09 6.36L4 18"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Student ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3">Batch Year</th>
              <th className="px-4 py-3">University Roll</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Minor</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr
                key={s.id}
                className="hover:bg-blue-50 cursor-pointer"
                onClick={() => setSelectedStudent(s)}
              >
                <td className="px-4 py-3">{s.student_id}</td>
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3">{s.program}</td>
                <td className="px-4 py-3">{s.batch_year}</td>
                <td className="px-4 py-3">{s.university_roll}</td>
                <td className="px-4 py-3">{s.phone}</td>
                <td className="px-4 py-3">{s.minor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Profile Drawer */}
      {selectedStudent && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-xl border-l p-6 overflow-y-auto z-50 ">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
            onClick={() => setSelectedStudent(null)}
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold mb-2">{selectedStudent.name}</h2>
          <p className="text-gray-600 mb-1">ID: {selectedStudent.student_id}</p>
          <p className="text-gray-600 mb-1">
            Program: {selectedStudent.program}
          </p>
          <p className="text-gray-600 mb-1">
            Batch Year: {selectedStudent.batch_year}
          </p>
          <p className="text-gray-600 mb-1">
            University Roll: {selectedStudent.university_roll}
          </p>
          <p className="text-gray-600 mb-4">Phone: {selectedStudent.phone}</p>
          <p className="text-gray-600 mb-4">Minor: {selectedStudent.minor}</p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
