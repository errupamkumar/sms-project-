package com.sms.student.repository;

import com.sms.student.entity.StudentMarks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudentMarksRepository extends JpaRepository<StudentMarks, Long> {

    @Query("SELECT sm FROM StudentMarks sm WHERE sm.exam.id = :examId AND sm.subject.id = :subjectId AND sm.student.schoolClass.id = :classId AND sm.student.section.id = :sectionId")
    List<StudentMarks> findByExamAndSubjectAndClassAndSection(
            @Param("examId") Long examId,
            @Param("subjectId") Long subjectId,
            @Param("classId") Long classId,
            @Param("sectionId") Long sectionId);

    List<StudentMarks> findByStudentIdAndExamId(Long studentId, Long examId);

    List<StudentMarks> findByStudentId(Long studentId);
}
