package com.sms.student.service;

import com.sms.student.dto.TeacherDTO;
import com.sms.student.entity.Teacher;
import com.sms.student.exception.ResourceNotFoundException;
import com.sms.student.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeacherService {

    private final TeacherRepository teacherRepository;

    @Transactional(readOnly = true)
    public List<TeacherDTO> getAllTeachers() {
        return teacherRepository.findAll().stream()
                .filter(t -> t.getIsActive() == null || t.getIsActive())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TeacherDTO getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        return convertToDTO(teacher);
    }

    @Transactional
    public TeacherDTO createTeacher(TeacherDTO dto) {
        Teacher teacher = new Teacher();
        updateTeacherFromDTO(teacher, dto);
        teacher.setIsActive(true);
        Teacher savedTeacher = teacherRepository.save(teacher);
        return convertToDTO(savedTeacher);
    }

    @Transactional
    public TeacherDTO updateTeacher(Long id, TeacherDTO dto) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        updateTeacherFromDTO(teacher, dto);
        Teacher savedTeacher = teacherRepository.save(teacher);
        return convertToDTO(savedTeacher);
    }

    @Transactional
    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        teacher.setIsActive(false);
        teacherRepository.save(teacher);
    }

    private void updateTeacherFromDTO(Teacher teacher, TeacherDTO dto) {
        teacher.setTeacherName(dto.getTeacherName());
        teacher.setDateOfBirth(dto.getDateOfBirth());
        teacher.setGender(dto.getGender());
        teacher.setBloodGroup(dto.getBloodGroup());
        teacher.setReligion(dto.getReligion());
        teacher.setCaste(dto.getCaste());
        teacher.setFatherName(dto.getFatherName());
        teacher.setMotherName(dto.getMotherName());
        teacher.setSpouseName(dto.getSpouseName());

        teacher.setMobile(dto.getMobile());
        teacher.setEmail(dto.getEmail());
        teacher.setCurrentAddress(dto.getCurrentAddress());
        teacher.setPermanentAddress(dto.getPermanentAddress());
        teacher.setCity(dto.getCity());
        teacher.setState(dto.getState());
        teacher.setPincode(dto.getPincode());

        teacher.setQualification(dto.getQualification());
        teacher.setExperience(dto.getExperience());
        teacher.setDesignation(dto.getDesignation());
        teacher.setJoiningDate(dto.getJoiningDate());
        teacher.setSalary(dto.getSalary());
        teacher.setSpecialization(dto.getSpecialization());

        teacher.setResumeUrl(dto.getResumeUrl());
        teacher.setJoiningLetterUrl(dto.getJoiningLetterUrl());
        teacher.setGovtIdUrl(dto.getGovtIdUrl());
        teacher.setPhotoUrl(dto.getPhotoUrl());
    }

    private TeacherDTO convertToDTO(Teacher teacher) {
        TeacherDTO dto = new TeacherDTO();
        dto.setId(teacher.getId());
        dto.setTeacherName(teacher.getTeacherName());
        dto.setDateOfBirth(teacher.getDateOfBirth());
        dto.setGender(teacher.getGender());
        dto.setBloodGroup(teacher.getBloodGroup());
        dto.setReligion(teacher.getReligion());
        dto.setCaste(teacher.getCaste());
        dto.setFatherName(teacher.getFatherName());
        dto.setMotherName(teacher.getMotherName());
        dto.setSpouseName(teacher.getSpouseName());

        dto.setMobile(teacher.getMobile());
        dto.setEmail(teacher.getEmail());
        dto.setCurrentAddress(teacher.getCurrentAddress());
        dto.setPermanentAddress(teacher.getPermanentAddress());
        dto.setCity(teacher.getCity());
        dto.setState(teacher.getState());
        dto.setPincode(teacher.getPincode());

        dto.setQualification(teacher.getQualification());
        dto.setExperience(teacher.getExperience());
        dto.setDesignation(teacher.getDesignation());
        dto.setJoiningDate(teacher.getJoiningDate());
        dto.setSalary(teacher.getSalary());
        dto.setSpecialization(teacher.getSpecialization());

        dto.setResumeUrl(teacher.getResumeUrl());
        dto.setJoiningLetterUrl(teacher.getJoiningLetterUrl());
        dto.setGovtIdUrl(teacher.getGovtIdUrl());
        dto.setPhotoUrl(teacher.getPhotoUrl());
        dto.setIsActive(teacher.getIsActive());

        return dto;
    }
}
