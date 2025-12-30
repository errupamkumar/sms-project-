import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiSearch, FiCheck, FiX } from 'react-icons/fi';


const ClassManager = () => {
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [sections, setSections] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        className: '',
        subjectName: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        teacherId: '',
        sectionInput: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '' }

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [classRes, teacherRes] = await Promise.all([
                axios.get('http://localhost:8084/api/school-classes'),
                axios.get('http://localhost:8084/api/school-classes/teachers')
            ]);
            setClasses(classRes.data);
            setTeachers(teacherRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            if (isEditing) {
                await axios.put(`http://localhost:8084/api/school-classes/${editId}`, formData);
                setMessage({ type: 'success', text: 'Class updated successfully!' });
            } else {
                await axios.post('http://localhost:8084/api/school-classes', formData);
                setMessage({ type: 'success', text: 'Class added successfully!' });
            }

            // Reset form
            setFormData({ className: '', teacherId: '', sectionIds: [] });
            setIsEditing(false);
            setEditId(null);
            fetchInitialData();

            // Auto hide message
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Error saving class:", error);
            setMessage({ type: 'error', text: 'Failed to save class. Please try again.' });
        }
    };

    const handleEdit = (cls) => {
        setIsEditing(true);
        setEditId(cls.id);
        const sectionStr = cls.sections ? cls.sections.map(s => s.sectionName).join(', ') : '';
        setFormData({
            className: cls.className,
            subjectName: cls.subjectName || '',
            startDate: cls.startDate || '',
            startTime: cls.startTime || '',
            endDate: cls.endDate || '',
            endTime: cls.endTime || '',
            teacherId: cls.classTeacher ? cls.classTeacher.id : '',
            sectionInput: sectionStr
        });
        setMessage(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this class?")) return;
        try {
            await axios.delete(`http://localhost:8084/api/school-classes/${id}`);
            setMessage({ type: 'success', text: 'Class deleted successfully!' });
            fetchInitialData();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Error deleting class:", error);
            setMessage({ type: 'error', text: 'Failed to delete class.' });
        }
    };

    const filteredClasses = classes.filter(cls =>
        cls.className.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/3 bg-dark-card p-6 rounded-lg shadow-lg border border-dark-border h-fit">
                <h2 className="text-xl font-bold text-white mb-6 border-b border-dark-border pb-2">
                    {isEditing ? 'Edit Class' : 'Add Class'}
                </h2>

                {message && (
                    <div className={`p-3 mb-4 rounded text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-1">Class Name *</label>
                        <input
                            type="text"
                            name="className"
                            value={formData.className}
                            onChange={handleInputChange}
                            className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:outline-none focus:border-teal-primary transition-colors"
                            placeholder="e.g. Class 10"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-1">Subject Name</label>
                        <input
                            type="text"
                            name="subjectName"
                            value={formData.subjectName}
                            onChange={handleInputChange}
                            className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:outline-none focus:border-teal-primary transition-colors"
                            placeholder="e.g. Mathematics"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-1">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:outline-none focus:border-teal-primary transition-colors text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-1">Start Time</label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:outline-none focus:border-teal-primary transition-colors text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-1">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:outline-none focus:border-teal-primary transition-colors text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-1">End Time</label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:outline-none focus:border-teal-primary transition-colors text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-1">Class Teacher</label>
                        <select
                            name="teacherId"
                            value={formData.teacherId}
                            onChange={handleInputChange}
                            className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:outline-none focus:border-teal-primary transition-colors"
                        >
                            <option value="">Select Teacher</option>
                            {teachers.map(t => (
                                <option key={t.id} value={t.id}>{t.teacherName}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-1">Sections (Comma Separated)</label>
                        <input
                            type="text"
                            name="sectionInput"
                            value={formData.sectionInput}
                            onChange={handleInputChange}
                            className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:outline-none focus:border-teal-primary transition-colors"
                            placeholder="e.g. A, B, C"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-teal-primary hover:bg-teal-600 text-white font-medium py-2 px-4 rounded transition-colors shadow-lg shadow-teal-primary/20"
                        >
                            {isEditing ? 'Update Class' : 'Save Class'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => { setIsEditing(false); setEditId(null); setFormData({ className: '', teacherId: '', sectionIds: [] }); }}
                                className="w-full mt-2 bg-dark-bg border border-dark-border text-dark-muted hover:text-white py-2 px-4 rounded transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Right Side - List */}
            <div className="w-full lg:w-2/3 bg-dark-card rounded-lg shadow-lg border border-dark-border flex flex-col">
                <div className="p-6 border-b border-dark-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-bold text-white">Class List</h2>
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-dark-bg border border-dark-border rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-teal-primary transition-colors w-64"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-dark-border">
                                    <th className="py-3 px-4 text-dark-muted font-medium text-sm">Class</th>
                                    <th className="py-3 px-4 text-dark-muted font-medium text-sm">Teacher</th>
                                    <th className="py-3 px-4 text-dark-muted font-medium text-sm">Sections</th>
                                    <th className="py-3 px-4 text-dark-muted font-medium text-sm text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {filteredClasses.length > 0 ? (
                                    filteredClasses.map(cls => (
                                        <tr key={cls.id} className="hover:bg-dark-bg/50 transition-colors group">
                                            <td className="py-3 px-4 text-white font-medium">{cls.className}</td>
                                            <td className="py-3 px-4 text-gray-300 text-sm">
                                                {cls.classTeacher ? cls.classTeacher.teacherName : <span className="text-dark-muted italic">Not Assigned</span>}
                                            </td>
                                            <td className="py-3 px-4 text-gray-300 text-sm">
                                                {cls.sections && cls.sections.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {cls.sections.map(s => (
                                                            <span key={s.id} className="bg-dark-bg border border-dark-border text-xs px-2 py-0.5 rounded text-dark-muted">
                                                                {s.sectionName}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : <span className="text-dark-muted italic">None</span>}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(cls)}
                                                        className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FiEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cls.id)}
                                                        className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-dark-muted text-sm">
                                            No classes found. Add one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 text-xs text-dark-muted">
                        Records: 1 to {filteredClasses.length} of {filteredClasses.length}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassManager;
