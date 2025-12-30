import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiUser, FiSearch, FiLogOut, FiSettings, FiMoon, FiSun } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [user, setUser] = useState({ name: 'Admin User', role: 'Super Admin', avatar: '' });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('userProfile');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Theme Init
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setIsDarkMode(false);
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if (isDarkMode) {
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    };

    const handleLogout = () => {
        alert("Signed out successfully");
        navigate('/login');
    };

    return (
        <header className="h-16 bg-dark-card border-b border-dark-border flex items-center justify-between px-6 z-20 relative transition-colors duration-300">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search students, staff, or records..."
                        className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2 text-sm text-dark-text placeholder-gray-400 focus:outline-none focus:border-teal-primary transition-colors"
                    />
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 text-gray-400 hover:text-teal-primary transition-colors"
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>

                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-teal-primary transition-colors">
                    <FiBell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Profile */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 pl-4 border-l border-dark-border hover:bg-dark-bg/50 p-2 rounded-lg transition-colors"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-dark-text">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.role}</p>
                        </div>
                        <div className="w-10 h-10 bg-teal-primary rounded-full flex items-center justify-center overflow-hidden border-2 border-dark-card">
                            {user.avatar ? (
                                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <FiUser className="w-5 h-5 text-dark-bg" />
                            )}
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-xl py-1 overflow-hidden animate-in fade-in zoom-in duration-200">
                            <Link
                                to="/profile"
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-dark-bg hover:text-white transition-colors"
                            >
                                <FiSettings className="w-4 h-4" />
                                My Profile
                            </Link>
                            <div className="border-t border-dark-border my-1"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
                            >
                                <FiLogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
