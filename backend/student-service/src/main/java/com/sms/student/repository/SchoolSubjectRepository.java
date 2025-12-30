package com.sms.student.repository;

import com.sms.student.entity.SchoolSubject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchoolSubjectRepository extends JpaRepository<SchoolSubject, Long> {
}
