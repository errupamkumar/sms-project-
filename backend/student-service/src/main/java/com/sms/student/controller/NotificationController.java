package com.sms.student.controller;

import com.sms.student.entity.Notification;
import com.sms.student.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long classId) {
        return ResponseEntity.ok(notificationService.getStudentNotifications(studentId, classId));
    }
}
