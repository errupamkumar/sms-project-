package com.sms.student.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDTO {
    private Long id;
    private String teacherName;

    // Personal
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String religion;
    private String caste;
    private String fatherName;
    private String motherName;
    private String spouseName;

    // Contact
    private String mobile;
    private String email;
    private String currentAddress;
    private String permanentAddress;
    private String city;
    private String state;
    private String pincode;

    // Professional
    private String qualification;
    private Double experience;
    private String designation;
    private LocalDate joiningDate;
    private Double salary;
    private String specialization;

    // Documents
    private String resumeUrl;
    private String joiningLetterUrl;
    private String govtIdUrl;
    private String photoUrl;

    private Boolean isActive;
}
