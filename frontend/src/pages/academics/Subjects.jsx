import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBook, FiEdit2, FiTrash2, FiSearch, FiSave, FiX, FiPlus } from 'react-icons/fi';

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        id: null,
        subjectName: '',
        subjectCode: ''
    });

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await axios.get('http://localhost:8084/api/v1/subjects');
            setSubjects(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching subjects:", error);
            setMessage({ type: 'error', text: 'Failed to load subjects.' });
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!formData.subjectName) {
            setMessage({ type: 'error', text: 'Subject Name is required.' });
            return;
        }

        try {
            if (isEditing) {
                await axios.put(`http://localhost:8084/api/v1/subjects/${formData.id}`, formData);
                setMessage({ type: 'success', text: 'Subject updated successfully!' });
            } else {
                await axios.post('http://localhost:8084/api/v1/subjects', formData);
                setMessage({ type: 'success', text: 'Subject created successfully!' });
            }
            fetchSubjects();
            resetForm();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Error saving subject:", error);
            setMessage({ type: 'error', text: 'Failed to save subject. It might already exist.' });
        }
    };

    const handleEdit = (subject) => {
        setFormData({
            id: subject.id,
            subjectName: subject.subjectName,
            subjectCode: subject.subjectCode || ''
        });
        setIsEditing(true);
        setMessage(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this subject?')) {
            try {
                await axios.delete(`http://localhost:8084/api/v1/subjects/${id}`);
                setMessage({ type: 'success', text: 'Subject deleted successfully!' });
                fetchSubjects();
                setTimeout(() => setMessage(null), 3000);
            } catch (error) {
                console.error("Error deleting subject:", error);
                setMessage({ type: 'error', text: 'Failed to delete subject.' });
            }
        }
    };

    const resetForm = () => {
        setFormData({ id: null, subjectName: '', subjectCode: '' });
        setIsEditing(false);
    };

    const filteredSubjects = subjects.filter(subject =>
        subject.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (subject.subjectCode && subject.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
            {/* Left - Form */}
            <div className="w-full lg:w-1/3 bg-dark-card p-6 rounded-lg shadow-lg border border-dark-border h-fit">
                <h2 className="text-xl font-bold text-white mb-6 border-b border-dark-border pb-2 flex items-center gap-2">
                    {isEditing ? <FiEdit2 className="text-teal-primary" /> : <FiPlus className="text-teal-primary" />}
                    {isEditing ? 'Edit Subject' : 'Add Subject'}
                </h2>

                {message && (
                    <div className={`p-3 mb-4 rounded text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-1">Subject Name *</label>
                        <input
                            type="text"
                            name="subjectName"
                            value={formData.subjectName}
                            onChange={handleInputChange}
                            className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:outline-none focus:border-teal-primary transition-colors"
                            placeholder="e.g. Mathematics"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-1">Subject Code</label>
                        <input
                            type="text"
                            name="subjectCode"
                            value={formData.subjectCode}
                            onChange={handleInputChange}
                            className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:outline-none focus:border-teal-primary transition-colors"
                            placeholder="e.g. MATH101"
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-teal-primary hover:bg-teal-600 text-white font-medium py-2 px-4 rounded transition-colors shadow-lg shadow-teal-primary/20 flex items-center justify-center gap-2"
                        >
                            <FiSave className="w-4 h-4" /> {isEditing ? 'Update' : 'Save'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded border border-red-500/20 transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Right - List */}
            <div className="w-full lg:w-2/3 bg-dark-card rounded-lg shadow-lg border border-dark-border flex flex-col">
                <div className="p-6 border-b border-dark-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FiBook className="text-teal-primary" /> Subject List
                    </h2>
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
                        <input
                            type="text"
                            placeholder="Search subjects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-dark-bg border border-dark-border rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-teal-primary transition-colors w-64"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    {loading ? (
                        <div className="text-center text-dark-muted py-8">Loading subjects...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-dark-border">
                                        <th className="py-3 px-4 text-dark-muted font-medium text-sm w-1/2">Subject</th>
                                        <th className="py-3 px-4 text-dark-muted font-medium text-sm w-1/4">Code</th>
                                        <th className="py-3 px-4 text-dark-muted font-medium text-sm w-1/4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-border">
                                    {filteredSubjects.map(subject => (
                                        <tr key={subject.id} className="hover:bg-dark-bg/50 transition-colors group">
                                            <td className="py-3 px-4 text-white font-medium">{subject.subjectName}</td>
                                            <td className="py-3 px-4 text-gray-400 text-sm">{subject.subjectCode || '-'}</td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEdit(subject)}
                                                        className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FiEdit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(subject.id)}
                                                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredSubjects.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="py-8 text-center text-dark-muted text-sm">No subjects found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Subjects;
