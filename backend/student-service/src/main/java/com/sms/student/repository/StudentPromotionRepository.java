package com.sms.student.repository;

import com.sms.student.entity.StudentPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentPromotionRepository extends JpaRepository<StudentPromotion, Long> {
    List<StudentPromotion> findByStudentIdOrderByPromotionDateDesc(Long studentId);
}
