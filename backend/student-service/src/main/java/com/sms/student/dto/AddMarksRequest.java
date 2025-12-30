package com.sms.student.dto;

import lombok.Data;
import java.util.List;

@Data
public class AddMarksRequest {
    private Long examId;
    private Long subjectId;
    private Long classId;
    private Long sectionId;
    private List<MarksEntryDto> marks;
}
