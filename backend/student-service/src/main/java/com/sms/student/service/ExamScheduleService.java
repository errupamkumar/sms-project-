package com.sms.student.service;

import com.sms.student.dto.CreateExamScheduleRequest;
import com.sms.student.entity.ExamSchedule;
import com.sms.student.entity.Examination;
import com.sms.student.entity.SchoolClass;
import com.sms.student.entity.SchoolSubject;
import com.sms.student.repository.ExamScheduleRepository;
import com.sms.student.repository.ExaminationRepository;
import com.sms.student.repository.SchoolClassRepository;
import com.sms.student.repository.SchoolSubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamScheduleService {

    private final ExamScheduleRepository examScheduleRepository;
    private final ExaminationRepository examinationRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SchoolSubjectRepository schoolSubjectRepository;
    private final NotificationService notificationService;

    public ExamSchedule createSchedule(CreateExamScheduleRequest request) {
        Examination exam = examinationRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        SchoolClass schoolClass = schoolClassRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));
        SchoolSubject subject = schoolSubjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        ExamSchedule schedule = new ExamSchedule();
        schedule.setExam(exam);
        schedule.setSchoolClass(schoolClass);
        schedule.setSubject(subject);
        schedule.setExamDate(request.getExamDate());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setRoomNo(request.getRoomNo());

        return examScheduleRepository.save(schedule);
    }

    public List<ExamSchedule> getSchedules(Long examId, Long classId) {
        if (examId != null && classId != null) {
            return examScheduleRepository.findByExamIdAndSchoolClassId(examId, classId);
        } else if (examId != null) {
            return examScheduleRepository.findByExamId(examId);
        } else if (classId != null) {
            return examScheduleRepository.findBySchoolClassId(classId);
        }
        return examScheduleRepository.findAll();
    }

    public void publishSchedule(Long examId) {
        Examination exam = examinationRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        // Notify all students - simplified by broadcasting to all classes?
        // For now, let's just create a generic notification or one per class if we
        // iterate.
        // Since we don't have a reliable "All Students" broadcast without iterating,
        // we can iterate over schedules to find unique classes and notify them.

        List<ExamSchedule> schedules = examScheduleRepository.findByExamId(examId);
        schedules.stream().map(ExamSchedule::getSchoolClass).distinct().forEach(schoolClass -> {
            notificationService.createNotification(
                    "Exam Schedule Published",
                    "The schedule for " + exam.getExamName() + " has been published.",
                    null,
                    schoolClass.getId());
        });
    }
}
