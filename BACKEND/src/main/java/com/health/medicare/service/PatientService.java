package com.health.medicare.service;

import com.health.medicare.dto.response.PatientResponseDto;
import com.health.medicare.dto.response.PrescriptionResponseDto;
import java.util.List;
import java.util.Map;

public interface PatientService {
    String sendRequestToDoctor(Long patientId, Long doctorId);
    List<PrescriptionResponseDto> getMyPrescriptions(Long patientId);
    PatientResponseDto getMyProfile(Long patientId);

    // ✅ BUG FIX: New method for profile update
    PatientResponseDto updateProfile(Long patientId, Map<String, Object> updates);
}