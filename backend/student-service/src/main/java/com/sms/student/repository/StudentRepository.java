package com.sms.student.repository;

import com.sms.student.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

        Optional<Student> findByAdmissionNumber(String admissionNumber);

        boolean existsByAdmissionNumber(String admissionNumber);

        @Query("SELECT s FROM Student s WHERE " +
                        "(:classId IS NULL OR s.schoolClass.id = :classId) AND " +
                        "(:sectionId IS NULL OR s.section.id = :sectionId) AND " +
                        "(:categoryId IS NULL OR s.category.id = :categoryId) AND " +
                        "(:houseId IS NULL OR s.house.id = :houseId) AND " +
                        "(:isActive IS NULL OR s.isActive = :isActive) AND " +
                        "(:search IS NULL OR LOWER(s.firstName) LIKE LOWER(:search) OR " +
                        "LOWER(s.lastName) LIKE LOWER(:search) OR " +
                        "LOWER(s.admissionNumber) LIKE LOWER(:search) OR " +
                        "LOWER(s.rollNumber) LIKE LOWER(:search) OR " +
                        "LOWER(s.mobile) LIKE LOWER(:search) OR " +
                        "LOWER(s.fatherName) LIKE LOWER(:search) OR " +
                        "LOWER(s.motherName) LIKE LOWER(:search) OR " +
                        "LOWER(s.guardianName) LIKE LOWER(:search) OR " +
                        "LOWER(s.guardianMobile) LIKE LOWER(:search) OR " +
                        "LOWER(s.religion) LIKE LOWER(:search) OR " +
                        "LOWER(s.caste) LIKE LOWER(:search) OR " +
                        "LOWER(s.fatherMobile) LIKE LOWER(:search) OR " +
                        "LOWER(s.bloodGroup) LIKE LOWER(:search) OR " +
                        "LOWER(s.previousSchool) LIKE LOWER(:search))")
        Page<Student> findAllWithFilters(
                        @Param("classId") Long classId,
                        @Param("sectionId") Long sectionId,
                        @Param("categoryId") Long categoryId,
                        @Param("houseId") Long houseId,
                        @Param("isActive") Boolean isActive,
                        @Param("search") String search,
                        Pageable pageable);

        @Query("SELECT COUNT(s) FROM Student s WHERE s.schoolClass.id = :classId AND s.isActive = true")
        Long countByClassId(@Param("classId") Long classId);
}
