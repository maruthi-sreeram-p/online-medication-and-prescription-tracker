package com.health.medicare.dto.request;

import lombok.*;

@Data
public class MedicationTrackingRequestDto {
    private Long prescriptionMedicineId;
    private String slot;
    private String status; // ON_TIME, LATE, MISSED
}