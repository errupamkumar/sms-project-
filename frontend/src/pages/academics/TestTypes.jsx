import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';

const TestTypes = () => {
    const [testTypes, setTestTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTest, setCurrentTest] = useState({
        id: null,
        examName: '',
        session: '2025-26',
        fullMarks: '',
        passMarks: ''
    });

    useEffect(() => {
        fetchTestTypes();
    }, []);

    const fetchTestTypes = async () => {
        try {
            const res = await axios.get('http://localhost:8084/api/v1/examination/exams');
            setTestTypes(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch test types", error);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...currentTest };
            if (currentTest.id) {
                await axios.put(`http://localhost:8084/api/v1/examination/exams/${currentTest.id}`, payload);
            } else {
                await axios.post('http://localhost:8084/api/v1/examination/exams', payload);
            }
            fetchTestTypes();
            resetForm();
        } catch (error) {
            console.error("Failed to save test type", error);
            alert("Failed to save");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this test type?")) {
            try {
                await axios.delete(`http://localhost:8084/api/v1/examination/exams/${id}`);
                fetchTestTypes();
            } catch (error) {
                console.error("Failed to delete", error);
            }
        }
    };

    const handleEdit = (test) => {
        setCurrentTest(test);
        setIsEditing(true);
    };

    const resetForm = () => {
        setCurrentTest({ id: null, examName: '', session: '2025-26', fullMarks: '', passMarks: '' });
        setIsEditing(false);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Test Types (Examinations)</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="bg-dark-card p-6 rounded-xl border border-dark-border h-fit">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        {isEditing ? <FiEdit2 className="text-teal-primary" /> : <FiPlus className="text-teal-primary" />}
                        {isEditing ? 'Edit Test Type' : 'Create New Test Type'}
                    </h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Exam Name</label>
                            <input
                                type="text"
                                value={currentTest.examName}
                                onChange={e => setCurrentTest({ ...currentTest, examName: e.target.value })}
                                className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:border-teal-primary outline-none"
                                placeholder="e.g. Mid Term"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Session</label>
                            <input
                                type="text"
                                value={currentTest.session}
                                onChange={e => setCurrentTest({ ...currentTest, session: e.target.value })}
                                className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:border-teal-primary outline-none"
                                placeholder="2025-26"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Full Marks</label>
                                <input
                                    type="number"
                                    value={currentTest.fullMarks}
                                    onChange={e => setCurrentTest({ ...currentTest, fullMarks: e.target.value })}
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:border-teal-primary outline-none"
                                    placeholder="100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Passing Marks</label>
                                <input
                                    type="number"
                                    value={currentTest.passMarks}
                                    onChange={e => setCurrentTest({ ...currentTest, passMarks: e.target.value })}
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-white focus:border-teal-primary outline-none"
                                    placeholder="33"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-teal-primary hover:bg-teal-hover text-dark-bg font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                            >
                                <FiSave /> {isEditing ? 'Update' : 'Save'}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                                >
                                    <FiX />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-dark-bg border-b border-dark-border">
                                <tr>
                                    <th className="p-4 text-gray-400 font-medium">Name</th>
                                    <th className="p-4 text-gray-400 font-medium">Session</th>
                                    <th className="p-4 text-center text-gray-400 font-medium">Full Marks</th>
                                    <th className="p-4 text-center text-gray-400 font-medium">Pass Marks</th>
                                    <th className="p-4 text-right text-gray-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td></tr>
                                ) : testTypes.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">No test types found.</td></tr>
                                ) : (
                                    testTypes.map(test => (
                                        <tr key={test.id} className="hover:bg-dark-bg/50 group">
                                            <td className="p-4 text-white font-medium">{test.examName}</td>
                                            <td className="p-4 text-gray-300">{test.session}</td>
                                            <td className="p-4 text-center text-gray-300">{test.fullMarks || '-'}</td>
                                            <td className="p-4 text-center text-gray-300">{test.passMarks || '-'}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(test)}
                                                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"
                                                    >
                                                        <FiEdit2 />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(test.id)}
                                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestTypes;
