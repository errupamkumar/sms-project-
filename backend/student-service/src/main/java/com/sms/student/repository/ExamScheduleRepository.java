package com.sms.student.repository;

import com.sms.student.entity.ExamSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamScheduleRepository extends JpaRepository<ExamSchedule, Long> {
    List<ExamSchedule> findByExamId(Long examId);

    List<ExamSchedule> findBySchoolClassId(Long classId);

    List<ExamSchedule> findByExamIdAndSchoolClassId(Long examId, Long classId);
}
