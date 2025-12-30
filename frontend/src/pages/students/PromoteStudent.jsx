import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiArrowRight, FiUsers, FiFilter, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const PromoteStudent = () => {
    const [sourceCriteria, setSourceCriteria] = useState({
        classId: '',
        sectionId: '1',
        rollNumber: ''
    });

    const [targetCriteria, setTargetCriteria] = useState({
        session: '2025-26',
        classId: '',
        sectionId: '',
        promotionFee: ''
    });

    // State for selected students
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSourceChange = (e) => {
        setSourceCriteria({ ...sourceCriteria, [e.target.name]: e.target.value });
    };

    const handleTargetChange = (e) => {
        setTargetCriteria({ ...targetCriteria, [e.target.name]: e.target.value });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedStudents(students.map(s => s.id));
        } else {
            setSelectedStudents([]);
        }
    };

    const handleSelectStudent = (id) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(sId => sId !== id));
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const params = {
                classId: sourceCriteria.classId,
                sectionId: sourceCriteria.sectionId,
                search: sourceCriteria.rollNumber, // Pass roll number as search param
                page: 0,
                size: 100
            };
            const response = await axios.get('http://localhost:8084/api/v1/students', { params });
            setStudents(response.data.content || []);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch students. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handlePromote = async () => {
        if (!targetCriteria.classId || !targetCriteria.sectionId || !targetCriteria.session) {
            setError("Please select all target fields (Session, Class, Section).");
            return;
        }
        if (selectedStudents.length === 0) {
            setError("Please select at least one student to promote.");
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const payload = {
                studentIds: selectedStudents,
                toClassId: parseInt(targetCriteria.classId),
                toSectionId: parseInt(targetCriteria.sectionId),
                academicYearId: 1,
                academicSession: targetCriteria.session,
                remarks: "Promoted via bulk action",
                promotionFee: targetCriteria.promotionFee ? parseFloat(targetCriteria.promotionFee) : null
            };

            const response = await axios.post('http://localhost:8084/api/v1/students/promote', payload);
            setMessage(`Successfully promoted ${response.data.promoted} students. Failed: ${response.data.failed}.`);
            setStudents([]);
            setSelectedStudents([]);
        } catch (err) {
            console.error(err);
            setError("Promotion failed. " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <FiUsers className="text-teal-400" />
                        Promote Students
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        Efficiently promote students to the next academic session in bulk.
                    </p>
                </div>
            </div>

            {/* Notifications */}
            {message && (
                <div className="mb-6 p-4 rounded-lg bg-green-900/30 border border-green-500/50 flex items-center gap-3 text-green-300 shadow-lg backdrop-blur-sm">
                    <FiCheckCircle className="flex-shrink-0 text-xl" />
                    <span>{message}</span>
                </div>
            )}
            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-900/30 border border-red-500/50 flex items-center gap-3 text-red-300 shadow-lg backdrop-blur-sm">
                    <FiAlertCircle className="flex-shrink-0 text-xl" />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Panel: Search & Filters */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                <FiFilter className="text-teal-600" />
                                Search Criteria
                            </h2>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Class</label>
                                <select
                                    name="classId"
                                    value={sourceCriteria.classId}
                                    onChange={handleSourceChange}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent block p-2.5 transition-all outline-none"
                                >
                                    <option value="">Select Class</option>
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Section</label>
                                <select
                                    name="sectionId"
                                    value={sourceCriteria.sectionId}
                                    onChange={handleSourceChange}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent block p-2.5 transition-all outline-none"
                                >
                                    <option value="">Select Section</option>
                                    <option value="1">Section A</option>
                                    <option value="2">Section B</option>
                                    <option value="3">Section C</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Roll No (Optional)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiSearch className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="rollNumber"
                                        value={sourceCriteria.rollNumber}
                                        onChange={handleSourceChange}
                                        placeholder="Enter Roll No"
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent block pl-10 p-2.5 transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleSearch}
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <FiSearch />
                                Search Students
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl shadow-xl overflow-hidden text-white p-6 relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <FiArrowRight size={100} />
                        </div>
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                            Target Promotion
                        </h2>
                        <div className="space-y-4 relative z-10">
                            <div>
                                <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2">Next Session</label>
                                <select
                                    name="session"
                                    value={targetCriteria.session}
                                    onChange={handleTargetChange}
                                    className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent block p-2.5 outline-none"
                                >
                                    <option value="2025-26" className="text-gray-800">2025-26</option>
                                    <option value="2026-27" className="text-gray-800">2026-27</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2">To Class</label>
                                    <select
                                        name="classId"
                                        value={targetCriteria.classId}
                                        onChange={handleTargetChange}
                                        className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent block p-2.5 outline-none"
                                    >
                                        <option value="" className="text-gray-800">Select</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={i + 1} className="text-gray-800">Class {i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2">To Section</label>
                                    <select
                                        name="sectionId"
                                        value={targetCriteria.sectionId}
                                        onChange={handleTargetChange}
                                        className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent block p-2.5 outline-none"
                                    >
                                        <option value="" className="text-gray-800">Select</option>
                                        <option value="1" className="text-gray-800">Sec A</option>
                                        <option value="2" className="text-gray-800">Sec B</option>
                                        <option value="3" className="text-gray-800">Sec C</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2">Promotion Fee (₹)</label>
                                <input
                                    type="number"
                                    name="promotionFee"
                                    value={targetCriteria.promotionFee}
                                    onChange={handleTargetChange}
                                    placeholder="0.00"
                                    className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent block p-2.5 outline-none placeholder-indigo-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Results */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 h-full flex flex-col">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-bold text-gray-800">Student List</h2>
                            <div className="text-sm text-gray-500">
                                {selectedStudents.length} / {students.length} Selected
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto">
                            {students.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold tracking-wider sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-3 border-b border-gray-200">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={students.length > 0 && selectedStudents.length === students.length}
                                                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                                                />
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200">Roll No</th>
                                            <th className="px-6 py-3 border-b border-gray-200">Name</th>
                                            <th className="px-6 py-3 border-b border-gray-200">Admission No</th>
                                            <th className="px-6 py-3 border-b border-gray-200">Current Class</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {students.map((student) => (
                                            <tr
                                                key={student.id}
                                                className={`transition-colors duration-150 ${selectedStudents.includes(student.id) ? 'bg-teal-50' : 'hover:bg-gray-50'}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedStudents.includes(student.id)}
                                                        onChange={() => handleSelectStudent(student.id)}
                                                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.rollNumber || '-'}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{student.fullName}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{student.admissionNumber}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        {student.className} - {student.sectionName}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                    <FiSearch size={48} className="mb-4 opacity-20" />
                                    <p>No students found. Use filters to search.</p>
                                </div>
                            )}
                        </div>

                        {/* Action Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button
                                onClick={handlePromote}
                                disabled={loading || selectedStudents.length === 0}
                                className={`
                                    px-8 py-3 rounded-lg font-bold shadow-lg transition-all duration-200 flex items-center gap-2
                                    ${loading || selectedStudents.length === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-xl transform hover:-translate-y-0.5'}
                                `}
                            >
                                {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                {loading ? 'Processing...' : 'Promote Selected Students'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromoteStudent;
