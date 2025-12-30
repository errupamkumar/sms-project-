-- Categories
INSERT INTO categories (category_name) SELECT 'GEN' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE category_name = 'GEN');
INSERT INTO categories (category_name) SELECT 'SC' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE category_name = 'SC');
INSERT INTO categories (category_name) SELECT 'ST' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE category_name = 'ST');
INSERT INTO categories (category_name) SELECT 'OBC' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE category_name = 'OBC');
INSERT INTO categories (category_name) SELECT 'EWS' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE category_name = 'EWS');
INSERT INTO categories (category_name) SELECT 'BC(I)' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE category_name = 'BC(I)');
INSERT INTO categories (category_name) SELECT 'BC(II)' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE category_name = 'BC(II)');

-- Houses
INSERT INTO houses (house_name, house_color) SELECT 'Red House', '#EF4444' WHERE NOT EXISTS (SELECT 1 FROM houses WHERE house_name = 'Red House');
INSERT INTO houses (house_name, house_color) SELECT 'Green House', '#10B981' WHERE NOT EXISTS (SELECT 1 FROM houses WHERE house_name = 'Green House');
INSERT INTO houses (house_name, house_color) SELECT 'Orange House', '#F97316' WHERE NOT EXISTS (SELECT 1 FROM houses WHERE house_name = 'Orange House');
INSERT INTO houses (house_name, house_color) SELECT 'Yellow House', '#F59E0B' WHERE NOT EXISTS (SELECT 1 FROM houses WHERE house_name = 'Yellow House');

-- School Classes (Class 1 to 12)
INSERT INTO school_classes (class_name) SELECT 'Class 1' WHERE NOT EXISTS (SELECT 1 FROM school_classes WHERE class_name = 'Class 1');
INSERT INTO school_classes (class_name) SELECT 'Class 2' WHERE NOT EXISTS (SELECT 1 FROM school_classes WHERE class_name = 'Class 2');
INSERT INTO school_classes (class_name) SELECT 'Class 3' WHERE NOT EXISTS (SELECT 1 FROM school_classes WHERE class_name = 'Class 3');
INSERT INTO school_classes (class_name) SELECT 'Class 4' WHERE NOT EXISTS (SELECT 1 FROM school_classes WHERE class_name = 'Class 4');
INSERT INTO school_classes (class_name) SELECT 'Class 5' WHERE NOT EXISTS (SELECT 1 FROM school_classes WHERE class_name = 'Class 5');
INSERT INTO school_classes (class_name) SELECT 'Class 6' WHERE NOT EXISTS (SELECT 1 FROM school_classes WHERE class_name = 'Class 6');
INSERT INTO school_classes (class_name) SELECT 'Class 7' WHERE NOT EXISTS (SELECT 1 FROM school_classes WHERE class_name = 'Class 7');
INSERT INTO school_classes (class_name) SELECT 'Class 8' WHERE NOT EXISTS (SELECT 1 FROM school_classes WHERE class_name = 'Class 8');
INSERT INTO school_classes (class_name) SELECT 'Class 9' WHERE NOT EXISTS (SELECT 1 FROM school_classes WHERE class_name = 'Class 9');
INSERT INTO school_classes (class_name) SELECT 'Class 10' WHERE NOT EXISTS (SELECT 1 FROM school_classes WHERE class_name = 'Class 10');
INSERT INTO school_classes (class_name) SELECT 'Class 11' WHERE NOT EXISTS (SELECT 1 FROM school_classes WHERE class_name = 'Class 11');
INSERT INTO school_classes (class_name) SELECT 'Class 12' WHERE NOT EXISTS (SELECT 1 FROM school_classes WHERE class_name = 'Class 12');

-- Sections
INSERT INTO sections (section_name) SELECT 'A' WHERE NOT EXISTS (SELECT 1 FROM sections WHERE section_name = 'A');
INSERT INTO sections (section_name) SELECT 'B' WHERE NOT EXISTS (SELECT 1 FROM sections WHERE section_name = 'B');
INSERT INTO sections (section_name) SELECT 'C' WHERE NOT EXISTS (SELECT 1 FROM sections WHERE section_name = 'C');
INSERT INTO sections (section_name) SELECT 'D' WHERE NOT EXISTS (SELECT 1 FROM sections WHERE section_name = 'D');

-- Schema Fixes for Long Values
ALTER TABLE students ALTER COLUMN photo_url TYPE TEXT;
ALTER TABLE students ALTER COLUMN father_photo TYPE TEXT;
ALTER TABLE students ALTER COLUMN mother_photo TYPE TEXT;
ALTER TABLE students ALTER COLUMN guardian_photo TYPE TEXT;
ALTER TABLE students ALTER COLUMN previous_school TYPE TEXT;
ALTER TABLE students ALTER COLUMN guardian_address TYPE TEXT;
ALTER TABLE students ALTER COLUMN address TYPE TEXT;
ALTER TABLE students ALTER COLUMN permanent_address TYPE TEXT;
ALTER TABLE students ALTER COLUMN note TYPE TEXT;
ALTER TABLE students ALTER COLUMN doc_url_1 TYPE TEXT;
ALTER TABLE students ALTER COLUMN doc_url_2 TYPE TEXT;
ALTER TABLE students ALTER COLUMN doc_url_3 TYPE TEXT;
ALTER TABLE students ALTER COLUMN doc_url_4 TYPE TEXT;

-- Subjects
INSERT INTO school_subjects (subject_name, subject_code) SELECT 'Mathematics', 'MATH' WHERE NOT EXISTS (SELECT 1 FROM school_subjects WHERE subject_name = 'Mathematics');
INSERT INTO school_subjects (subject_name, subject_code) SELECT 'Science', 'SCI' WHERE NOT EXISTS (SELECT 1 FROM school_subjects WHERE subject_name = 'Science');
INSERT INTO school_subjects (subject_name, subject_code) SELECT 'English', 'ENG' WHERE NOT EXISTS (SELECT 1 FROM school_subjects WHERE subject_name = 'English');
INSERT INTO school_subjects (subject_name, subject_code) SELECT 'Hindi', 'HIN' WHERE NOT EXISTS (SELECT 1 FROM school_subjects WHERE subject_name = 'Hindi');
INSERT INTO school_subjects (subject_name, subject_code) SELECT 'Social Science', 'SST' WHERE NOT EXISTS (SELECT 1 FROM school_subjects WHERE subject_name = 'Social Science');

-- Examinations
INSERT INTO examinations (exam_name, session) SELECT 'First Term', '2025-26' WHERE NOT EXISTS (SELECT 1 FROM examinations WHERE exam_name = 'First Term' AND session = '2025-26');
INSERT INTO examinations (exam_name, session) SELECT 'Second Term', '2025-26' WHERE NOT EXISTS (SELECT 1 FROM examinations WHERE exam_name = 'Second Term' AND session = '2025-26');
INSERT INTO examinations (exam_name, session) SELECT 'Annual Exam', '2025-26' WHERE NOT EXISTS (SELECT 1 FROM examinations WHERE exam_name = 'Annual Exam' AND session = '2025-26');
