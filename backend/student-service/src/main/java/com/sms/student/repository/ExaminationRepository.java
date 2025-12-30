package com.sms.student.repository;

import com.sms.student.entity.Examination;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ExaminationRepository extends JpaRepository<Examination, Long> {
    Optional<Examination> findByExamNameAndSession(String examName, String session);
}
