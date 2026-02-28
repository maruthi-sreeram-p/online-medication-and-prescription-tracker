package com.health.medicare.service;

import com.health.medicare.dto.request.PrescriptionRequestDto;
import com.health.medicare.dto.response.PrescriptionResponseDto;
import java.util.List;

public interface PrescriptionService {
    PrescriptionResponseDto createPrescription(Long doctorId, PrescriptionRequestDto request);
    List<PrescriptionResponseDto> getDoctorPrescriptions(Long doctorId);
    List<PrescriptionResponseDto> getPatientPrescriptions(Long patientId);
}