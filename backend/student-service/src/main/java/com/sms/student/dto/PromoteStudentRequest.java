package com.sms.student.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromoteStudentRequest {

    @NotEmpty(message = "Student IDs list cannot be empty")
    private List<Long> studentIds;

    @NotNull(message = "Target class ID is required")
    private Long toClassId;

    @NotNull(message = "Target section ID is required")
    private Long toSectionId;

    @NotNull(message = "Academic year ID is required")
    private Long academicYearId;

    private String remarks;

    private String academicSession;

    private Double promotionFee;

    private LocalDate promotionDate = LocalDate.now();
}
