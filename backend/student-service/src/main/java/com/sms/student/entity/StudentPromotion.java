package com.sms.student.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_promotions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentPromotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "from_class_id")
    private Long fromClassId;

    @Column(name = "from_section_id")
    private Long fromSectionId;

    @Column(name = "to_class_id")
    private Long toClassId;

    @Column(name = "to_section_id")
    private Long toSectionId;

    @Column(name = "academic_year_id")
    private Long academicYearId;

    @Column(name = "promotion_date", nullable = false)
    private LocalDate promotionDate;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "promotion_fee")
    private Double promotionFee;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
