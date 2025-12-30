package com.sms.student.service;

import com.sms.student.entity.SchoolClass;
import com.sms.student.entity.Section;
import com.sms.student.entity.Teacher;
import com.sms.student.repository.SchoolClassRepository;
import com.sms.student.repository.SectionRepository;
import com.sms.student.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AcademicsService {

    @Autowired
    private SchoolClassRepository schoolClassRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private SectionRepository sectionRepository;

    // Class Management
    public List<SchoolClass> getAllClasses() {
        return schoolClassRepository.findAll();
    }

    public SchoolClass getClassById(Long id) {
        return schoolClassRepository.findById(id).orElse(null);
    }

    public SchoolClass saveClass(SchoolClass schoolClass, Long teacherId, List<String> sectionNames) {
        if (teacherId != null) {
            Teacher teacher = teacherRepository.findById(teacherId).orElse(null);
            schoolClass.setClassTeacher(teacher);
        }

        if (sectionNames != null && !sectionNames.isEmpty()) {
            List<Section> sections = findOrCreateSections(sectionNames);
            schoolClass.setSections(sections);
        }

        return schoolClassRepository.save(schoolClass);
    }

    public SchoolClass updateClass(Long id, SchoolClass updatedClass, Long teacherId, List<String> sectionNames) {
        return schoolClassRepository.findById(id).map(existingClass -> {
            existingClass.setClassName(updatedClass.getClassName());
            existingClass.setSubjectName(updatedClass.getSubjectName());
            existingClass.setStartDate(updatedClass.getStartDate());
            existingClass.setStartTime(updatedClass.getStartTime());
            existingClass.setEndDate(updatedClass.getEndDate());
            existingClass.setEndTime(updatedClass.getEndTime());
            existingClass.setIsActive(updatedClass.getIsActive());

            if (teacherId != null) {
                Teacher teacher = teacherRepository.findById(teacherId).orElse(null);
                existingClass.setClassTeacher(teacher);
            } else {
                existingClass.setClassTeacher(null);
            }

            if (sectionNames != null) {
                List<Section> sections = findOrCreateSections(sectionNames);
                existingClass.setSections(sections);
            } else {
                existingClass.setSections(null);
            }

            return schoolClassRepository.save(existingClass);
        }).orElse(null);
    }

    private List<Section> findOrCreateSections(List<String> sectionNames) {
        List<Section> sections = new java.util.ArrayList<>();
        for (String name : sectionNames) {
            String trimmedName = name.trim();
            if (!trimmedName.isEmpty()) {
                Section section = sectionRepository.findBySectionName(trimmedName)
                        .orElseGet(() -> {
                            Section newSection = new Section();
                            newSection.setSectionName(trimmedName);
                            return sectionRepository.save(newSection);
                        });
                sections.add(section);
            }
        }
        return sections;
    }

    public void deleteClass(Long id) {
        schoolClassRepository.deleteById(id);
    }

    // Teacher Management
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    public Teacher saveTeacher(Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    // Section Management
    public List<Section> getAllSections() {
        return sectionRepository.findAll();
    }
}
