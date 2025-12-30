package com.sms.student.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentListResponse {
    private Long id;
    private String admissionNumber;
    private String rollNumber;
    private String fullName;
    private String className;
    private String sectionName;
    private String categoryName;
    private String houseName;
    private Boolean isActive;

    // Additional fields for complete list
    private String fatherName;
    private String motherName;
    private String mobile;
    private String gender;
    private java.time.LocalDate dob;
    private String email;

    // Guardian & Other Info
    private String religion;
    private String caste;
    private String guardianName;
    private String guardianRelation;
    private String guardianMobile;

    // Newly Added Fields
    private String bloodGroup;
    private java.time.LocalDate admissionDate;
    private String address;
    private String city;
    private String state;
    private String pincode;

    // Parent Extended
    private String fatherOccupation;
    private String fatherMobile;
    private String motherOccupation;
    private String motherMobile;

    // Guardian Extended
    private String guardianEmail;
    private String guardianAddress;
    private String guardianOccupation;

    // Transport
    private String transportRoute;
    private String transportVehicle; // Using vehicle number or name? Entity has this.

    // Bank & IDs
    private String bankAccountNumber;
    private String bankName;
    private String ifscCode;
    private String nationalId;
    private String localId;

    // Previous School
    private String previousSchool;
}
