package com.health.medicare.service;

import com.health.medicare.dto.request.PatientRequestDto;
import com.health.medicare.dto.response.PatientResponseDto;
import com.health.medicare.dto.response.PrescriptionResponseDto;
import java.util.List;

public interface PatientService {
    String sendRequestToDoctor(Long patientId, Long doctorId);
    List<PrescriptionResponseDto> getMyPrescriptions(Long patientId);
    PatientResponseDto getMyProfile(Long patientId);
}