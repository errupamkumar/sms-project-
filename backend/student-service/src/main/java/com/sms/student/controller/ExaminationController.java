package com.sms.student.controller;

import com.sms.student.dto.AddMarksRequest;
import com.sms.student.entity.Examination;
import com.sms.student.entity.SchoolSubject;
import com.sms.student.entity.StudentMarks;
import com.sms.student.service.ExaminationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/examination")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExaminationController {

    private final ExaminationService examinationService;

    @GetMapping("/subjects")
    public ResponseEntity<List<SchoolSubject>> getAllSubjects() {
        return ResponseEntity.ok(examinationService.getAllSubjects());
    }

    @GetMapping("/exams")
    public ResponseEntity<List<Examination>> getAllExams() {
        return ResponseEntity.ok(examinationService.getAllExams());
    }

    @PostMapping("/exams")
    public ResponseEntity<Examination> createExam(@RequestBody Examination exam) {
        return ResponseEntity.ok(examinationService.saveExam(exam));
    }

    @PutMapping("/exams/{id}")
    public ResponseEntity<Examination> updateExam(@PathVariable Long id, @RequestBody Examination exam) {
        return ResponseEntity.ok(examinationService.updateExam(id, exam));
    }

    @DeleteMapping("/exams/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examinationService.deleteExam(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/marks")
    public ResponseEntity<?> saveMarks(@RequestBody AddMarksRequest request) {
        try {
            examinationService.saveMarks(request);
            return ResponseEntity.ok("Marks saved successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/marks")
    public ResponseEntity<List<StudentMarks>> getMarks(
            @RequestParam(required = false) Long examId,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long sectionId,
            @RequestParam(required = false) Long studentId) {

        if (studentId != null) {
            return ResponseEntity.ok(examinationService.getStudentReport(studentId));
        }

        return ResponseEntity.ok(examinationService.getMarks(examId, subjectId, classId, sectionId));
    }

    @PostMapping("/{examId}/publish-result")
    public ResponseEntity<?> publishResult(@PathVariable Long examId) {
        try {
            examinationService.publishResult(examId);
            return ResponseEntity.ok("Result published successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
