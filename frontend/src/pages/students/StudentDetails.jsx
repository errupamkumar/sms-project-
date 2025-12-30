import React, { useState, useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import axios from 'axios';
import { FaThList, FaThLarge, FaSearch, FaFileExcel, FaFilePdf, FaPrint, FaFileCsv, FaCopy } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const StudentDetails = () => {
    const [view, setView] = useState('list'); // 'list' or 'details'
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        classId: '',
        sectionId: '',
        search: ''
    });
    // Pagination state
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    const componentRef = useRef();

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                size: pageSize,
                classId: filters.classId || null,
                sectionId: filters.sectionId || null,
                search: filters.search || null
            };
            const response = await axios.get('http://localhost:8084/api/v1/students', { params });
            setStudents(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [page]); // Trigger on page change only. Search triggers on button click.

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0); // Reset to first page
        fetchStudents();
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Export Functions
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(students.map(s => ({
            'Admission No': s.admissionNumber,
            'Name': s.fullName,
            'Class': `Class ${s.currentClassId}`,
            'Section': `Section ${s.currentSectionId}`, // Mapping needed if logical
            'Father Name': s.fatherName,
            'DOB': s.dateOfBirth,
            'Gender': s.gender,
            'Mobile': s.mobile
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Students");
        XLSX.writeFile(wb, "Student_List.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Student List", 14, 15);
        autoTable(doc, {
            head: [['Adm No', 'Name', 'Class', 'Father Name', 'Mobile', 'Gender']],
            body: students.map(s => [s.admissionNumber, s.fullName, s.currentClassId, s.fatherName, s.mobile, s.gender]),
            startY: 20
        });
        doc.save("Student_List.pdf");
    };

    const exportToCSV = () => {
        const ws = XLSX.utils.json_to_sheet(students);
        const csv = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "Student_List.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: 'Student List'
    });

    const handleCopy = () => {
        const text = students.map(s => `${s.admissionNumber}\t${s.fullName}\t${s.mobile}`).join('\n');
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!'); // Simple feedback
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Student Details</h1>

            {/* Select Criteria Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-t-4 border-gray-700">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Select Criteria</h2>
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

                    {/* Class Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Class</label>
                        <select
                            name="classId"
                            value={filters.classId}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                            <option value="">Select</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                                <option key={num} value={num}>Class {num}</option>
                            ))}
                        </select>
                    </div>

                    {/* Section Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Section</label>
                        <select
                            name="sectionId"
                            value={filters.sectionId}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                            <option value="">Select</option>
                            <option value="1">Section A</option>
                            <option value="2">Section B</option>
                            <option value="3">Section C</option>
                        </select>
                    </div>

                    {/* Checkbox: Search By Keyword */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Search By Keyword</label>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search By Student Name, Roll Number, etc."
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <button
                            type="submit"
                            className="absolute right-0 top-7 bottom-0 bg-gray-800 text-white px-4 py-2 rounded-r hover:bg-gray-700 flex items-center gap-2"
                        >
                            <FaSearch /> Search
                        </button>
                    </div>
                </form>
            </div>

            {/* View Tabs & Content */}
            <div className="bg-white rounded-lg shadow-md border-t-4 border-orange-500">
                <div className="flex border-b">
                    <button
                        className={`flex items-center gap-2 px-6 py-3 font-medium ${view === 'list' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => setView('list')}
                    >
                        <FaThList /> List View
                    </button>
                    <button
                        className={`flex items-center gap-2 px-6 py-3 font-medium ${view === 'details' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => setView('details')}
                    >
                        <FaThLarge /> Details View
                    </button>
                </div>

                <div className="p-6">
                    {/* Toolbar */}
                    <div className="flex flex-wrap justify-between items-center mb-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="p-2 border rounded w-64 text-sm"
                            disabled // Disabled because we use top search, visual only per requirement or could implement local filter
                        />
                        <div className="flex gap-2">
                            <button onClick={handleCopy} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Copy"><FaCopy /></button>
                            <button onClick={exportToCSV} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="CSV"><FaFileCsv /></button>
                            <button onClick={exportToExcel} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Excel"><FaFileExcel /></button>
                            <button onClick={exportToPDF} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="PDF"><FaFilePdf /></button>
                            <button onClick={handlePrint} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Print"><FaPrint /></button>
                        </div>
                    </div>

                    {/* Data Display */}
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading...</div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="text-red-400 mb-2">No data available in table</div>
                            <img src="https://cdn-icons-png.flaticon.com/512/7486/7486777.png" alt="No Data" className="w-24 h-24 mx-auto opacity-50" />
                            <p className="text-green-600 font-medium mt-4">Add new record or search with different criteria.</p>
                        </div>
                    ) : (
                        <div ref={componentRef}>
                            {view === 'list' ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-600">
                                        <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b">
                                            <tr>
                                                <th className="px-4 py-3">Admission No</th>
                                                <th className="px-4 py-3">Student Name</th>
                                                <th className="px-4 py-3">Class</th>
                                                <th className="px-4 py-3">Father Name</th>
                                                <th className="px-4 py-3">Date of Birth</th>
                                                <th className="px-4 py-3">Gender</th>
                                                <th className="px-4 py-3">Mobile Number</th>
                                                <th className="px-4 py-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {students.map(student => (
                                                <tr key={student.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium text-blue-600">{student.admissionNumber}</td>
                                                    <td className="px-4 py-3">{student.fullName}</td>
                                                    <td className="px-4 py-3">Class {student.currentClassId} ({student.currentSectionId === 1 ? 'A' : student.currentSectionId === 2 ? 'B' : 'C'})</td>
                                                    <td className="px-4 py-3">{student.fatherName || '-'}</td>
                                                    <td className="px-4 py-3">{student.dateOfBirth}</td>
                                                    <td className="px-4 py-3">{student.gender}</td>
                                                    <td className="px-4 py-3">{student.mobile || '-'}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button className="text-blue-500 hover:underline">Edit</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {students.map(student => (
                                        <div key={student.id} className="border rounded-lg p-4 bg-gray-50 flex gap-4 items-center">
                                            <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0"></div> {/* Placeholder for Photo */}
                                            <div>
                                                <h3 className="font-bold text-gray-800">{student.fullName}</h3>
                                                <p className="text-sm text-gray-600">Adm: {student.admissionNumber}</p>
                                                <p className="text-sm text-gray-600">Class {student.currentClassId}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                        <span>Records: {page * pageSize + 1} to {Math.min((page + 1) * pageSize, totalElements)} of {totalElements}</span>
                        <div className="flex gap-1">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage(p => p - 1)}
                                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                            >
                                &lt;
                            </button>
                            <button
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(p => p + 1)}
                                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetails;
