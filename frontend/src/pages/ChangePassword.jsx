import React, { useState } from 'react';
import { FiLock, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert("New passwords do not match!");
            return;
        }
        if (passwords.new.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        // Mock API Call or LocalStorage update if we stored password
        // Since we don't have real Auth backend active, we verify logic and mock success.
        console.log("Password changed to:", passwords.new);

        alert("Password changed successfully!");
        navigate('/profile');
    };

    return (
        <div className="max-w-xl mx-auto mt-10">
            <h1 className="text-3xl font-bold text-white mb-8">Change Password</h1>

            <div className="bg-dark-card rounded-xl border border-dark-border p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="current"
                                value={passwords.current}
                                onChange={handleChange}
                                required
                                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-10 py-3 text-white focus:outline-none focus:border-teal-primary transition-colors"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">New Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="new"
                                value={passwords.new}
                                onChange={handleChange}
                                required
                                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-teal-primary transition-colors"
                                placeholder="Enter new password"
                            />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="confirm"
                                value={passwords.confirm}
                                onChange={handleChange}
                                required
                                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-teal-primary transition-colors"
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="text-gray-400 hover:text-white px-4 py-2 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-teal-primary hover:bg-teal-hover text-dark-bg font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-teal-primary/20"
                        >
                            <FiSave className="w-5 h-5" />
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
