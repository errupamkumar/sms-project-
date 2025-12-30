import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiSearch, FiFileText } from 'react-icons/fi';

const ResultManagement = () => {
    const [exams, setExams] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const res = await axios.get('http://localhost:8084/api/v1/examination/exams');
            setExams(res.data);
        } catch (error) {
            console.error("Error fetching exams:", error);
        }
    };

    const handleRelease = async (exam) => {
        if (!window.confirm(`Are you sure you want to release results for ${exam.examName}? This will notify all students.`)) return;

        try {
            await axios.post(`http://localhost:8084/api/v1/examination/${exam.id}/publish-result`);
            setMessage({ type: 'success', text: `Results for ${exam.examName} released successfully!` });
            fetchExams(); // Refresh to update status
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Error releasing result:", error);
            setMessage({ type: 'error', text: 'Failed to release results.' });
        }
    };

    const filteredExams = exams.filter(e =>
        e.examName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Result Management</h1>
                    <p className="text-dark-muted text-sm">Release exam results to students.</p>
                </div>

                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
                    <input
                        type="text"
                        placeholder="Search exams..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-dark-card border border-dark-border rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-teal-primary transition-colors w-64"
                    />
                </div>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExams.map(exam => (
                    <div key={exam.id} className="bg-dark-card rounded-lg border border-dark-border p-6 hover:border-teal-primary/50 transition-colors shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-teal-primary/10 rounded-lg text-teal-primary">
                                <FiFileText className="w-6 h-6" />
                            </div>
                            <span className={`text-xs px-2 py-1 rounded border ${exam.isResultPublished
                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                {exam.isResultPublished ? 'PUBLISHED' : 'DRAFT'}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">{exam.examName}</h3>
                        <p className="text-dark-muted text-sm mb-6">Session: {exam.session}</p>

                        {!exam.isResultPublished ? (
                            <button
                                onClick={() => handleRelease(exam)}
                                className="w-full bg-teal-primary hover:bg-teal-600 text-white font-medium py-2 px-4 rounded transition-colors shadow-lg shadow-teal-primary/20 flex items-center justify-center gap-2"
                            >
                                <FiCheckCircle className="w-4 h-4" /> Release Results
                            </button>
                        ) : (
                            <button
                                disabled
                                className="w-full bg-dark-bg border border-dark-border text-dark-muted font-medium py-2 px-4 rounded cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FiCheckCircle className="w-4 h-4" /> Already Released
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {filteredExams.length === 0 && (
                <div className="text-center py-12 text-dark-muted">
                    No exams found matching your search.
                </div>
            )}
        </div>
    );
};

export default ResultManagement;
