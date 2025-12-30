package com.sms.student.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "examinations", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "exam_name", "session" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Examination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "exam_name", nullable = false)
    private String examName;

    @Column(name = "session", nullable = false)
    private String session;

    @Column(name = "is_result_published")
    private Boolean isResultPublished = false;

    @Column(name = "full_marks")
    private Double fullMarks;

    @Column(name = "pass_marks")
    private Double passMarks;
}
