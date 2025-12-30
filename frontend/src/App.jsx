import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import StudentList from './pages/students/StudentList';
import AddStudent from './pages/students/AddStudent';
import ExcelUpload from './pages/students/ExcelUpload';
import PromoteStudent from './pages/students/PromoteStudent';
import ClassManager from './pages/academics/ClassManager';
import TeacherList from './pages/teachers/TeacherList';
import AddTeacher from './pages/teachers/AddTeacher';
import AddMarks from './pages/examination/AddMarks';
import ReportCard from './pages/examination/ReportCard';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import ExamSchedule from './pages/academics/ExamSchedule';
import ResultManagement from './pages/examination/ResultManagement';
import TestTypes from './pages/academics/TestTypes';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="students" element={<StudentList />} />
              <Route path="students/add" element={<AddStudent />} />
              <Route path="students/excel-upload" element={<ExcelUpload />} />
              <Route path="students/promote" element={<PromoteStudent />} />
              <Route path="students/promote" element={<PromoteStudent />} />
              <Route path="teachers" element={<TeacherList />} />
              <Route path="teachers/add" element={<AddTeacher />} />
              <Route path="academics/classes" element={<ClassManager />} />
              <Route path="academics/test-types" element={<TestTypes />} />
              <Route path="academics/exam-schedule" element={<ExamSchedule />} />
              <Route path="examination/add-marks" element={<AddMarks />} />
              <Route path="examination/report-cards" element={<ReportCard />} />
              <Route path="examination/result-management" element={<ResultManagement />} />
              <Route path="profile" element={<Profile />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
