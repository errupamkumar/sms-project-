package com.sms.student.dto;

import lombok.Data;

@Data
public class MarksEntryDto {
    private Long studentId;
    private Double marksObtained;
    private Boolean isAbsent;
}
