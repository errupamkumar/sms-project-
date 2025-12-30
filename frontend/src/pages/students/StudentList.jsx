import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiFilter, FiSearch, FiGrid, FiList, FiDownload, FiPrinter, FiCopy } from 'react-icons/fi';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useReactToPrint } from 'react-to-print';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list' or 'details'
    const [filters, setFilters] = useState({
        classId: '',
        sectionId: '',
        categoryId: '',
        houseId: '',
        search: ''
    });
    // Pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    const componentRef = useRef();

    useEffect(() => {
        fetchStudents();
        fetchCategories();
        fetchHouses();
    }, [page]); // Re-fetch on page change

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8084/api/v1/categories');
            setCategories(response.data || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchHouses = async () => {
        try {
            const response = await axios.get('http://localhost:8084/api/v1/houses');
            setHouses(response.data || []);
        } catch (err) {
            console.error('Error fetching houses:', err);
        }
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const params = {
                page,
                size: pageSize,
                sortBy: 'admissionNumber',
                classId: filters.classId || null,
                sectionId: filters.sectionId || null,
                categoryId: filters.categoryId || null,
                houseId: filters.houseId || null,
                search: filters.search || null
            };
            const response = await axios.get('http://localhost:8084/api/v1/students', { params });
            setStudents(response.data.content || []);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Clear other filters for Global Search as per request "working not dependent"
        setFilters(prev => ({ ...prev, classId: '', sectionId: '', categoryId: '', houseId: '' }));
        setPage(0);
        setTimeout(fetchStudents, 0);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Export Functions
    const exportToExcel = () => {
        try {
            if (!students || students.length === 0) {
                alert("No data to export");
                return;
            }
            const data = students.map(s => ({
                'Admission No': s.admissionNumber || '-',
                'Roll No': s.rollNumber || '-',
                'Name': s.fullName || '-',
                'Gender': s.gender || '-',
                'DOB': s.dob || '-',
                'Blood Group': s.bloodGroup || '-',
                'Admission Date': s.admissionDate || '-',
                'Class': s.className || '-',
                'Section': s.sectionName || '-',
                'Category': s.categoryName || '-',
                'House': s.houseName || '-',
                'Religion': s.religion || '-',
                'Caste': s.caste || '-',
                'Mobile': s.mobile || '-',
                'Email': s.email || '-',
                'Address': s.address || '-',
                'City': s.city || '-',
                'State': s.state || '-',
                'Pincode': s.pincode || '-',

                'Father Name': s.fatherName || '-',
                'Father Occupation': s.fatherOccupation || '-',
                'Father Mobile': s.fatherMobile || '-',
                'Mother Name': s.motherName || '-',
                'Mother Occupation': s.motherOccupation || '-',
                'Mother Mobile': s.motherMobile || '-',

                'Guardian Name': s.guardianName || '-',
                'Guardian Relation': s.guardianRelation || '-',
                'Guardian Mobile': s.guardianMobile || '-',
                'Guardian Email': s.guardianEmail || '-',
                'Guardian Address': s.guardianAddress || '-',
                'Guardian Occupation': s.guardianOccupation || '-',

                'Transport Route': s.transportRoute || '-',
                'Transport Vehicle': s.transportVehicle || '-',

                'Bank Account': s.bankAccountNumber || '-',
                'Bank Name': s.bankName || '-',
                'IFSC Code': s.ifscCode || '-',
                'National ID': s.nationalId || '-',
                'Local ID': s.localId || '-',
                'Previous School': s.previousSchool || '-'
            }));

            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Students");
            XLSX.writeFile(wb, "Student_List.xlsx");
        } catch (e) {
            console.error("Excel Error:", e);
            alert("Export Failed: " + e.message);
        }
    };

    const exportToPDF = () => {
        try {
            if (!students || students.length === 0) {
                alert("No data to export");
                return;
            }
            const doc = new jsPDF('l', 'mm', 'a4');
            doc.text("Student List", 14, 15);
            autoTable(doc, {
                head: [['Adm No', 'Name', 'Class', 'Father', 'Father Mobile', 'Mobile']],
                body: students.map(s => [
                    s.admissionNumber || '-',
                    s.fullName || '-',
                    s.className || '-',
                    s.fatherName || '-',
                    s.fatherMobile || '-',
                    s.mobile || '-'
                ]),
                startY: 20
            });
            doc.save("Student_List.pdf");
        } catch (e) {
            console.error("PDF Error:", e);
            alert("PDF Export Failed: " + e.message);
        }
    };

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: 'Student List'
    });

    const handleCopy = () => {
        const text = students.map(s =>
            `${s.admissionNumber}\t${s.fullName}\t${s.className}\t${s.fatherName}`
        ).join('\n');
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Student List</h1>
                    <p className="text-gray-400 mt-1">Manage all student records</p>
                </div>
                <Link
                    to="/students/add"
                    className="bg-teal-primary hover:bg-teal-hover text-dark-bg font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                    <FiPlus className="w-5 h-5" />
                    Add New Student
                </Link>
            </div>

            {/* Select Criteria Section (Dark Theme) */}
            <div className="bg-dark-card rounded-xl p-4 border border-dark-border mb-6">
                <div className="flex items-center gap-2 mb-4 border-b border-dark-border pb-2">
                    <FiFilter className="text-teal-primary" />
                    <h3 className="text-sm font-medium text-white">Select Criteria</h3>
                </div>
                {/* Note: onSubmit uses handleSearch which clears class/section */}
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    {/* Class */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Class</label>
                        <select
                            name="classId"
                            value={filters.classId}
                            onChange={handleFilterChange}
                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-teal-primary"
                        >
                            <option value="">All</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                            ))}
                        </select>
                    </div>

                    {/* Section */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Section</label>
                        <select
                            name="sectionId"
                            value={filters.sectionId}
                            onChange={handleFilterChange}
                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-teal-primary"
                        >
                            <option value="">All</option>
                            <option value="1">Section A</option>
                            <option value="2">Section B</option>
                            <option value="3">Section C</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Category</label>
                        <select
                            name="categoryId"
                            value={filters.categoryId}
                            onChange={handleFilterChange}
                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-teal-primary"
                        >
                            <option value="">All</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                            ))}
                        </select>
                    </div>

                    {/* House */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">House</label>
                        <select
                            name="houseId"
                            value={filters.houseId}
                            onChange={handleFilterChange}
                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-teal-primary"
                        >
                            <option value="">All</option>
                            {houses.map(house => (
                                <option key={house.id} value={house.id}>{house.houseName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search Keyword */}
                    <div className="relative">
                        <label className="block text-sm text-gray-400 mb-1">Search Keywords</label>
                        <div className="flex">
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Name, Phone, etc."
                                className="w-full bg-dark-bg border border-dark-border rounded-l-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-teal-primary"
                            />
                            <button
                                type="submit"
                                className="bg-teal-primary hover:bg-teal-hover text-dark-bg px-4 py-2 rounded-r-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <FiSearch />
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* View Tabs & Exports */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                <div className="flex bg-dark-card rounded-lg p-1 border border-dark-border">
                    <button
                        onClick={() => setView('list')}
                        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${view === 'list' ? 'bg-teal-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <FiList /> List View
                    </button>
                    <button
                        onClick={() => setView('details')}
                        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${view === 'details' ? 'bg-teal-primary text-dark-bg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <FiGrid /> Details View
                    </button>
                </div>

                <div className="flex bg-dark-card rounded-lg p-1 border border-dark-border gap-1">
                    <button onClick={handleCopy} className="p-2 text-gray-400 hover:text-teal-primary transition-colors" title="Copy"><FiCopy /></button>
                    <button onClick={exportToExcel} className="p-2 text-gray-400 hover:text-teal-primary transition-colors" title="Excel"><FiDownload /></button>
                    <button onClick={exportToPDF} className="p-2 text-gray-400 hover:text-teal-primary transition-colors" title="PDF"><FiDownload /></button>
                    <button onClick={handlePrint} className="p-2 text-gray-400 hover:text-teal-primary transition-colors" title="Print"><FiPrinter /></button>
                </div>
            </div>

            {/* Students Content */}
            <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden" ref={componentRef}>
                {loading ? (
                    <div className="text-center py-10 text-gray-400">Loading students...</div>
                ) : students.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        No students found.
                    </div>
                ) : (
                    <>
                        {view === 'list' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-dark-bg border-b border-dark-border">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Adm No.</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Gender</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Blood Group</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Class</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Section</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Adm Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Father Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Parent Mobile</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Category</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">House</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dark-border">
                                        {students.map((student) => (
                                            <tr key={student.id} className="hover:bg-dark-bg transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-primary">{student.admissionNumber}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{student.fullName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{student.gender}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{student.bloodGroup || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{student.className || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{student.sectionName || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{student.admissionDate || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{student.fatherName || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                    <div>{student.fatherMobile || '-'} (F)</div>
                                                    <div className="text-xs">{student.mobile || '-'} (S)</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{student.categoryName || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{student.houseName || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg"><FiEdit /></button>
                                                        <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><FiTrash2 /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                {students.map((student) => (
                                    <div key={student.id} className="bg-dark-bg rounded-lg p-4 border border-dark-border flex items-center gap-4">
                                        <div className="w-12 h-12 bg-teal-primary/20 rounded-full flex items-center justify-center text-teal-primary font-bold">
                                            {student.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{student.fullName}</h3>
                                            <p className="text-xs text-gray-400">Adm: {student.admissionNumber}</p>
                                            <p className="text-xs text-gray-400">{student.className || 'N/A'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination Controls */}
                        <div className="flex items-center justify-between px-6 py-4 bg-dark-bg border-t border-dark-border">
                            <span className="text-sm text-gray-400">
                                Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, totalElements)} of {totalElements}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="px-3 py-1 bg-dark-card border border-dark-border rounded text-white disabled:opacity-50 hover:bg-dark-border"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="px-3 py-1 bg-dark-card border border-dark-border rounded text-white disabled:opacity-50 hover:bg-dark-border"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentList;
