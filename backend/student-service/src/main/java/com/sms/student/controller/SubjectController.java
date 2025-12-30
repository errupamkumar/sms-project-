package com.sms.student.controller;

import com.sms.student.entity.SchoolSubject;
import com.sms.student.service.ExaminationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/subjects")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubjectController {

    private final ExaminationService examinationService;

    @GetMapping
    public ResponseEntity<List<SchoolSubject>> getAllSubjects() {
        return ResponseEntity.ok(examinationService.getAllSubjects());
    }

    @PostMapping
    public ResponseEntity<SchoolSubject> createSubject(@RequestBody SchoolSubject subject) {
        return ResponseEntity.ok(examinationService.saveSubject(subject));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchoolSubject> updateSubject(@PathVariable Long id, @RequestBody SchoolSubject subject) {
        return ResponseEntity.ok(examinationService.updateSubject(id, subject));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        examinationService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }
}
