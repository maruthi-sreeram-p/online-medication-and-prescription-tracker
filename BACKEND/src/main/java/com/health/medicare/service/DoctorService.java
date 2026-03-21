package com.health.medicare.service;

import com.health.medicare.dto.response.DoctorResponseDto;
import com.health.medicare.dto.response.PatientResponseDto;
import java.util.List;
import java.util.Map;

public interface DoctorService {
    DoctorResponseDto getDoctorDashboard(Long doctorId);
    List<PatientResponseDto> getMyPatients(Long doctorId);
    PatientResponseDto getPatientDetail(Long doctorId, Long patientId);
    DoctorResponseDto updateProfile(Long doctorId, Map<String, String> updates);
}