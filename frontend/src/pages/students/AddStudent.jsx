import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUpload, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import axios from 'axios';

const AddStudent = () => {
    const navigate = useNavigate();
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [categories, setCategories] = useState([]);
    const [houses, setHouses] = useState([]);

    const [formData, setFormData] = useState({
        // Basic Information
        admissionNumber: '',
        rollNumber: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'Male',
        bloodGroup: '',
        email: '',
        mobile: '',
        currentClassId: '',
        currentSectionId: '',
        academicSession: '2025-26',
        religion: '',
        caste: '',
        categoryId: '',
        houseId: '',
        admissionDate: new Date().toISOString().split('T')[0],
        asOnDate: new Date().toISOString().split('T')[0],
        photoUrl: '',

        // Parent/Guardian Information
        fatherName: '',
        fatherPhone: '',
        fatherOccupation: '',
        fatherPhoto: '',
        motherName: '',
        motherPhone: '',
        motherOccupation: '',
        motherPhoto: '',
        guardianIs: 'Father',
        guardianName: '',
        guardianRelation: '',
        guardianEmail: '',
        guardianPhoto: '',
        guardianMobile: '',
        guardianOccupation: '',
        guardianAddress: '',

        // Transport Details
        transportRoute: '',
        busFee: '',
        transportVehicle: '',

        // Address Details
        address: '',
        permanentAddress: '',
        isGuardianAddressCurrent: false,
        isPermanentAddressCurrent: false,

        // Miscellaneous Details
        bankAccountNumber: '',
        bankName: '',
        ifscCode: '',
        nationalId: '',
        localId: '',
        note: '',

        // Documents
        docTitle1: '',
        docUrl1: '',
        docTitle2: '',
        docUrl2: '',
        docTitle3: '',
        docUrl3: '',
        docTitle4: '',
        docUrl4: '',

        previousSchool: '',
        city: '',
        state: '',
        pincode: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
        fetchHouses();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8084/api/v1/categories');
            setCategories(response.data || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchHouses = async () => {
        try {
            const response = await axios.get('http://localhost:8084/api/v1/houses');
            setHouses(response.data || []);
        } catch (err) {
            console.error('Error fetching houses:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => {
            const newData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };

            // Auto-fill Guardian Relation if Guardian Is changes
            if (name === 'guardianIs') {
                newData.guardianRelation = value;
            }

            return newData;
        });
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

        // Map form fields to match backend expectations
        const payload = {
            ...formData,
            fatherMobile: formData.fatherPhone,
            motherMobile: formData.motherPhone,
            currentClassId: formData.currentClassId ? parseInt(formData.currentClassId) : null,
            currentSectionId: formData.currentSectionId ? parseInt(formData.currentSectionId) : null,
            categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
            houseId: formData.houseId ? parseInt(formData.houseId) : null,
            busFee: formData.busFee ? parseFloat(formData.busFee) : null,
        };

        // Remove empty strings
        Object.keys(payload).forEach(key => {
            if (payload[key] === '') payload[key] = null;
        });

        try {
            await axios.post('http://localhost:8084/api/v1/students', payload);
            alert('Student admitted successfully!');
            navigate('/students');
        } catch (err) {
            console.error('Error creating student:', err);
            let errorMessage = err.response?.data?.message || 'Failed to admit student.';
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                if (Array.isArray(errors)) {
                    errorMessage += ': ' + errors.map(e => e.defaultMessage || e.message).join(', ');
                } else if (typeof errors === 'object') {
                    errorMessage += ': ' + Object.values(errors).join(', ');
                }
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/students')}
                        className="p-2 text-dark-muted hover:text-teal-primary transition-colors"
                    >
                        <FiArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-dark-text">Student Admission</h1>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Student Information */}
                <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Row 1 */}
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Admission Number
                            </label>
                            <input
                                type="text"
                                name="admissionNumber"
                                value={formData.admissionNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                                placeholder="Auto-generated"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Class <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="currentClassId"
                                value={formData.currentClassId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            >
                                <option value="">Select</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(c => (
                                    <option key={c} value={c}>Class {c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Section <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="currentSectionId"
                                value={formData.currentSectionId}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            >
                                <option value="">Select</option>
                                <option value="1">Section A</option>
                                <option value="2">Section B</option>
                                <option value="3">Section C</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Session <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="academicSession"
                                value={formData.academicSession}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            >
                                <option value="2025-26">2025-26</option>
                                <option value="2024-25">2024-25</option>
                            </select>
                        </div>

                        {/* Row 2 */}
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
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

                        {/* Row 3 */}
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Category
                            </label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            >
                                <option value="">Select</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Religion
                            </label>
                            <input
                                type="text"
                                name="religion"
                                value={formData.religion}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Caste
                            </label>
                            <input
                                type="text"
                                name="caste"
                                value={formData.caste}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>

                        {/* Row 4 */}
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Admission Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="admissionDate"
                                value={formData.admissionDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Student Photo
                            </label>
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
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Blood Group
                            </label>
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

                        {/* Row 5 */}
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Student House
                            </label>
                            <select
                                name="houseId"
                                value={formData.houseId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            >
                                <option value="">Select</option>
                                {houses.map(house => (
                                    <option key={house.id} value={house.id}>{house.houseName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Roll Number
                            </label>
                            <input
                                type="text"
                                name="rollNumber"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                As on Date
                            </label>
                            <input
                                type="date"
                                name="asOnDate"
                                value={formData.asOnDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Parent Guardian Detail */}
                <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
                    <h2 className="text-xl font-bold text-dark-text mb-4">Parent Guardian Detail</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Father Details */}
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Father Name
                            </label>
                            <input
                                type="text"
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Father Phone
                            </label>
                            <input
                                type="tel"
                                name="fatherPhone"
                                value={formData.fatherPhone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Father Occupation
                            </label>
                            <input
                                type="text"
                                name="fatherOccupation"
                                value={formData.fatherOccupation}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Father Photo
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload('fatherPhoto')}
                                className="hidden"
                                id="fatherPhoto"
                            />
                            <label
                                htmlFor="fatherPhoto"
                                className="flex items-center justify-center w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-muted hover:border-teal-primary cursor-pointer transition-colors"
                            >
                                <FiUpload className="mr-2" />
                                {formData.fatherPhoto ? 'Selected' : 'Upload'}
                            </label>
                        </div>

                        {/* Mother Details */}
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Mother Name
                            </label>
                            <input
                                type="text"
                                name="motherName"
                                value={formData.motherName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Mother Phone
                            </label>
                            <input
                                type="tel"
                                name="motherPhone"
                                value={formData.motherPhone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Mother Occupation
                            </label>
                            <input
                                type="text"
                                name="motherOccupation"
                                value={formData.motherOccupation}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Mother Photo
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload('motherPhoto')}
                                className="hidden"
                                id="motherPhoto"
                            />
                            <label
                                htmlFor="motherPhoto"
                                className="flex items-center justify-center w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-muted hover:border-teal-primary cursor-pointer transition-colors"
                            >
                                <FiUpload className="mr-2" />
                                {formData.motherPhoto ? 'Selected' : 'Upload'}
                            </label>
                        </div>

                        {/* Guardian Selection */}
                        <div className="col-span-4">
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                If Guardian Is <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="guardianIs"
                                        value="Father"
                                        checked={formData.guardianIs === 'Father'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    <span className="text-dark-text">Father</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="guardianIs"
                                        value="Mother"
                                        checked={formData.guardianIs === 'Mother'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    <span className="text-dark-text">Mother</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="guardianIs"
                                        value="Other"
                                        checked={formData.guardianIs === 'Other'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    <span className="text-dark-text">Other</span>
                                </label>
                            </div>
                        </div>

                        {/* Guardian Details */}
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Guardian Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="guardianName"
                                value={formData.guardianName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Guardian Relation
                            </label>
                            <input
                                type="text"
                                name="guardianRelation"
                                value={formData.guardianRelation}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Guardian Email
                            </label>
                            <input
                                type="email"
                                name="guardianEmail"
                                value={formData.guardianEmail}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Guardian Photo
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload('guardianPhoto')}
                                className="hidden"
                                id="guardianPhoto"
                            />
                            <label
                                htmlFor="guardianPhoto"
                                className="flex items-center justify-center w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-muted hover:border-teal-primary cursor-pointer transition-colors"
                            >
                                <FiUpload className="mr-2" />
                                {formData.guardianPhoto ? 'Selected' : 'Upload'}
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Guardian Phone
                            </label>
                            <input
                                type="tel"
                                name="guardianMobile"
                                value={formData.guardianMobile}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Guardian Occupation
                            </label>
                            <input
                                type="text"
                                name="guardianOccupation"
                                value={formData.guardianOccupation}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Guardian Address
                            </label>
                            <input
                                type="text"
                                name="guardianAddress"
                                value={formData.guardianAddress}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Transport Details */}
                <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
                    <h2 className="text-xl font-bold text-dark-text mb-4">Transport Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Stoppage List
                            </label>
                            <select
                                name="transportRoute"
                                value={formData.transportRoute}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            >
                                <option value="">Select</option>
                                <option value="Route 1">Route 1</option>
                                <option value="Route 2">Route 2</option>
                                <option value="Route 3">Route 3</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Bus Fee
                            </label>
                            <input
                                type="number"
                                name="busFee"
                                value={formData.busFee}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-text mb-2">
                                Vehicle List
                            </label>
                            <select
                                name="transportVehicle"
                                value={formData.transportVehicle}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                            >
                                <option value="">Select</option>
                                <option value="Bus 1">Bus 1</option>
                                <option value="Bus 2">Bus 2</option>
                                <option value="Van 1">Van 1</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Add More Details (Collapsible) */}
                <div className="bg-dark-card rounded-xl border border-dark-border">
                    <button
                        type="button"
                        onClick={() => setShowMoreDetails(!showMoreDetails)}
                        className="w-full flex items-center justify-between p-6 text-dark-text hover:text-teal-primary transition-colors"
                    >
                        <span className="text-xl font-bold">Add More Details</span>
                        {showMoreDetails ? <FiChevronUp className="w-6 h-6" /> : <FiChevronDown className="w-6 h-6" />}
                    </button>

                    {showMoreDetails && (
                        <div className="px-6 pb-6 space-y-6">
                            {/* Student Address Details */}
                            <div>
                                <h3 className="text-lg font-semibold text-dark-text mb-4">Student Address Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                name="isGuardianAddressCurrent"
                                                checked={formData.isGuardianAddressCurrent}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-dark-text">If Guardian Address is Current Address</span>
                                        </label>
                                        <label className="block text-sm font-medium text-dark-text mb-2">
                                            Current Address
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                name="isPermanentAddressCurrent"
                                                checked={formData.isPermanentAddressCurrent}
                                                onChange={handleChange}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-dark-text">If Permanent Address is Current Address</span>
                                        </label>
                                        <label className="block text-sm font-medium text-dark-text mb-2">
                                            Permanent Address
                                        </label>
                                        <textarea
                                            name="permanentAddress"
                                            value={formData.permanentAddress}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Miscellaneous Details */}
                            <div>
                                <h3 className="text-lg font-semibold text-dark-text mb-4">Miscellaneous Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-dark-text mb-2">
                                            Bank Account Number
                                        </label>
                                        <input
                                            type="text"
                                            name="bankAccountNumber"
                                            value={formData.bankAccountNumber}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-text mb-2">
                                            Bank Name
                                        </label>
                                        <input
                                            type="text"
                                            name="bankName"
                                            value={formData.bankName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-text mb-2">
                                            IFSC Code
                                        </label>
                                        <input
                                            type="text"
                                            name="ifscCode"
                                            value={formData.ifscCode}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-text mb-2">
                                            National Identification Number
                                        </label>
                                        <input
                                            type="text"
                                            name="nationalId"
                                            value={formData.nationalId}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-text mb-2">
                                            Local Identification Number
                                        </label>
                                        <input
                                            type="text"
                                            name="localId"
                                            value={formData.localId}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-sm font-medium text-dark-text mb-2">
                                            Note
                                        </label>
                                        <textarea
                                            name="note"
                                            value={formData.note}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Upload Documents */}
                            <div>
                                <h3 className="text-lg font-semibold text-dark-text mb-4">Upload Documents</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map(num => (
                                        <div key={num} className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-sm font-medium text-dark-text mb-2">
                                                    {num}. Title
                                                </label>
                                                <input
                                                    type="text"
                                                    name={`docTitle${num}`}
                                                    value={formData[`docTitle${num}`]}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-teal-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-dark-text mb-2">
                                                    Documents
                                                </label>
                                                <input
                                                    type="file"
                                                    onChange={handleFileUpload(`docUrl${num}`)}
                                                    className="hidden"
                                                    id={`docUrl${num}`}
                                                />
                                                <label
                                                    htmlFor={`docUrl${num}`}
                                                    className="flex items-center justify-center w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-muted hover:border-teal-primary cursor-pointer transition-colors"
                                                >
                                                    <FiUpload className="mr-2" />
                                                    {formData[`docUrl${num}`] ? 'Selected' : 'Upload'}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3 bg-teal-primary hover:bg-teal-hover text-dark-bg font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiSave className="w-5 h-5" />
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStudent;
