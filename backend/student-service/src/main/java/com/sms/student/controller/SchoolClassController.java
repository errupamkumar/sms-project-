package com.sms.student.controller;

import com.sms.student.entity.SchoolClass;
import com.sms.student.entity.Section;
import com.sms.student.entity.Teacher;
import com.sms.student.service.AcademicsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/school-classes")
@CrossOrigin(origins = "*") // Allow frontend access
public class SchoolClassController {

    @Autowired
    private AcademicsService academicsService;

    @GetMapping
    public List<SchoolClass> getAllClasses() {
        return academicsService.getAllClasses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchoolClass> getClassById(@PathVariable Long id) {
        SchoolClass schoolClass = academicsService.getClassById(id);
        return schoolClass != null ? ResponseEntity.ok(schoolClass) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public SchoolClass createClass(@RequestBody Map<String, Object> payload) {
        SchoolClass schoolClass = new SchoolClass();
        schoolClass.setClassName((String) payload.get("className"));
        schoolClass.setSubjectName((String) payload.get("subjectName"));

        if (payload.get("startDate") != null) {
            schoolClass.setStartDate(java.time.LocalDate.parse((String) payload.get("startDate")));
        }
        if (payload.get("startTime") != null) {
            schoolClass.setStartTime(java.time.LocalTime.parse((String) payload.get("startTime")));
        }
        if (payload.get("endDate") != null) {
            schoolClass.setEndDate(java.time.LocalDate.parse((String) payload.get("endDate")));
        }
        if (payload.get("endTime") != null) {
            schoolClass.setEndTime(java.time.LocalTime.parse((String) payload.get("endTime")));
        }

        schoolClass.setIsActive((Boolean) payload.getOrDefault("isActive", true));

        Long teacherId = payload.get("teacherId") != null && !((String) payload.get("teacherId")).isEmpty()
                ? Long.parseLong((String) payload.get("teacherId"))
                : null;
        List<String> sectionNames = null;
        if (payload.get("sectionNames") != null) {
            sectionNames = (List<String>) payload.get("sectionNames");
        }

        return academicsService.saveClass(schoolClass, teacherId, sectionNames);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchoolClass> updateClass(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        SchoolClass schoolClass = new SchoolClass();
        schoolClass.setClassName((String) payload.get("className"));
        schoolClass.setSubjectName((String) payload.get("subjectName"));

        if (payload.get("startDate") != null) {
            schoolClass.setStartDate(java.time.LocalDate.parse((String) payload.get("startDate")));
        }
        if (payload.get("startTime") != null) {
            schoolClass.setStartTime(java.time.LocalTime.parse((String) payload.get("startTime")));
        }
        if (payload.get("endDate") != null) {
            schoolClass.setEndDate(java.time.LocalDate.parse((String) payload.get("endDate")));
        }
        if (payload.get("endTime") != null) {
            schoolClass.setEndTime(java.time.LocalTime.parse((String) payload.get("endTime")));
        }

        schoolClass.setIsActive((Boolean) payload.getOrDefault("isActive", true));

        Long teacherId = payload.get("teacherId") != null && !((String) payload.get("teacherId")).isEmpty()
                ? Long.parseLong((String) payload.get("teacherId"))
                : null;
        List<String> sectionNames = null;
        if (payload.get("sectionNames") != null) {
            sectionNames = (List<String>) payload.get("sectionNames");
        }

        SchoolClass updated = academicsService.updateClass(id, schoolClass, teacherId, sectionNames);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        academicsService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }

    // Ancillary endpoints for UI support
    @GetMapping("/teachers")
    public List<Teacher> getAllTeachers() {
        return academicsService.getAllTeachers();
    }

    @PostMapping("/teachers")
    public Teacher createTeacher(@RequestBody Teacher teacher) {
        return academicsService.saveTeacher(teacher);
    }

    @GetMapping("/sections")
    public List<Section> getAllSections() {
        return academicsService.getAllSections();
    }
}
