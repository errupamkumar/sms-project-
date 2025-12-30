import React, { useState } from 'react';
import { FiDownload, FiUploadCloud, FiFileText, FiCheckCircle, FiAlertTriangle, FiDatabase } from 'react-icons/fi';
import axios from 'axios';

const ExcelUpload = () => {
    const [formData, setFormData] = useState({
        session: '2025-26',
        classId: '',
        sectionId: '',
        file: null
    });
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFormData({ ...formData, file: e.dataTransfer.files[0] });
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, file: e.target.files[0] });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.classId || !formData.sectionId || !formData.file) {
            setError("Please fill all required fields and select a file.");
            return;
        }

        const data = new FormData();
        data.append('file', formData.file);
        data.append('classId', formData.classId);
        data.append('sectionId', formData.sectionId);
        data.append('academicSession', formData.session);

        setUploading(true);
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:8084/api/v1/students/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage(response.data);
            setFormData({ ...formData, file: null }); // Clear file after success
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-3">
                    <FiDatabase className="text-teal-400" />
                    Bulk Student Upload
                </h1>
                <p className="text-gray-400 mt-2 text-sm max-w-2xl mx-auto">
                    Import multiple student records instantly by uploading a pre-formatted Excel file. Follow the steps below for a smooth import process.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel: Instructions & Template */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-teal-900 to-gray-900 rounded-xl shadow-xl border border-teal-800/30 p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <FiFileText size={120} />
                        </div>
                        <h2 className="font-bold text-lg mb-4 text-teal-300"> Step 1: Get Template</h2>
                        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                            Download the official Excel template. Do not change the header columns to ensure data integrity.
                        </p>
                        <a
                            href="/student_upload_template.xlsx"
                            download="student_upload_template.xlsx"
                            className="block w-full text-center bg-white text-teal-900 font-bold py-3 rounded-lg hover:bg-teal-50 transition-colors shadow-md flex items-center justify-center gap-2"
                        >
                            <FiDownload /> Download Template
                        </a>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <FiAlertTriangle className="text-orange-500" />
                            Important Notes
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                            <li>Date format should be <b>YYYY-MM-DD</b>.</li>
                            <li>Ensure unique Roll Numbers for the session.</li>
                            <li>Required fields are marked with *.</li>
                            <li>Max file size is 10MB.</li>
                        </ul>
                    </div>
                </div>

                {/* Right Panel: Upload Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800">Step 2: Upload Data</h2>
                        </div>
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Session</label>
                                        <select
                                            name="session"
                                            value={formData.session}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 outline-none block p-2.5"
                                        >
                                            <option value="2025-26">2025-26</option>
                                            <option value="2024-25">2024-25</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Class</label>
                                        <select
                                            name="classId"
                                            value={formData.classId}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 outline-none block p-2.5"
                                        >
                                            <option value="">Select</option>
                                            {[...Array(12)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Section</label>
                                        <select
                                            name="sectionId"
                                            value={formData.sectionId}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 outline-none block p-2.5"
                                        >
                                            <option value="">Select</option>
                                            <option value="1">Section A</option>
                                            <option value="2">Section B</option>
                                            <option value="3">Section C</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Excel File</label>
                                    <div
                                        className={`
                                            border-2 border-dashed rounded-xl px-6 py-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200
                                            ${dragging
                                                ? 'border-teal-500 bg-teal-50 scale-[1.02]'
                                                : formData.file
                                                    ? 'border-teal-500 bg-teal-50/30'
                                                    : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'}
                                        `}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById('fileInput').click()}
                                    >
                                        <input
                                            id="fileInput"
                                            type="file"
                                            accept=".xlsx, .xls"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />

                                        {formData.file ? (
                                            <div className="text-center animate-pulse">
                                                <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <FiFileText className="text-3xl" />
                                                </div>
                                                <p className="text-gray-800 font-medium truncate max-w-xs">{formData.file.name}</p>
                                                <p className="text-xs text-teal-600 font-semibold mt-1">Click to change</p>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-teal-100 group-hover:text-teal-500 transition-colors">
                                                    <FiUploadCloud className="text-3xl" />
                                                </div>
                                                <p className="text-gray-600 font-medium">Drag & Drop your Excel file here</p>
                                                <p className="text-xs text-gray-400 mt-2">or click to browse</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Status Messages */}
                                {message && (
                                    <div className="p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3 text-green-700">
                                        <FiCheckCircle className="flex-shrink-0 text-lg mt-0.5" />
                                        <span className="text-sm">{message}</span>
                                    </div>
                                )}
                                {error && (
                                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-red-700">
                                        <FiAlertTriangle className="flex-shrink-0 text-lg mt-0.5" />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className={`
                                            w-full py-3.5 rounded-lg font-bold shadow-lg text-white transition-all duration-200
                                            ${uploading
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-teal-600 hover:bg-teal-700 hover:shadow-xl transform hover:-translate-y-0.5'}
                                        `}
                                    >
                                        {uploading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Processing File...
                                            </span>
                                        ) : (
                                            'Upload and Import Students'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExcelUpload;
