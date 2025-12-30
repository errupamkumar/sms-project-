package com.sms.student.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateStudentRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @NotNull(message = "Date of birth is required")
    @PastOrPresent(message = "Date of birth cannot be in the future")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "Male|Female|Other", message = "Gender must be Male, Female, or Other")
    private String gender;

    @Size(max = 5, message = "Blood group must not exceed 5 characters")
    private String bloodGroup;

    private Long categoryId;

    private Long houseId;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String mobile;

    private String address;
    private String city;
    private String state;

    @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be 6 digits")
    private String pincode;

    // Parent Information
    private String fatherName;
    private String fatherOccupation;

    @Pattern(regexp = "^[0-9]{10}$", message = "Father's mobile number must be 10 digits")
    private String fatherMobile;

    private String motherName;
    private String motherOccupation;

    @Pattern(regexp = "^[0-9]{10}$", message = "Mother's mobile number must be 10 digits")
    private String motherMobile;

    private String guardianName;
    private String guardianRelation;

    @Pattern(regexp = "^[0-9]{10}$", message = "Guardian's mobile number must be 10 digits")
    private String guardianMobile;

    @NotNull(message = "Class ID is required")
    private Long currentClassId;

    @NotNull(message = "Section ID is required")
    private Long currentSectionId;

    @NotNull(message = "Admission date is required")
    private LocalDate admissionDate;

    private Long academicYearId;

    private String previousSchool;

    // New Fields for Comprehensive Admission Form
    private String academicSession;
    private String religion;
    private String caste;
    private String photoUrl;
    private String rollNumber;

    // Guardian Details Extended
    @Email(message = "Invalid guardian email format")
    private String guardianEmail;
    private String guardianAddress;
    private String guardianOccupation;
    private String guardianIs; // Father, Mother, Other
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
}
