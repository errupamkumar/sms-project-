import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiCamera, FiSave, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState({
        name: 'Admin User',
        email: 'admin@school.com',
        role: 'Super Admin',
        avatar: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        localStorage.setItem('userProfile', JSON.stringify(profile));
        setIsEditing(false);
        alert('Profile updated successfully!');
        // Trigger specific event or reload to update Header? 
        // Window reload is simplest to ensure Header updates.
        window.location.reload();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">User Profile</h1>

            <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
                <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar Section */}
                        <div className="w-full md:w-auto flex flex-col items-center gap-4">
                            <div className="relative w-32 h-32 rounded-full bg-dark-bg border-4 border-dark-border overflow-hidden flex items-center justify-center group">
                                {profile.avatar ? (
                                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <FiUser className="w-12 h-12 text-gray-400" />
                                )}
                                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <FiCamera className="w-8 h-8 text-white" />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                            </div>
                            <p className="text-sm text-gray-400">Click to change photo</p>
                        </div>

                        {/* Details Section */}
                        <div className="flex-1 w-full">
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                                        <div className="relative">
                                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={profile.name}
                                                onChange={handleChange}
                                                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-teal-primary transition-colors"
                                                placeholder="Enter full name"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                                        <div className="relative">
                                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={profile.email}
                                                onChange={handleChange}
                                                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-teal-primary transition-colors"
                                                placeholder="Enter email"
                                            />
                                        </div>
                                    </div>

                                    {/* Role (Read Only) */}
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Role</label>
                                        <input
                                            type="text"
                                            name="role"
                                            value={profile.role}
                                            readOnly
                                            className="w-full bg-dark-bg/50 border border-dark-border rounded-lg px-4 py-3 text-gray-400 select-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-teal-primary hover:bg-teal-hover text-dark-bg font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-teal-primary/20"
                                    >
                                        <FiSave className="w-5 h-5" />
                                        Save Changes
                                    </button>
                                </div>

                                <div className="pt-2 border-t border-dark-border mt-4">
                                    <h3 className="text-lg font-bold text-white mb-4">Security</h3>
                                    <Link
                                        to="/change-password"
                                        className="inline-flex items-center gap-2 text-teal-primary hover:text-teal-hover font-medium transition-colors"
                                    >
                                        <FiLock className="w-4 h-4" />
                                        Change Password
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
