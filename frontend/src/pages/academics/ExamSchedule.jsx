import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCalendar, FiClock, FiMapPin, FiBell, FiSearch } from 'react-icons/fi';

const ExamSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [exams, setExams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        examId: '',
        classId: '',
        subjectId: '',
        examDate: '',
        startTime: '',
        endTime: '',
        roomNo: ''
    });

    const [message, setMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch Exams
            try {
                const examRes = await axios.get('http://localhost:8084/api/v1/examination/exams');
                setExams(examRes.data);
            } catch (e) {
                console.error("Failed to load exams", e);
                setMessage({ type: 'error', text: 'Failed to load exams.' });
            }

            // Fetch Classes
            try {
                const classRes = await axios.get('http://localhost:8084/api/school-classes');
                setClasses(classRes.data);
            } catch (e) {
                console.error("Failed to load classes", e);
                setMessage({ type: 'error', text: 'Failed to load classes.' });
            }

            // Fetch Subjects
            try {
                const subjectRes = await axios.get('http://localhost:8084/api/v1/examination/subjects');
                setSubjects(subjectRes.data);
            } catch (e) {
                console.error("Failed to load subjects", e);
            }

            // Fetch Schedules
            try {
                const scheduleRes = await axios.get('http://localhost:8084/api/v1/exam-schedule');
                setSchedules(scheduleRes.data);
            } catch (e) {
                console.error("Failed to load schedules", e);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            setMessage({ type: 'error', text: 'Failed to load initial data.' });
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
            await axios.post('http://localhost:8084/api/v1/exam-schedule', formData);
            setMessage({ type: 'success', text: 'Exam Scheduled Successfully!' });
            fetchData(); // Refresh list

            // Reset crucial fields, keep exam/class maybe?
            setFormData({ ...formData, subjectId: '', examDate: '', startTime: '', endTime: '', roomNo: '' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Error saving schedule:", error);
            setMessage({ type: 'error', text: 'Failed to schedule exam.' });
        }
    };

    const handlePublish = async (examId) => {
        try {
            await axios.post(`http://localhost:8084/api/v1/exam-schedule/${examId}/publish`);
            setMessage({ type: 'success', text: 'Schedule Published & Students Notified!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Error publishing schedule:", error);
            setMessage({ type: 'error', text: 'Failed to publish schedule.' });
        }
    };

    const filteredSchedules = schedules.filter(sch =>
        (sch.exam?.examName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sch.schoolClass?.className || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
            {/* Left - Form */}
            <div className="w-full lg:w-1/3 bg-dark-card p-6 rounded-lg shadow-lg border border-dark-border h-fit">
                <h2 className="text-xl font-bold text-white mb-6 border-b border-dark-border pb-2">
                    Schedule Exam
                </h2>

                {message && (
                    <div className={`p-3 mb-4 rounded text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-1">Examination</label>
                        <select
                            name="examId"
                            value={formData.examId}
                            onChange={handleInputChange}
                            className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:outline-none focus:border-teal-primary transition-colors"
                            required
                        >
                            <option value="">Select Exam</option>
                            {exams.map(e => <option key={e.id} value={e.id}>{e.examName} ({e.session})</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-1">Class</label>
                        <select
                            name="classId"
                            value={formData.classId}
                            onChange={handleInputChange}
                            className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:outline-none focus:border-teal-primary transition-colors"
                            required
                        >
                            <option value="">Select Class</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.className}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-1">Subject</label>
                        <select
                            name="subjectId"
                            value={formData.subjectId}
                            onChange={handleInputChange}
                            className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:outline-none focus:border-teal-primary transition-colors"
                            required
                        >
                            <option value="">Select Subject</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.subjectName}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-1">Date</label>
                        <input
                            type="date"
                            name="examDate"
                            value={formData.examDate}
                            onChange={handleInputChange}
                            className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:outline-none focus:border-teal-primary transition-colors text-sm"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-1">Start Time</label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:outline-none focus:border-teal-primary transition-colors text-sm"
                                required
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
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-muted mb-1">Room No</label>
                        <input
                            type="text"
                            name="roomNo"
                            value={formData.roomNo}
                            onChange={handleInputChange}
                            className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:outline-none focus:border-teal-primary transition-colors"
                            placeholder="e.g. 101"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-teal-primary hover:bg-teal-600 text-white font-medium py-2 px-4 rounded transition-colors shadow-lg shadow-teal-primary/20 flex items-center justify-center gap-2"
                    >
                        <FiCalendar className="w-4 h-4" /> Schedule Exam
                    </button>
                </form>
            </div>

            {/* Right - List */}
            <div className="w-full lg:w-2/3 bg-dark-card rounded-lg shadow-lg border border-dark-border flex flex-col">
                <div className="p-6 border-b border-dark-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-bold text-white">Scheduled Exams</h2>
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
                        <input
                            type="text"
                            placeholder="Search exams, classes..."
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
                                    <th className="py-3 px-4 text-dark-muted font-medium text-sm">Exam</th>
                                    <th className="py-3 px-4 text-dark-muted font-medium text-sm">Class</th>
                                    <th className="py-3 px-4 text-dark-muted font-medium text-sm">Subject</th>
                                    <th className="py-3 px-4 text-dark-muted font-medium text-sm">Date/Time</th>
                                    <th className="py-3 px-4 text-dark-muted font-medium text-sm">Room</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {filteredSchedules.map(sch => (
                                    <tr key={sch.id} className="hover:bg-dark-bg/50 transition-colors">
                                        <td className="py-3 px-4 text-white font-medium">{sch.exam?.examName}</td>
                                        <td className="py-3 px-4 text-gray-300 text-sm">{sch.schoolClass?.className}</td>
                                        <td className="py-3 px-4 text-gray-300 text-sm">{sch.subject?.subjectName}</td>
                                        <td className="py-3 px-4 text-gray-300 text-sm">
                                            <div className="flex flex-col">
                                                <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3" /> {sch.examDate}</span>
                                                <span className="flex items-center gap-1 text-xs text-dark-muted"><FiClock className="w-3 h-3" /> {sch.startTime} - {sch.endTime}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-300 text-sm flex items-center gap-1">
                                            <FiMapPin className="w-3 h-3 text-dark-muted" /> {sch.roomNo}
                                        </td>
                                    </tr>
                                ))}
                                {filteredSchedules.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-dark-muted text-sm">No schedules found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Action Area: Publish entire exam schedule */}
                    {exams.length > 0 && (
                        <div className="mt-8 p-4 bg-dark-bg/50 rounded-lg border border-dark-border">
                            <h3 className="text-sm font-medium text-white mb-3">Quick Actions</h3>
                            <div className="flex flex-wrap gap-2">
                                {exams.map(e => (
                                    <button
                                        key={e.id}
                                        onClick={() => handlePublish(e.id)}
                                        className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded text-sm transition-colors border border-blue-500/20"
                                        title={`Notify students about ${e.examName} schedule`}
                                    >
                                        <FiBell className="w-4 h-4" /> Notify {e.examName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamSchedule;
