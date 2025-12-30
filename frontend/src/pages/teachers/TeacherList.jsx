import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import axios from 'axios';

const TeacherList = () => {
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('http://localhost:8084/api/teachers');
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            try {
                await axios.delete(`http://localhost:8084/api/teachers/${id}`);
                setTeachers(teachers.filter(t => t.id !== id));
            } catch (error) {
                console.error('Error deleting teacher:', error);
                alert('Failed to delete teacher');
            }
        }
    };

    const filteredTeachers = teachers.filter(teacher =>
        teacher.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.mobile?.includes(searchTerm)
    );

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-dark-text">Teacher List</h1>
                <button
                    onClick={() => navigate('/teachers/add')}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-primary hover:bg-teal-hover text-dark-bg rounded-lg transition-colors font-medium"
                >
                    <FiPlus className="w-5 h-5" />
                    <span>Add Teacher</span>
                </button>
            </div>

            <div className="bg-dark-card rounded-xl border border-dark-border flex-1 flex flex-col overflow-hidden">
                {/* Search and Filter */}
                <div className="p-4 border-b border-dark-border flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
                        <input
                            type="text"
                            placeholder="Search by name, email, mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-dark-bg sticky top-0 z-10">
                            <tr>
                                <th className="p-4 text-sm font-medium text-dark-muted border-b border-dark-border">ID</th>
                                <th className="p-4 text-sm font-medium text-dark-muted border-b border-dark-border">Name</th>
                                <th className="p-4 text-sm font-medium text-dark-muted border-b border-dark-border">Designation</th>
                                <th className="p-4 text-sm font-medium text-dark-muted border-b border-dark-border">Mobile</th>
                                <th className="p-4 text-sm font-medium text-dark-muted border-b border-dark-border">Email</th>
                                <th className="p-4 text-sm font-medium text-dark-muted border-b border-dark-border">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-dark-muted">Loading teachers...</td>
                                </tr>
                            ) : filteredTeachers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-dark-muted">No teachers found.</td>
                                </tr>
                            ) : (
                                filteredTeachers.map(teacher => (
                                    <tr key={teacher.id} className="hover:bg-dark-bg/50 transition-colors">
                                        <td className="p-4 text-dark-text">#{teacher.id}</td>
                                        <td className="p-4 text-dark-text font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-teal-primary/20 flex items-center justify-center text-teal-primary font-bold overflow-hidden">
                                                    {teacher.photoUrl ? (
                                                        <img src={teacher.photoUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        teacher.teacherName?.charAt(0)
                                                    )}
                                                </div>
                                                {teacher.teacherName}
                                            </div>
                                        </td>
                                        <td className="p-4 text-dark-text">{teacher.designation}</td>
                                        <td className="p-4 text-dark-text">{teacher.mobile}</td>
                                        <td className="p-4 text-dark-text">{teacher.email}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDelete(teacher.id)}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
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
    );
};

export default TeacherList;
