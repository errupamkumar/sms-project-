package com.sms.student.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;

import com.sms.student.dto.*;
import com.sms.student.entity.Category;
import com.sms.student.entity.House;
import com.sms.student.entity.SchoolClass;
import com.sms.student.entity.Section;
import com.sms.student.entity.Student;
import com.sms.student.entity.StudentPromotion;
import com.sms.student.exception.ResourceNotFoundException;
import com.sms.student.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {

    private final StudentRepository studentRepository;
    private final CategoryRepository categoryRepository;
    private final HouseRepository houseRepository;
    private final StudentPromotionRepository promotionRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SectionRepository sectionRepository;

    @Transactional(readOnly = true)
    public Page<StudentListResponse> getAllStudents(
            Long classId,
            Long sectionId,
            Long categoryId,
            Long houseId,
            Boolean isActive,
            String search,
            int page,
            int size,
            String sortBy,
            String sortDirection) {
        org.springframework.data.domain.Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? org.springframework.data.domain.Sort.by(sortBy).descending()
                : org.springframework.data.domain.Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        String searchPattern = (search != null && !search.isEmpty()) ? "%" + search + "%" : "%%";
        Page<Student> students = studentRepository.findAllWithFilters(
                classId, sectionId, categoryId, houseId, isActive, searchPattern, pageable);

        return students.map(this::convertToListResponse);
    }

    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return convertToResponse(student);
    }

    @Transactional(readOnly = true)
    public StudentResponse getStudentByAdmissionNumber(String admissionNumber) {
        Student student = studentRepository.findByAdmissionNumber(admissionNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Student not found with admission number: " + admissionNumber));
        return convertToResponse(student);
    }

    @Transactional
    public StudentResponse createStudent(CreateStudentRequest request) {
        // Generate admission number
        String admissionNumber = generateAdmissionNumber();

        Student student = new Student();
        student.setAdmissionNumber(admissionNumber);
        student.setRollNumber(request.getRollNumber());
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setGender(request.getGender());
        student.setBloodGroup(request.getBloodGroup());
        student.setEmail(request.getEmail());
        student.setMobile(request.getMobile());
        student.setAddress(request.getAddress());
        student.setCity(request.getCity());
        student.setState(request.getState());
        student.setPincode(request.getPincode());

        // Set new basic fields
        student.setAcademicSession(request.getAcademicSession());
        student.setReligion(request.getReligion());
        student.setCaste(request.getCaste());
        student.setPhotoUrl(request.getPhotoUrl());
        student.setAsOnDate(request.getAsOnDate());

        // Set category
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            student.setCategory(category);
        }

        // Set house
        if (request.getHouseId() != null) {
            House house = houseRepository.findById(request.getHouseId())
                    .orElseThrow(() -> new ResourceNotFoundException("House not found"));
            student.setHouse(house);
        }

        // Set parent information
        student.setFatherName(request.getFatherName());
        student.setFatherOccupation(request.getFatherOccupation());
        student.setFatherMobile(request.getFatherMobile());
        student.setFatherPhoto(request.getFatherPhoto());
        student.setMotherName(request.getMotherName());
        student.setMotherOccupation(request.getMotherOccupation());
        student.setMotherMobile(request.getMotherMobile());
        student.setMotherPhoto(request.getMotherPhoto());

        // Set guardian information (extended)
        student.setGuardianName(request.getGuardianName());
        student.setGuardianRelation(request.getGuardianRelation());
        student.setGuardianMobile(request.getGuardianMobile());
        student.setGuardianEmail(request.getGuardianEmail());
        student.setGuardianAddress(request.getGuardianAddress());
        student.setGuardianOccupation(request.getGuardianOccupation());
        student.setGuardianIs(request.getGuardianIs());
        student.setGuardianPhoto(request.getGuardianPhoto());

        // Set transport details
        student.setTransportRoute(request.getTransportRoute());
        student.setTransportVehicle(request.getTransportVehicle());
        student.setBusFee(request.getBusFee());

        // Set address details
        student.setPermanentAddress(request.getPermanentAddress());
        student.setIsGuardianAddressCurrent(request.getIsGuardianAddressCurrent());
        student.setIsPermanentAddressCurrent(request.getIsPermanentAddressCurrent());

        // Set bank details
        student.setBankAccountNumber(request.getBankAccountNumber());
        student.setBankName(request.getBankName());
        student.setIfscCode(request.getIfscCode());

        // Set miscellaneous
        student.setNationalId(request.getNationalId());
        student.setLocalId(request.getLocalId());
        student.setNote(request.getNote());

        // Set documents
        student.setDocTitle1(request.getDocTitle1());
        student.setDocUrl1(request.getDocUrl1());
        student.setDocTitle2(request.getDocTitle2());
        student.setDocUrl2(request.getDocUrl2());
        student.setDocTitle3(request.getDocTitle3());
        student.setDocUrl3(request.getDocUrl3());
        student.setDocTitle4(request.getDocTitle4());
        student.setDocUrl4(request.getDocUrl4());

        // Set academic information
        if (request.getCurrentClassId() != null) {
            SchoolClass schoolClass = schoolClassRepository.findById(request.getCurrentClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
            student.setSchoolClass(schoolClass);
        }

        if (request.getCurrentSectionId() != null) {
            Section section = sectionRepository.findById(request.getCurrentSectionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Section not found"));
            student.setSection(section);
        }

        student.setAdmissionDate(request.getAdmissionDate());
        student.setAcademicYearId(request.getAcademicYearId());
        student.setPreviousSchool(request.getPreviousSchool());
        student.setIsActive(true);

        Student savedStudent = studentRepository.save(student);
        log.info("Created new student with admission number: {}", admissionNumber);

        return convertToResponse(savedStudent);
    }

    @Transactional
    public PromotionResponse promoteStudents(PromoteStudentRequest request) {
        PromotionResponse response = PromotionResponse.builder()
                .totalStudents(request.getStudentIds().size())
                .promoted(0)
                .failed(0)
                .errors(new ArrayList<>())
                .build();

        for (Long studentId : request.getStudentIds()) {
            try {
                Student student = studentRepository.findById(studentId)
                        .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

                // Create promotion record
                StudentPromotion promotion = new StudentPromotion();
                promotion.setStudentId(student.getId());
                promotion.setFromClassId(student.getSchoolClass() != null ? student.getSchoolClass().getId() : null);
                promotion.setFromSectionId(student.getSection() != null ? student.getSection().getId() : null);
                promotion.setToClassId(request.getToClassId());
                promotion.setToSectionId(request.getToSectionId());
                promotion.setAcademicYearId(request.getAcademicYearId());
                promotion.setPromotionDate(request.getPromotionDate());
                promotion.setRemarks(request.getRemarks());
                promotion.setPromotionFee(request.getPromotionFee());

                promotionRepository.save(promotion);

                // Update student's class and section
                SchoolClass toClass = schoolClassRepository.findById(request.getToClassId())
                        .orElseThrow(() -> new ResourceNotFoundException("Target Class not found"));
                Section toSection = sectionRepository.findById(request.getToSectionId())
                        .orElseThrow(() -> new ResourceNotFoundException("Target Section not found"));

                student.setSchoolClass(toClass);
                student.setSection(toSection);
                student.setAcademicYearId(request.getAcademicYearId());
                if (request.getAcademicSession() != null && !request.getAcademicSession().isEmpty()) {
                    student.setAcademicSession(request.getAcademicSession());
                }

                studentRepository.save(student);
                response.setPromoted(response.getPromoted() + 1);

                log.info("Promoted student {} from class {} to class {}",
                        student.getAdmissionNumber(), promotion.getFromClassId(), promotion.getToClassId());

            } catch (Exception e) {
                response.getErrors().add("Failed to promote student ID " + studentId + ": " + e.getMessage());
                response.setFailed(response.getFailed() + 1);
                log.error("Error promoting student ID {}: {}", studentId, e.getMessage());
            }
        }

        return response;
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        student.setIsActive(false);
        studentRepository.save(student);
        log.info("Soft deleted student with id: {}", id);
    }

    // Helper methods
    private String generateAdmissionNumber() {
        // Generate admission number: STD<YEAR><RANDOM>
        String year = String.valueOf(LocalDate.now().getYear()).substring(2);
        String random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String admissionNumber = "STD" + year + random;

        // Ensure uniqueness
        while (studentRepository.existsByAdmissionNumber(admissionNumber)) {
            random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            admissionNumber = "STD" + year + random;
        }

        return admissionNumber;
    }

    private StudentResponse convertToResponse(Student student) {
        StudentResponse response = new StudentResponse();
        response.setId(student.getId());
        response.setAdmissionNumber(student.getAdmissionNumber());
        response.setRollNumber(student.getRollNumber());
        response.setFirstName(student.getFirstName());
        response.setLastName(student.getLastName());
        response.setFullName(student.getFullName());
        response.setDateOfBirth(student.getDateOfBirth());
        response.setAge(student.getAge());
        response.setGender(student.getGender());
        response.setBloodGroup(student.getBloodGroup());

        if (student.getCategory() != null) {
            response.setCategory(new CategoryDTO(
                    student.getCategory().getId(),
                    student.getCategory().getCategoryName(),
                    student.getCategory().getDescription()));
        }

        if (student.getHouse() != null) {
            response.setHouse(new HouseDTO(
                    student.getHouse().getId(),
                    student.getHouse().getHouseName(),
                    student.getHouse().getHouseColor()));
        }

        response.setEmail(student.getEmail());
        response.setMobile(student.getMobile());
        response.setAddress(student.getAddress());
        response.setCity(student.getCity());
        response.setState(student.getState());
        response.setPincode(student.getPincode());

        // New basic fields
        response.setAcademicSession(student.getAcademicSession());
        response.setReligion(student.getReligion());
        response.setCaste(student.getCaste());
        response.setAsOnDate(student.getAsOnDate());

        // Parent info
        response.setFatherName(student.getFatherName());
        response.setFatherOccupation(student.getFatherOccupation());
        response.setFatherMobile(student.getFatherMobile());
        response.setFatherPhoto(student.getFatherPhoto());
        response.setMotherName(student.getMotherName());
        response.setMotherOccupation(student.getMotherOccupation());
        response.setMotherMobile(student.getMotherMobile());
        response.setMotherPhoto(student.getMotherPhoto());

        // Guardian info (extended)
        response.setGuardianName(student.getGuardianName());
        response.setGuardianRelation(student.getGuardianRelation());
        response.setGuardianMobile(student.getGuardianMobile());
        response.setGuardianEmail(student.getGuardianEmail());
        response.setGuardianAddress(student.getGuardianAddress());
        response.setGuardianOccupation(student.getGuardianOccupation());
        response.setGuardianIs(student.getGuardianIs());
        response.setGuardianPhoto(student.getGuardianPhoto());

        // Transport
        response.setTransportRoute(student.getTransportRoute());
        response.setTransportVehicle(student.getTransportVehicle());
        response.setBusFee(student.getBusFee());

        // Address extended
        response.setPermanentAddress(student.getPermanentAddress());
        response.setIsGuardianAddressCurrent(student.getIsGuardianAddressCurrent());
        response.setIsPermanentAddressCurrent(student.getIsPermanentAddressCurrent());

        // Bank details
        response.setBankAccountNumber(student.getBankAccountNumber());
        response.setBankName(student.getBankName());
        response.setIfscCode(student.getIfscCode());

        // Miscellaneous
        response.setNationalId(student.getNationalId());
        response.setLocalId(student.getLocalId());
        response.setNote(student.getNote());

        // Documents
        response.setDocTitle1(student.getDocTitle1());
        response.setDocUrl1(student.getDocUrl1());
        response.setDocTitle2(student.getDocTitle2());
        response.setDocUrl2(student.getDocUrl2());
        response.setDocTitle3(student.getDocTitle3());
        response.setDocUrl3(student.getDocUrl3());
        response.setDocTitle4(student.getDocTitle4());
        response.setDocUrl4(student.getDocUrl4());

        response.setCurrentClassId(student.getSchoolClass() != null ? student.getSchoolClass().getId() : null);
        response.setCurrentSectionId(student.getSection() != null ? student.getSection().getId() : null);
        response.setAdmissionDate(student.getAdmissionDate());
        response.setAcademicYearId(student.getAcademicYearId());
        response.setPreviousSchool(student.getPreviousSchool());
        response.setPhotoUrl(student.getPhotoUrl());
        response.setIsActive(student.getIsActive());

        return response;
    }

    private StudentListResponse convertToListResponse(Student student) {
        StudentListResponse response = new StudentListResponse();
        response.setId(student.getId());
        response.setAdmissionNumber(student.getAdmissionNumber());
        response.setRollNumber(student.getRollNumber());
        response.setFullName(student.getFullName());

        if (student.getSchoolClass() != null) {
            response.setClassName(student.getSchoolClass().getClassName());
        }

        if (student.getSection() != null) {
            response.setSectionName("Section " + student.getSection().getSectionName());
        }

        response.setCategoryName(student.getCategory() != null ? student.getCategory().getCategoryName() : null);
        response.setHouseName(student.getHouse() != null ? student.getHouse().getHouseName() : null);
        response.setIsActive(student.getIsActive());

        // Populate additional fields
        response.setFatherName(student.getFatherName());
        response.setMotherName(student.getMotherName());
        response.setMobile(student.getMobile());
        response.setGender(student.getGender());
        response.setDob(student.getDateOfBirth());
        response.setEmail(student.getEmail());

        // New fields
        response.setReligion(student.getReligion());
        response.setCaste(student.getCaste());
        response.setGuardianName(student.getGuardianName());
        response.setGuardianRelation(student.getGuardianRelation());
        response.setGuardianMobile(student.getGuardianMobile());

        // Newly Mapped Fields
        response.setBloodGroup(student.getBloodGroup());
        response.setAdmissionDate(student.getAdmissionDate());
        response.setAddress(student.getAddress());
        response.setCity(student.getCity());
        response.setState(student.getState());
        response.setPincode(student.getPincode());

        response.setFatherOccupation(student.getFatherOccupation());
        response.setFatherMobile(student.getFatherMobile());
        response.setMotherOccupation(student.getMotherOccupation());
        response.setMotherMobile(student.getMotherMobile());

        response.setGuardianEmail(student.getGuardianEmail());
        response.setGuardianAddress(student.getGuardianAddress());
        response.setGuardianOccupation(student.getGuardianOccupation());

        response.setTransportRoute(student.getTransportRoute());
        response.setTransportVehicle(student.getTransportVehicle());

        response.setBankAccountNumber(student.getBankAccountNumber());
        response.setBankName(student.getBankName());
        response.setIfscCode(student.getIfscCode());
        response.setNationalId(student.getNationalId());
        response.setLocalId(student.getLocalId());

        response.setPreviousSchool(student.getPreviousSchool());

        return response;
    }

    @Transactional
    public String processExcelUpload(MultipartFile file, Long classId, Long sectionId, String academicSession) {
        if (file.isEmpty()) {
            throw new RuntimeException("Please select a file to upload.");
        }

        try (InputStream inputStream = file.getInputStream();
                Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            List<Student> students = new ArrayList<>();
            List<String> errors = new ArrayList<>();

            SchoolClass schoolClass = schoolClassRepository.findById(classId)
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found"));
            Section section = sectionRepository.findById(sectionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Section not found"));

            // Generate base admission number logic (or keep random)
            // For bulk upload, we might want sequential or random. Keeping existing
            // specific logic.

            // Iterate rows, skipping header (row 0)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null)
                    continue;

                // Check if row is empty (sometimes Excel has empty trailing rows)
                boolean isEmpty = true;
                for (int c = 0; c < row.getLastCellNum(); c++) {
                    Cell cell = row.getCell(c);
                    if (cell != null && cell.getCellType() != CellType.BLANK) {
                        isEmpty = false;
                        break;
                    }
                }
                if (isEmpty)
                    continue;

                try {
                    Student student = new Student();
                    student.setAdmissionNumber(generateAdmissionNumber()); // Auto-generate

                    // Column Mapping (Hypothetical based on "all required fields")
                    // 0: First Name, 1: Last Name, 2: Gender, 3: DOB (YYYY-MM-DD), 4: Mobile, 5:
                    // Father Name

                    student.setFirstName(getCellValueAsString(row.getCell(0)));
                    student.setLastName(getCellValueAsString(row.getCell(1)));
                    student.setGender(getCellValueAsString(row.getCell(2)));

                    // Parse Date
                    String dobStr = getCellValueAsString(row.getCell(3));
                    if (dobStr != null && !dobStr.isEmpty()) {
                        try {
                            student.setDateOfBirth(LocalDate.parse(dobStr));
                        } catch (Exception e) {
                            // Try to read as date if cell type is numeric
                            try {
                                if (row.getCell(3).getCellType() == CellType.NUMERIC) {
                                    student.setDateOfBirth(row.getCell(3).getLocalDateTimeCellValue().toLocalDate());
                                }
                            } catch (Exception ignored) {
                            }
                        }
                    }

                    student.setMobile(getCellValueAsString(row.getCell(4)));

                    // Father Info
                    student.setFatherName(getCellValueAsString(row.getCell(5)));
                    student.setFatherMobile(getCellValueAsString(row.getCell(6)));

                    // Mother Info
                    student.setMotherName(getCellValueAsString(row.getCell(7)));

                    // Category & House (Optional - for now set null or map if string matches)
                    // skipping specific logic for brevity, just basic fields

                    // Common fields
                    student.setSchoolClass(schoolClass);
                    student.setSection(section);
                    student.setAcademicSession(academicSession);
                    student.setAdmissionDate(LocalDate.now());
                    student.setIsActive(true);

                    students.add(student);

                } catch (Exception e) {
                    errors.add("Row " + (i + 1) + ": " + e.getMessage());
                    log.error("Error parsing row {}", i, e);
                }
            }

            if (!students.isEmpty()) {
                studentRepository.saveAll(students);
                log.info("Uploaded {} students successfully.", students.size());
            }

            if (!errors.isEmpty()) {
                return "Uploaded " + students.size() + " students. Errors: " + String.join("; ", errors);
            }

            return "Uploaded " + students.size() + " students successfully.";

        } catch (IOException e) {
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage());
        }
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null)
            return null;
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                return String.valueOf((long) cell.getNumericCellValue()); // Assume integer for phone/etc
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }
}
