package com.sms.student.controller;

import com.sms.student.dto.*;
import com.sms.student.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@Tag(name = "Student Management", description = "APIs for managing students")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class StudentController {

    private final StudentService studentService;

    @Operation(summary = "Get all students", description = "Retrieve all students with pagination and filtering")
    @GetMapping
    public ResponseEntity<Page<StudentListResponse>> getAllStudents(
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long sectionId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long houseId,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "admissionNumber") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        Page<StudentListResponse> students = studentService.getAllStudents(
                classId, sectionId, categoryId, houseId, isActive, search, page, size, sortBy, sortDirection);
        return ResponseEntity.ok(students);
    }

    @Operation(summary = "Get student by ID", description = "Retrieve a single student by their ID")
    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable Long id) {
        StudentResponse student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @Operation(summary = "Get student by admission number")
    @GetMapping("/admission/{admissionNumber}")
    public ResponseEntity<StudentResponse> getStudentByAdmissionNumber(@PathVariable String admissionNumber) {
        StudentResponse student = studentService.getStudentByAdmissionNumber(admissionNumber);
        return ResponseEntity.ok(student);
    }

    @Operation(summary = "Create new student", description = "Create a new student record")
    @PostMapping
    public ResponseEntity<StudentResponse> createStudent(@Valid @RequestBody CreateStudentRequest request) {
        StudentResponse createdStudent = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent);
    }

    @Operation(summary = "Promote students", description = "Promote multiple students to next class")
    @PostMapping("/promote")
    public ResponseEntity<PromotionResponse> promoteStudents(@Valid @RequestBody PromoteStudentRequest request) {
        PromotionResponse response = studentService.promoteStudents(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete student", description = "Soft delete a student (set as inactive)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Upload Student Excel", description = "Upload student data via Excel file")
    @PostMapping(value = "/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadStudentExcel(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam("classId") Long classId,
            @RequestParam("sectionId") Long sectionId,
            @RequestParam("academicSession") String academicSession) {
        String message = studentService.processExcelUpload(file, classId, sectionId, academicSession);
        return ResponseEntity.ok(message);
    }
}
