package com.sms.student.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {

    private Long id;
    private String admissionNumber;
    private String rollNumber;
    private String firstName;
    private String lastName;
    private String fullName;
    private LocalDate dateOfBirth;
    private Integer age;
    private String gender;
    private String bloodGroup;

    // Category and House
    private CategoryDTO category;
    private HouseDTO house;

    // Contact Information
    private String email;
    private String mobile;
    private String address;
    private String city;
    private String state;
    private String pincode;

    // Parent Information
    private String fatherName;
    private String fatherOccupation;
    private String fatherMobile;
    private String motherName;
    private String motherOccupation;
    private String motherMobile;
    private String guardianName;
    private String guardianRelation;
    private String guardianMobile;

    // Academic Information
    private Long currentClassId;
    private Long currentSectionId;
    private LocalDate admissionDate;
    private Long academicYearId;
    private String previousSchool;
    private String photoUrl;

    // New Fields
    private String academicSession;
    private String religion;
    private String caste;

    // Guardian Details Extended
    private String guardianEmail;
    private String guardianAddress;
    private String guardianOccupation;
    private String guardianIs;
    private String fatherPhoto;
    private String motherPhoto;
    private String guardianPhoto;

    // Transport Details
    private String transportRoute;
    private String transportVehicle;
    private Double busFee;

    // Address Details Extended
    private String permanentAddress;
    private Boolean isGuardianAddressCurrent;
    private Boolean isPermanentAddressCurrent;

    // Miscellaneous
    private String bankAccountNumber;
    private String bankName;
    private String ifscCode;
    private String nationalId;
    private String localId;
    private String note;
    private LocalDate asOnDate;

    // Documents
    private String docTitle1;
    private String docUrl1;
    private String docTitle2;
    private String docUrl2;
    private String docTitle3;
    private String docUrl3;
    private String docTitle4;
    private String docUrl4;

    private Boolean isActive;
}
