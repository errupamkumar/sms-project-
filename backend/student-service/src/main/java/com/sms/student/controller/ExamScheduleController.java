package com.sms.student.controller;

import com.sms.student.dto.CreateExamScheduleRequest;
import com.sms.student.entity.ExamSchedule;
import com.sms.student.service.ExamScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exam-schedule")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExamScheduleController {

    private final ExamScheduleService examScheduleService;

    @PostMapping
    public ResponseEntity<ExamSchedule> createSchedule(@RequestBody CreateExamScheduleRequest request) {
        return ResponseEntity.ok(examScheduleService.createSchedule(request));
    }

    @GetMapping
    public ResponseEntity<List<ExamSchedule>> getSchedules(
            @RequestParam(required = false) Long examId,
            @RequestParam(required = false) Long classId) {
        return ResponseEntity.ok(examScheduleService.getSchedules(examId, classId));
    }

    @PostMapping("/{examId}/publish")
    public ResponseEntity<?> publishSchedule(@PathVariable Long examId) {
        try {
            examScheduleService.publishSchedule(examId);
            return ResponseEntity.ok("Schedule published and students notified.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
