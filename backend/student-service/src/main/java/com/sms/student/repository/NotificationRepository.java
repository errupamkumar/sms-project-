package com.sms.student.repository;

import com.sms.student.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<Notification> findByClassIdOrderByCreatedAtDesc(Long classId);

    List<Notification> findByStudentIdOrClassIdOrderByCreatedAtDesc(Long studentId, Long classId);

    List<Notification> findByStudentIdIsNullAndClassIdIsNullOrderByCreatedAtDesc();
}
