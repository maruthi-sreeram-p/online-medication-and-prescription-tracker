package com.health.medicare.service;

import com.health.medicare.dto.request.MedicationTrackingRequestDto;
import com.health.medicare.dto.response.MedicationTrackingResponseDto;
import java.util.List;

public interface MedicationTrackingService {
    MedicationTrackingResponseDto markMedication(Long patientId, MedicationTrackingRequestDto request);
    List<MedicationTrackingResponseDto> getTodaySchedule(Long patientId);
    List<MedicationTrackingResponseDto> getPatientHistory(Long patientId);
}