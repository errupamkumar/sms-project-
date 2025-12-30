package com.sms.student.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateExamScheduleRequest {
    private Long examId;
    private Long classId;
    private Long subjectId;
    private LocalDate examDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String roomNo;
}
