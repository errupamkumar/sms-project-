package com.sms.student.entity;

import com.sms.student.entity.SchoolClass;
import com.sms.student.entity.Section;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "admission_number", unique = true, nullable = false, length = 20)
    private String admissionNumber;

    @Column(name = "roll_number", length = 20)
    private String rollNumber;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "gender", nullable = false, length = 10)
    private String gender;

    @Column(name = "blood_group", length = 5)
    private String bloodGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "house_id")
    private House house;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "mobile", length = 15)
    private String mobile;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city", length = 50)
    private String city;

    @Column(name = "state", length = 50)
    private String state;

    @Column(name = "pincode", length = 10)
    private String pincode;

    @Column(name = "father_name", length = 100)
    private String fatherName;

    @Column(name = "father_occupation", length = 100)
    private String fatherOccupation;

    @Column(name = "father_mobile", length = 15)
    private String fatherMobile;

    @Column(name = "mother_name", length = 100)
    private String motherName;

    @Column(name = "mother_occupation", length = 100)
    private String motherOccupation;

    @Column(name = "mother_mobile", length = 15)
    private String motherMobile;

    @Column(name = "guardian_name", length = 100)
    private String guardianName;

    @Column(name = "guardian_relation", length = 50)
    private String guardianRelation;

    @Column(name = "guardian_mobile", length = 15)
    private String guardianMobile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private SchoolClass schoolClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id")
    private Section section;

    @Column(name = "admission_date", nullable = false)
    private LocalDate admissionDate;

    @Column(name = "academic_year_id")
    private Long academicYearId;

    @Column(name = "previous_school", columnDefinition = "TEXT")
    private String previousSchool;

    @Column(name = "academic_session", length = 20)
    private String academicSession;

    @Column(name = "religion", length = 50)
    private String religion;

    @Column(name = "caste", length = 50)
    private String caste;

    @Column(name = "photo_url", columnDefinition = "TEXT")
    private String photoUrl;

    // Guardian Details Extended
    @Column(name = "guardian_email", length = 100)
    private String guardianEmail;

    @Column(name = "guardian_address", columnDefinition = "TEXT")
    private String guardianAddress;

    @Column(name = "guardian_occupation", length = 100)
    private String guardianOccupation;

    @Column(name = "guardian_is", length = 20)
    private String guardianIs; // Father, Mother, Other

    @Column(name = "father_photo", columnDefinition = "TEXT")
    private String fatherPhoto;

    @Column(name = "mother_photo", columnDefinition = "TEXT")
    private String motherPhoto;

    @Column(name = "guardian_photo", columnDefinition = "TEXT")
    private String guardianPhoto;

    // Transport Details
    @Column(name = "transport_route", length = 100)
    private String transportRoute;

    @Column(name = "transport_vehicle", length = 50)
    private String transportVehicle;

    @Column(name = "bus_fee")
    private Double busFee;

    // Address Details Extended
    @Column(name = "permanent_address", columnDefinition = "TEXT")
    private String permanentAddress;

    @Column(name = "is_guardian_address_current")
    private Boolean isGuardianAddressCurrent;

    @Column(name = "is_permanent_address_current")
    private Boolean isPermanentAddressCurrent;

    // Miscellaneous
    @Column(name = "bank_account_number", length = 50)
    private String bankAccountNumber;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "ifsc_code", length = 20)
    private String ifscCode;

    @Column(name = "national_id", length = 50)
    private String nationalId;

    @Column(name = "local_id", length = 50)
    private String localId;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "as_on_date")
    private LocalDate asOnDate;

    // Documents (Simple structure for now)
    @Column(name = "doc_title_1", length = 100)
    private String docTitle1;
    @Column(name = "doc_url_1", columnDefinition = "TEXT")
    private String docUrl1;

    @Column(name = "doc_title_2", length = 100)
    private String docTitle2;
    @Column(name = "doc_url_2", columnDefinition = "TEXT")
    private String docUrl2;

    @Column(name = "doc_title_3", length = 100)
    private String docTitle3;
    @Column(name = "doc_url_3", columnDefinition = "TEXT")
    private String docUrl3;

    @Column(name = "doc_title_4", length = 100)
    private String docTitle4;
    @Column(name = "doc_url_4", columnDefinition = "TEXT")
    private String docUrl4;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }

    @Transient
    public Integer getAge() {
        if (dateOfBirth == null) {
            return null;
        }
        return LocalDate.now().getYear() - dateOfBirth.getYear();
    }
}
