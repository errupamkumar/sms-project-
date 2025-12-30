import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUpload } from 'react-icons/fi';
import axios from 'axios';

const AddTeacher = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        // Personal
        teacherName: '',
        dateOfBirth: '',
        gender: 'Male',
        bloodGroup: '',
        religion: '',
        caste: '',
        fatherName: '',
        motherName: '',
        spouseName: '',

        // Contact
        mobile: '',
        email: '',
        currentAddress: '',
        permanentAddress: '',
        city: '',
        state: '',
        pincode: '',

        // Professional
        qualification: '',
        experience: '', // number
        designation: '',
        joiningDate: new Date().toISOString().split('T')[0],
        salary: '', // number
        specialization: '',

        // Documents
        resumeUrl: '',
        joiningLetterUrl: '',
        govtIdUrl: '',
        photoUrl: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (fieldName) => (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [fieldName]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            ...formData,
            experience: formData.experience ? parseFloat(formData.experience) : null,
            salary: formData.salary ? parseFloat(formData.salary) : null,
        };

        // Remove empty strings
        Object.keys(payload).forEach(key => {
            if (payload[key] === '') payload[key] = null;
        });

        try {
            await axios.post('http://localhost:8084/api/teachers', payload);
            alert('Teacher added successfully!');
            navigate('/teachers');
        } catch (err) {
            console.error('Error adding teacher:', err);
            setError(err.response?.data?.message || 'Failed to add teacher.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/teachers')}
                        className="p-2 text-dark-muted hover:text-teal-primary transition-colors"
                    >
                        <FiArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-dark-text">Add Teacher</h1>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
                    <h2 className="text-xl font-bold text-dark-text mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Teacher Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="teacherName"
                                value={formData.teacherName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Blood Group</label>
                            <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            >
                                <option value="">Select</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Religion</label>
                            <input
                                type="text"
                                name="religion"
                                value={formData.religion}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Caste</label>
                            <input
                                type="text"
                                name="caste"
                                value={formData.caste}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Father's Name</label>
                            <input
                                type="text"
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Mother's Name</label>
                            <input
                                type="text"
                                name="motherName"
                                value={formData.motherName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Spouse Name</label>
                            <input
                                type="text"
                                name="spouseName"
                                value={formData.spouseName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
                    <h2 className="text-xl font-bold text-dark-text mb-4">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Pincode</label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-dark-text mb-2">Current Address</label>
                            <textarea
                                name="currentAddress"
                                value={formData.currentAddress}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-dark-text mb-2">Permanent Address</label>
                            <textarea
                                name="permanentAddress"
                                value={formData.permanentAddress}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Information */}
                <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
                    <h2 className="text-xl font-bold text-dark-text mb-4">Professional Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Designation <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Joining Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="joiningDate"
                                value={formData.joiningDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Qualification</label>
                            <input
                                type="text"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Experience (Years)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Salary</label>
                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Specialization</label>
                            <input
                                type="text"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Documents */}
                <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
                    <h2 className="text-xl font-bold text-dark-text mb-4">Documents</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Profile Photo</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload('photoUrl')}
                                    className="hidden"
                                    id="photoUrl"
                                />
                                <label
                                    htmlFor="photoUrl"
                                    className="flex items-center justify-center w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-muted hover:border-teal-primary cursor-pointer transition-colors"
                                >
                                    <FiUpload className="mr-2" />
                                    {formData.photoUrl ? 'Photo Selected' : 'Upload Photo'}
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Resume</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    onChange={handleFileUpload('resumeUrl')}
                                    className="hidden"
                                    id="resumeUrl"
                                />
                                <label
                                    htmlFor="resumeUrl"
                                    className="flex items-center justify-center w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-muted hover:border-teal-primary cursor-pointer transition-colors"
                                >
                                    <FiUpload className="mr-2" />
                                    {formData.resumeUrl ? 'File Selected' : 'Upload Resume'}
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Joining Letter</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    onChange={handleFileUpload('joiningLetterUrl')}
                                    className="hidden"
                                    id="joiningLetterUrl"
                                />
                                <label
                                    htmlFor="joiningLetterUrl"
                                    className="flex items-center justify-center w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-muted hover:border-teal-primary cursor-pointer transition-colors"
                                >
                                    <FiUpload className="mr-2" />
                                    {formData.joiningLetterUrl ? 'File Selected' : 'Upload Joining Letter'}
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">Government ID</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    onChange={handleFileUpload('govtIdUrl')}
                                    className="hidden"
                                    id="govtIdUrl"
                                />
                                <label
                                    htmlFor="govtIdUrl"
                                    className="flex items-center justify-center w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-muted hover:border-teal-primary cursor-pointer transition-colors"
                                >
                                    <FiUpload className="mr-2" />
                                    {formData.govtIdUrl ? 'File Selected' : 'Upload ID'}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3 bg-teal-primary hover:bg-teal-hover text-dark-bg font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiSave className="w-5 h-5" />
                        {loading ? 'Saving...' : 'Save Teacher'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTeacher;
