package com.sms.student.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "school_classes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SchoolClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "class_name", nullable = false, unique = true)
    private String className;

    @Column(name = "subject_name")
    private String subjectName;

    @Column(name = "start_date")
    private java.time.LocalDate startDate;

    @Column(name = "start_time")
    private java.time.LocalTime startTime;

    @Column(name = "end_date")
    private java.time.LocalDate endDate;

    @Column(name = "end_time")
    private java.time.LocalTime endTime;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "class_sections", joinColumns = @JoinColumn(name = "class_id"), inverseJoinColumns = @JoinColumn(name = "section_id"))
    private java.util.List<Section> sections;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "teacher_id")
    private Teacher classTeacher;
}
