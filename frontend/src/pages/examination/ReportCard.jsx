import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiPrinter, FiUser, FiFileText, FiFilter, FiDownload } from 'react-icons/fi';

const ReportCard = () => {
    const [criteria, setCriteria] = useState({
        session: '2025-26',
        classId: '',
        sectionId: '',
        studentId: ''
    });

    const [options, setOptions] = useState({
        classes: [],
        sections: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }, { id: 4, name: 'D' }],
        students: []
    });

    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClasses = () => {
            const classes = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `Class ${i + 1}` }));
            setOptions(prev => ({ ...prev, classes }));
        };
        fetchClasses();
    }, []);

    const handleChange = (e) => {
        setCriteria({ ...criteria, [e.target.name]: e.target.value });
    };

    const handleClassChange = async (e) => {
        const { name, value } = e.target;
        setCriteria(prev => ({ ...prev, [name]: value, studentId: '' })); // Reset student on class change

        // If class and section selected, fetch students
        const classId = name === 'classId' ? value : criteria.classId;
        const sectionId = name === 'sectionId' ? value : criteria.sectionId;

        if (classId && sectionId) {
            try {
                const res = await axios.get('http://localhost:8084/api/v1/students', {
                    params: { classId, sectionId, size: 100 }
                });
                setOptions(prev => ({ ...prev, students: res.data.content || [] }));
            } catch (err) {
                console.error("Failed to fetch students", err);
            }
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!criteria.studentId) {
            setError("Please select a student.");
            return;
        }

        setLoading(true);
        setError('');
        setReportData(null);

        try {
            // Fetch student details
            const student = options.students.find(s => s.id === parseInt(criteria.studentId));

            // Fetch marks
            const marksRes = await axios.get('http://localhost:8084/api/v1/examination/marks', {
                params: { studentId: criteria.studentId }
            });

            // Process marks into report structure
            // Structure: { subjectName: { examName: marks, 'Total': total } }
            const processed = {};
            const exams = new Set();

            marksRes.data.forEach(m => {
                if (m.exam.isResultPublished) {
                    const subj = m.subject.subjectName;
                    const exe = m.exam.examName;
                    exams.add(exe);

                    if (!processed[subj]) processed[subj] = {};
                    processed[subj][exe] = m.isAbsent ? 'AB' : m.marksObtained;
                }
            });

            setReportData({
                student,
                marks: processed,
                exams: Array.from(exams).sort(),
                session: criteria.session
            });

        } catch (err) {
            console.error(err);
            setError("Failed to generate report card.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-7xl mx-auto print:max-w-none print:mx-0">
            <div className="flex items-center justify-between mb-8 print:hidden">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <FiFileText className="text-teal-400" />
                        Report Card
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        Generate and print student academic reports.
                    </p>
                </div>
                {reportData && (
                    <button
                        onClick={handlePrint}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow flex items-center gap-2"
                    >
                        <FiPrinter /> Print Report
                    </button>
                )}
            </div>

            {/* Criteria Card - Hidden when printing */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 mb-8 print:hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <FiFilter className="text-teal-600" />
                        Select Student
                    </h2>
                </div>
                <div className="p-6">
                    <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Session</label>
                            <input
                                type="text"
                                name="session"
                                value={criteria.session}
                                readOnly
                                className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-lg block p-2.5 outline-none cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Class *</label>
                            <select
                                name="classId"
                                value={criteria.classId}
                                onChange={handleClassChange}
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
                                onChange={handleClassChange} // Reuse handleClassChange to trigger student fetch if needed or just update state
                                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 block p-2.5 outline-none"
                            >
                                <option value="">Select</option>
                                {options.sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Student *</label>
                            <select
                                name="studentId"
                                value={criteria.studentId}
                                onChange={handleChange}
                                disabled={!criteria.classId || !criteria.sectionId}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 block p-2.5 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                <option value="">Select Student</option>
                                {options.students.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.rollNumber})</option>)}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                        >
                            <FiSearch /> Generate
                        </button>
                    </form>
                </div>
            </div>

            {/* Report Card Display */}
            {reportData && (
                <div className="bg-white shadow-2xl print:shadow-none p-10 min-h-[800px] w-[210mm] mx-auto print:w-full print:p-0 print:m-0">
                    <div className="border-4 border-double border-gray-800 p-8 h-full relative">
                        {/* Header */}
                        <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
                            <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-wider">PREMIER PUBLIC SCHOOL</h1>
                            <p className="text-gray-600 mt-2 font-serif text-sm">An English Medium Co-Educational School</p>
                            <p className="text-gray-600 text-sm italic">Affiliated to CBSE, New Delhi</p>

                            <div className="mt-6 inline-block border px-6 py-1 rounded-full bg-gray-100 text-gray-800 font-bold uppercase tracking-widest text-sm">
                                ACADEMIC REPORT CARD {reportData.session}
                            </div>
                        </div>

                        {/* Student Details */}
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 text-sm text-gray-800 font-serif">
                            <div className="flex">
                                <span className="font-bold w-32">Student Name:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{reportData.student.fullName}</span>
                            </div>
                            <div className="flex">
                                <span className="font-bold w-32">Admission No:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{reportData.student.admissionNumber}</span>
                            </div>
                            <div className="flex">
                                <span className="font-bold w-32">Class & Section:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">Class {criteria.classId} - {options.sections.find(s => s.id == criteria.sectionId)?.name}</span>
                            </div>
                            <div className="flex">
                                <span className="font-bold w-32">Roll Number:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{reportData.student.rollNumber}</span>
                            </div>
                            <div className="flex">
                                <span className="font-bold w-32">Reference Date:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Marks Table */}
                        <div className="mb-8">
                            <table className="w-full border-collapse border border-gray-800 text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-800 p-3 text-left w-1/3">Subjects</th>
                                        {reportData.exams.map(ex => (
                                            <th key={ex} className="border border-gray-800 p-3 text-center w-32">{ex}</th>
                                        ))}
                                        <th className="border border-gray-800 p-3 text-center font-bold bg-gray-200">Overall Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(reportData.marks).map((subject, idx) => (
                                        <tr key={subject}>
                                            <td className="border border-gray-800 p-3 font-medium">{subject}</td>
                                            {reportData.exams.map(ex => (
                                                <td key={ex} className="border border-gray-800 p-3 text-center">
                                                    {reportData.marks[subject][ex] !== undefined ? reportData.marks[subject][ex] : '-'}
                                                </td>
                                            ))}
                                            <td className="border border-gray-800 p-3 text-center font-bold bg-gray-50">
                                                {/* Placeholder for grade calculation logic */}
                                                A
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Remarks & Signatures */}
                        <div className="flex justify-between items-end mt-24 px-8">
                            <div className="text-center">
                                <div className="border-t border-gray-800 w-48 mb-2"></div>
                                <p className="font-bold text-sm">Class Teacher</p>
                            </div>
                            <div className="text-center">
                                <div className="border-t border-gray-800 w-48 mb-2"></div>
                                <p className="font-bold text-sm">Principal</p>
                            </div>
                            <div className="text-center">
                                <div className="border-t border-gray-800 w-48 mb-2"></div>
                                <p className="font-bold text-sm">Date of Issue</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-500 print:bottom-8">
                            Generated by School Management Software
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportCard;
