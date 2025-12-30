package com.sms.student.service;

import com.sms.student.dto.AddMarksRequest;
import com.sms.student.dto.MarksEntryDto;
import com.sms.student.entity.*;
import com.sms.student.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExaminationService {

    private final SchoolSubjectRepository subjectRepository;
    private final ExaminationRepository examinationRepository;
    private final StudentMarksRepository marksRepository;
    private final StudentRepository studentRepository;
    private final SchoolClassRepository classRepository;
    private final SectionRepository sectionRepository;
    private final NotificationService notificationService;

    public List<SchoolSubject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public List<Examination> getAllExams() {
        return examinationRepository.findAll();
    }

    @Transactional
    public List<StudentMarks> saveMarks(AddMarksRequest request) {
        Examination exam = examinationRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        SchoolSubject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        List<StudentMarks> savedMarks = new ArrayList<>();

        for (MarksEntryDto entry : request.getMarks()) {
            Student student = studentRepository.findById(entry.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            // Check if marks already exist for this exam, subject and student
            List<StudentMarks> existingMarks = marksRepository.findByStudentIdAndExamId(student.getId(), exam.getId());
            StudentMarks marks = existingMarks.stream()
                    .filter(m -> m.getSubject().getId().equals(subject.getId()))
                    .findFirst()
                    .orElse(new StudentMarks());

            if (marks.getId() == null) {
                marks.setStudent(student);
                marks.setExam(exam);
                marks.setSubject(subject);
            }

            marks.setMarksObtained(entry.getMarksObtained());
            marks.setIsAbsent(entry.getIsAbsent());

            savedMarks.add(marksRepository.save(marks));
        }

        return savedMarks;
    }

    public List<StudentMarks> getMarks(Long examId, Long subjectId, Long classId, Long sectionId) {
        return marksRepository.findByExamAndSubjectAndClassAndSection(examId, subjectId, classId, sectionId);
    }

    public List<StudentMarks> getStudentReport(Long studentId) {
        return marksRepository.findByStudentId(studentId);
    }

    public void publishResult(Long examId) {
        Examination exam = examinationRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        exam.setIsResultPublished(true);
        examinationRepository.save(exam);
    }

    public Examination saveExam(Examination exam) {
        return examinationRepository.save(exam);
    }

    public Examination updateExam(Long id, Examination updatedExam) {
        Examination existing = examinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        existing.setExamName(updatedExam.getExamName());
        existing.setSession(updatedExam.getSession());
        existing.setFullMarks(updatedExam.getFullMarks());
        existing.setPassMarks(updatedExam.getPassMarks());
        return examinationRepository.save(existing);
    }

    public void deleteExam(Long id) {
        examinationRepository.deleteById(id);
    }
}
