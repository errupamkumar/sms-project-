-- ============================================
-- School Management System - Database Schema
-- Multi-Tenant: Schema-per-tenant approach
-- ============================================

-- Common Database: tenant_management
CREATE DATABASE IF NOT EXISTS tenant_management;

\c tenant_management;

-- School Tenant Table (Common)
CREATE TABLE IF NOT EXISTS schools (
    id BIGSERIAL PRIMARY KEY,
    school_code VARCHAR(20) UNIQUE NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    schema_name VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    contact_number VARCHAR(15),
    email VARCHAR(100),
    principal_name VARCHAR(100),
    established_year INTEGER,
    board VARCHAR(50), -- CBSE, ICSE, State Board
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TENANT SCHEMA TEMPLATE
-- Run this for each school tenant
-- Replace 'school_xyz' with actual schema name
-- ============================================

-- CREATE SCHEMA school_xyz;
-- SET search_path TO school_xyz;

-- ============================================
-- 1. USER MANAGEMENT & AUTHENTICATION
-- ============================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    mobile VARCHAR(15),
    user_type VARCHAR(20) NOT NULL, -- SUPER_ADMIN, ADMIN, STAFF, STUDENT, PARENT
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    permission_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    module VARCHAR(50)
);

CREATE TABLE role_permissions (
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- ============================================
-- 2. ACADEMIC MODULE
-- ============================================

CREATE TABLE academic_years (
    id BIGSERIAL PRIMARY KEY,
    year_name VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classes (
    id BIGSERIAL PRIMARY KEY,
    class_name VARCHAR(20) NOT NULL,
    class_numeric INTEGER NOT NULL,
    academic_year_id BIGINT REFERENCES academic_years(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (class_name, academic_year_id)
);

CREATE TABLE sections (
    id BIGSERIAL PRIMARY KEY,
    class_id BIGINT REFERENCES classes(id) ON DELETE CASCADE,
    section_name VARCHAR(10) NOT NULL,
    capacity INTEGER DEFAULT 40,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (class_id, section_name)
);

CREATE TABLE subjects (
    id BIGSERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    class_id BIGINT REFERENCES classes(id),
    total_marks INTEGER DEFAULT 100,
    passing_marks INTEGER DEFAULT 33,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_types (
    id BIGSERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL,
    weightage DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_names (
    id BIGSERIAL PRIMARY KEY,
    test_name VARCHAR(100) NOT NULL,
    test_type_id BIGINT REFERENCES test_types(id),
    academic_year_id BIGINT REFERENCES academic_years(id),
    scheduled_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_names (
    id BIGSERIAL PRIMARY KEY,
    content_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. STUDENT INFORMATION MODULE
-- ============================================

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE houses (
    id BIGSERIAL PRIMARY KEY,
    house_name VARCHAR(50) UNIQUE NOT NULL,
    house_color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    admission_number VARCHAR(20) UNIQUE NOT NULL,
    roll_number VARCHAR(20),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    blood_group VARCHAR(5),
    category_id BIGINT REFERENCES categories(id),
    house_id BIGINT REFERENCES houses(id),
    
    email VARCHAR(100),
    mobile VARCHAR(15),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10),
    
    father_name VARCHAR(100),
    father_occupation VARCHAR(100),
    father_mobile VARCHAR(15),
    mother_name VARCHAR(100),
    mother_occupation VARCHAR(100),
    mother_mobile VARCHAR(15),
    guardian_name VARCHAR(100),
    guardian_relation VARCHAR(50),
    guardian_mobile VARCHAR(15),
    
    current_class_id BIGINT REFERENCES classes(id),
    current_section_id BIGINT REFERENCES sections(id),
    admission_date DATE NOT NULL,
    academic_year_id BIGINT REFERENCES academic_years(id),
    
    previous_school TEXT,
    photo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_promotions (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    from_class_id BIGINT REFERENCES classes(id),
    from_section_id BIGINT REFERENCES sections(id),
    to_class_id BIGINT REFERENCES classes(id),
    to_section_id BIGINT REFERENCES sections(id),
    academic_year_id BIGINT REFERENCES academic_years(id),
    promotion_date DATE NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. FEES COLLECTION MODULE
-- ============================================

CREATE TABLE fee_master (
    id BIGSERIAL PRIMARY KEY,
    fee_name VARCHAR(100) NOT NULL,
    fee_code VARCHAR(20) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    class_id BIGINT REFERENCES classes(id),
    academic_year_id BIGINT REFERENCES academic_years(id),
    frequency VARCHAR(20),
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE late_fine_setup (
    id BIGSERIAL PRIMARY KEY,
    fee_master_id BIGINT REFERENCES fee_master(id) ON DELETE CASCADE,
    grace_period_days INTEGER DEFAULT 0,
    fine_type VARCHAR(20),
    fine_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fee_transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    fee_master_id BIGINT REFERENCES fee_master(id),
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    late_fine DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    payment_mode VARCHAR(20),
    payment_date DATE NOT NULL,
    receipt_number VARCHAR(50) UNIQUE,
    academic_year_id BIGINT REFERENCES academic_years(id),
    remarks TEXT,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE daily_collection_report (
    id BIGSERIAL PRIMARY KEY,
    report_date DATE NOT NULL,
    total_collections DECIMAL(12,2) NOT NULL,
    cash_collections DECIMAL(12,2) DEFAULT 0,
    online_collections DECIMAL(12,2) DEFAULT 0,
    cheque_collections DECIMAL(12,2) DEFAULT 0,
    card_collections DECIMAL(12,2) DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    generated_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (report_date)
);

CREATE TABLE fee_due_summary (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id BIGINT REFERENCES academic_years(id),
    total_fee_due DECIMAL(10,2) NOT NULL,
    total_paid DECIMAL(10,2) DEFAULT 0,
    total_outstanding DECIMAL(10,2) NOT NULL,
    last_payment_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. HUMAN RESOURCE MODULE
-- ============================================

CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    department_name VARCHAR(100) UNIQUE NOT NULL,
    department_code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE designations (
    id BIGSERIAL PRIMARY KEY,
    designation_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE staff (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    blood_group VARCHAR(5),
    
    email VARCHAR(100),
    mobile VARCHAR(15),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10),
    
    department_id BIGINT REFERENCES departments(id),
    designation_id BIGINT REFERENCES designations(id),
    date_of_joining DATE NOT NULL,
    employment_type VARCHAR(20),
    qualification VARCHAR(255),
    experience_years INTEGER,
    
    basic_salary DECIMAL(10,2),
    
    photo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE staff_attendance (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT REFERENCES staff(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    status VARCHAR(20),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (staff_id, attendance_date)
);

-- ============================================
-- 6. EXAMINATION MODULE
-- ============================================

CREATE TABLE exams (
    id BIGSERIAL PRIMARY KEY,
    exam_name VARCHAR(100) NOT NULL,
    test_type_id BIGINT REFERENCES test_types(id),
    class_id BIGINT REFERENCES classes(id),
    subject_id BIGINT REFERENCES subjects(id),
    academic_year_id BIGINT REFERENCES academic_years(id),
    exam_date DATE,
    total_marks INTEGER NOT NULL,
    passing_marks INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE marks (
    id BIGSERIAL PRIMARY KEY,
    exam_id BIGINT REFERENCES exams(id) ON DELETE CASCADE,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5,2) NOT NULL,
    is_absent BOOLEAN DEFAULT FALSE,
    remarks TEXT,
    entered_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (exam_id, student_id)
);

CREATE TABLE report_cards (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id BIGINT REFERENCES academic_years(id),
    class_id BIGINT REFERENCES classes(id),
    section_id BIGINT REFERENCES sections(id),
    test_type_id BIGINT REFERENCES test_types(id),
    total_marks_obtained DECIMAL(8,2),
    total_marks DECIMAL(8,2),
    percentage DECIMAL(5,2),
    grade VARCHAR(5),
    rank INTEGER,
    attendance_percentage DECIMAL(5,2),
    remarks TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pdf_url VARCHAR(255)
);

-- ============================================
-- 7. DOWNLOAD CENTER MODULE
-- ============================================

CREATE TABLE study_materials (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    class_id BIGINT REFERENCES classes(id),
    subject_id BIGINT REFERENCES subjects(id),
    content_name_id BIGINT REFERENCES content_names(id),
    file_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(20),
    file_size BIGINT,
    uploaded_by BIGINT REFERENCES users(id),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE assignments (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    class_id BIGINT REFERENCES classes(id),
    section_id BIGINT REFERENCES sections(id),
    subject_id BIGINT REFERENCES subjects(id),
    assigned_date DATE NOT NULL,
    due_date DATE NOT NULL,
    file_url VARCHAR(255),
    max_marks INTEGER,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assignment_submissions (
    id BIGSERIAL PRIMARY KEY,
    assignment_id BIGINT REFERENCES assignments(id) ON DELETE CASCADE,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_url VARCHAR(255),
    marks_obtained DECIMAL(5,2),
    feedback TEXT,
    reviewed_by BIGINT REFERENCES users(id),
    UNIQUE (assignment_id, student_id)
);

CREATE TABLE syllabus (
    id BIGSERIAL PRIMARY KEY,
    class_id BIGINT REFERENCES classes(id),
    subject_id BIGINT REFERENCES subjects(id),
    academic_year_id BIGINT REFERENCES academic_years(id),
    title VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    uploaded_by BIGINT REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. COMMUNICATION MODULE
-- ============================================

CREATE TABLE notices (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    notice_type VARCHAR(50),
    target_audience VARCHAR(50),
    class_id BIGINT REFERENCES classes(id),
    start_date DATE NOT NULL,
    end_date DATE,
    attachment_url VARCHAR(255),
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE notice_views (
    id BIGSERIAL PRIMARY KEY,
    notice_id BIGINT REFERENCES notices(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (notice_id, user_id)
);

-- ============================================
-- 9. TRANSPORT MODULE
-- ============================================

CREATE TABLE transport_routes (
    id BIGSERIAL PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    route_code VARCHAR(20) UNIQUE NOT NULL,
    starting_point VARCHAR(255),
    ending_point VARCHAR(255),
    total_distance DECIMAL(6,2),
    stops TEXT,
    monthly_fee DECIMAL(8,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    vehicle_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50),
    capacity INTEGER NOT NULL,
    registration_number VARCHAR(50),
    insurance_expiry DATE,
    fitness_expiry DATE,
    driver_id BIGINT REFERENCES staff(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicle_route_assignment (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles(id) ON DELETE CASCADE,
    route_id BIGINT REFERENCES transport_routes(id) ON DELETE CASCADE,
    assigned_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (vehicle_id, route_id)
);

CREATE TABLE student_transport (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
    route_id BIGINT REFERENCES transport_routes(id),
    pickup_point VARCHAR(255),
    academic_year_id BIGINT REFERENCES academic_years(id),
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- User & Authentication
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);

-- Students
CREATE INDEX idx_students_admission_number ON students(admission_number);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_class_section ON students(current_class_id, current_section_id);
CREATE INDEX idx_students_academic_year ON students(academic_year_id);

-- Fee Transactions
CREATE INDEX idx_fee_trans_student ON fee_transactions(student_id);
CREATE INDEX idx_fee_trans_date ON fee_transactions(payment_date);
CREATE INDEX idx_fee_trans_receipt ON fee_transactions(receipt_number);

-- Marks
CREATE INDEX idx_marks_exam ON marks(exam_id);
CREATE INDEX idx_marks_student ON marks(student_id);

-- Staff
CREATE INDEX idx_staff_employee_id ON staff(employee_id);
CREATE INDEX idx_staff_department ON staff(department_id);

-- Notices
CREATE INDEX idx_notices_dates ON notices(start_date, end_date);
CREATE INDEX idx_notices_active ON notices(is_active);

-- ============================================
-- SEED DATA (Optional)
-- ============================================

-- Default Roles
INSERT INTO roles (role_name, description) VALUES
('SUPER_ADMIN', 'Super Administrator with full system access'),
('ADMIN', 'School Administrator'),
('TEACHER', 'Teaching Staff'),
('ACCOUNTANT', 'Finance and Accounting Staff'),
('LIBRARIAN', 'Library Management Staff'),
('STUDENT', 'Student User'),
('PARENT', 'Parent/Guardian User');

-- Default Categories
INSERT INTO categories (category_name, description) VALUES
('General', 'General Category'),
('OBC', 'Other Backward Classes'),
('SC', 'Scheduled Caste'),
('ST', 'Scheduled Tribe');

-- Default Houses
INSERT INTO houses (house_name, house_color) VALUES
('Red House', '#EF4444'),
('Blue House', '#3B82F6'),
('Green House', '#10B981'),
('Yellow House', '#F59E0B');
