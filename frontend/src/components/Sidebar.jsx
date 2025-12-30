import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiUsers,
    FiBook,
    FiDollarSign,
    FiFileText,
    FiUserCheck,
    FiDownload,
    FiBell,
    FiTruck,
    FiChevronDown,
    FiChevronRight,
} from 'react-icons/fi';

const Sidebar = () => {
    const location = useLocation();
    const [expandedMenus, setExpandedMenus] = useState(['students']);

    const toggleMenu = (menu) => {
        setExpandedMenus(prev =>
            prev.includes(menu)
                ? prev.filter(m => m !== menu)
                : [...prev, menu]
        );
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FiHome, path: '/' },
        {
            id: 'students',
            label: 'Student Information',
            icon: FiUsers,
            children: [
                { label: 'Student List', path: '/students' },
                { label: 'Student Admission', path: '/students/add' },
                { label: 'Categories', path: '/students/categories' },
                { label: 'Houses', path: '/students/houses' },
                { label: 'Excel Upload', path: '/students/excel-upload' },
                { label: 'Promote Student', path: '/students/promote' },
            ],
        },
        {
            id: 'teachers',
            label: 'Teacher Information',
            icon: FiUsers,
            children: [
                { label: 'Teacher List', path: '/teachers' },
                { label: 'Add Teacher', path: '/teachers/add' },
            ],
        },
        {
            id: 'academics',
            label: 'Academics',
            icon: FiBook,
            children: [
                { label: 'Classes', path: '/academics/classes' },
                { label: 'Sections', path: '/academics/sections' },
                { label: 'Subjects', path: '/academics/subjects' },
                { label: 'Test Types', path: '/academics/test-types' },
                { label: 'Exam Schedule', path: '/academics/exam-schedule' },
            ],
        },
        {
            id: 'fees',
            label: 'Fees Collection',
            icon: FiDollarSign,
            children: [
                { label: 'Collect Fees', path: '/fees/collect' },
                { label: 'Fee Receipts', path: '/fees/receipts' },
                { label: 'Due List', path: '/fees/due-list' },
                { label: 'Fee Master', path: '/fees/master' },
                { label: 'Late Fine Setup', path: '/fees/late-fine' },
            ],
        },
        {
            id: 'examination',
            label: 'Examination',
            icon: FiFileText,
            children: [
                { label: 'Add Marks', path: '/examination/add-marks' },
                { label: 'Report Cards', path: '/examination/report-cards' },
                { label: 'Result Management', path: '/examination/result-management' },
            ],
        },
        {
            id: 'hr',
            label: 'Human Resource',
            icon: FiUserCheck,
            children: [
                { label: 'Staff Directory', path: '/hr/staff' },
                { label: 'Departments', path: '/hr/departments' },
                { label: 'Designations', path: '/hr/designations' },
            ],
        },
        {
            id: 'download',
            label: 'Download Center',
            icon: FiDownload,
            children: [
                { label: 'Study Materials', path: '/download/materials' },
                { label: 'Assignments', path: '/download/assignments' },
                { label: 'Syllabus', path: '/download/syllabus' },
            ],
        },
        {
            id: 'communication',
            label: 'Communication',
            icon: FiBell,
            children: [
                { label: 'Notice Board', path: '/communication/notices' },
                { label: 'Create Notice', path: '/communication/create-notice' },
            ],
        },
        {
            id: 'transport',
            label: 'Transport',
            icon: FiTruck,
            children: [
                { label: 'Routes', path: '/transport/routes' },
                { label: 'Vehicles', path: '/transport/vehicles' },
                { label: 'Assign Vehicle', path: '/transport/assign' },
            ],
        },
    ];

    return (
        <aside className="w-64 bg-dark-card border-r border-dark-border flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-dark-border">
                <h1 className="text-2xl font-bold text-teal-primary">SMS</h1>
                <p className="text-xs text-gray-400 mt-1">School Management System</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                {menuItems.map((item) => (
                    <div key={item.id}>
                        {item.children ? (
                            <div>
                                <button
                                    onClick={() => toggleMenu(item.id)}
                                    className="w-full flex items-center justify-between px-6 py-3 text-dark-muted hover:bg-dark-bg hover:text-teal-primary transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-5 h-5" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </div>
                                    {expandedMenus.includes(item.id) ? (
                                        <FiChevronDown className="w-4 h-4" />
                                    ) : (
                                        <FiChevronRight className="w-4 h-4" />
                                    )}
                                </button>

                                {expandedMenus.includes(item.id) && (
                                    <div className="bg-dark-bg">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.path}
                                                to={child.path}
                                                className={`block px-14 py-2.5 text-sm transition-colors ${location.pathname === child.path
                                                    ? 'text-teal-primary bg-teal-primary/10 border-l-2 border-teal-primary'
                                                    : 'text-dark-muted hover:text-teal-primary hover:bg-dark-card'
                                                    }`}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 px-6 py-3 transition-colors ${location.pathname === item.path
                                    ? 'text-teal-primary bg-dark-bg border-l-2 border-teal-primary'
                                    : 'text-dark-muted hover:bg-dark-bg hover:text-teal-primary'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
