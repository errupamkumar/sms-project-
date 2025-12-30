package com.sms.student.service;

import com.sms.student.entity.Notification;
import com.sms.student.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void createNotification(String title, String message, Long studentId, Long classId) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setStudentId(studentId);
        notification.setClassId(classId);
        notificationRepository.save(notification);
    }

    public List<Notification> getStudentNotifications(Long studentId, Long classId) {
        List<Notification> personal = notificationRepository.findByStudentIdOrClassIdOrderByCreatedAtDesc(studentId,
                classId);
        List<Notification> broadcast = notificationRepository
                .findByStudentIdIsNullAndClassIdIsNullOrderByCreatedAtDesc();
        personal.addAll(broadcast);
        return personal;
    }
}
