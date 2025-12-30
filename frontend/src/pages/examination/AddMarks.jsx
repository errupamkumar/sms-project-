import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSave, FiSearch, FiFilter, FiCheckCircle, FiAlertCircle, FiClipboard } from 'react-icons/fi';

const AddMarks = () => {
    const [criteria, setCriteria] = useState({
        classId: '',
        sectionId: '',
        subjectId: '',
        examId: ''
    });

    const [options, setOptions] = useState({
        classes: [],
        sections: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }, { id: 4, name: 'D' }],
        subjects: [],
        exams: []
    });

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch initialization data
        const fetchData = async () => {
            try {
                // Mock class data if dynamic API not ready, or use loop
                const classes = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `Class ${i + 1}` }));
                setOptions(prev => ({ ...prev, classes }));

                const subjectsRes = await axios.get('http://localhost:8084/api/v1/examination/subjects');
                const examsRes = await axios.get('http://localhost:8084/api/v1/examination/exams');

                setOptions(prev => ({
                    ...prev,
                    subjects: subjectsRes.data,
                    exams: examsRes.data
                }));
            } catch (err) {
                console.error("Failed to load initial data", err);
                setError("Failed to load subjects or exams. Please ensure backend is running.");
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setCriteria({ ...criteria, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!criteria.classId || !criteria.sectionId || !criteria.subjectId || !criteria.examId) {
            setError("Please select all criteria fields.");
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');
        setStudents([]);

        try {
            // Fetch students
            const studentsRes = await axios.get('http://localhost:8084/api/v1/students', {
                params: {
                    classId: criteria.classId,
                    sectionId: criteria.sectionId,
                    size: 100
                }
            });

            // Fetch existing marks if any
            let existingMarksMap = {};
            try {
                const marksRes = await axios.get('http://localhost:8084/api/v1/examination/marks', {
                    params: criteria
                });
                marksRes.data.forEach(m => {
                    existingMarksMap[m.student.id] = m;
                });
            } catch (ignore) { /* No marks found is fine */ }

            const studentList = (studentsRes.data.content || []).map(student => {
                const existing = existingMarksMap[student.id];
                return {
                    id: student.id,
                    rollNumber: student.rollNumber,
                    admissionNumber: student.admissionNumber,
                    fullName: student.fullName,
                    marksObtained: existing ? existing.marksObtained : '',
                    isAbsent: existing ? existing.isAbsent : false
                };
            });

            // Sort by roll number
            studentList.sort((a, b) => {
                const rA = parseInt(a.rollNumber) || 99999;
                const rB = parseInt(b.rollNumber) || 99999;
                return rA - rB;
            });

            setStudents(studentList);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkChange = (id, value) => {
        setStudents(prev => prev.map(s =>
            s.id === id ? { ...s, marksObtained: value } : s
        ));
    };

    const handleAbsentToggle = (id) => {
        setStudents(prev => prev.map(s =>
            s.id === id ? { ...s, isAbsent: !s.isAbsent, marksObtained: !s.isAbsent ? 0 : s.marksObtained } : s
        ));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const marksPayload = students.map(s => ({
                studentId: s.id,
                marksObtained: s.isAbsent ? 0 : parseFloat(s.marksObtained || 0),
                isAbsent: s.isAbsent
            }));

            const payload = {
                ...criteria,
                classId: parseInt(criteria.classId),
                sectionId: parseInt(criteria.sectionId),
                subjectId: parseInt(criteria.subjectId),
                examId: parseInt(criteria.examId),
                marks: marksPayload
            };

            await axios.post('http://localhost:8084/api/v1/examination/marks', payload);
            setMessage("Marks saved successfully!");
        } catch (err) {
            console.error(err);
            setError("Failed to save marks. " + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <FiClipboard className="text-teal-400" />
                        Add Marks
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        Enter student marks for specific exams and subjects.
                    </p>
                </div>
            </div>

            {/* Criteria Card */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 mb-8">
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <FiFilter className="text-teal-600" />
                        Select Criteria
                    </h2>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Class *</label>
                            <select
                                name="classId"
                                value={criteria.classId}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 block p-2.5 outline-none"
                            >
                                <option value="">Select</option>
                                {options.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Section *</label>
                            <select
                                name="sectionId"
                                value={criteria.sectionId}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 block p-2.5 outline-none"
                            >
                                <option value="">Select</option>
                                {options.sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subject *</label>
                            <select
                                name="subjectId"
                                value={criteria.subjectId}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 block p-2.5 outline-none"
                            >
                                <option value="">Select</option>
                                {options.subjects.map(s => <option key={s.id} value={s.id}>{s.subjectName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Exam *</label>
                            <select
                                name="examId"
                                value={criteria.examId}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 block p-2.5 outline-none"
                            >
                                <option value="">Select</option>
                                {options.exams.map(e => <option key={e.id} value={e.id}>{e.examName}</option>)}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                        >
                            <FiSearch /> Search
                        </button>
                    </form>
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

            {/* Student List Table */}
            {students.length > 0 && (
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-bold text-gray-800">Student List</h2>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors flex items-center gap-2"
                        >
                            <FiSave /> {loading ? 'Saving...' : 'Save Marks'}
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 border-b">Roll No</th>
                                    <th className="px-6 py-4 border-b">Admission No</th>
                                    <th className="px-6 py-4 border-b">Student Name</th>
                                    <th className="px-6 py-4 border-b text-center">Is Absent</th>
                                    <th className="px-6 py-4 border-b">Marks Obtained (Max 100)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.rollNumber || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{student.admissionNumber}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">{student.fullName}</td>
                                        <td className="px-6 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={student.isAbsent}
                                                onChange={() => handleAbsentToggle(student.id)}
                                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300 transition"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={student.marksObtained}
                                                onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                disabled={student.isAbsent}
                                                className={`w-32 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition
                                                    ${student.isAbsent ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                                                `}
                                                placeholder="0.00"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <FiSave />}
                            {loading ? 'Processing...' : 'Save All Marks'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddMarks;
