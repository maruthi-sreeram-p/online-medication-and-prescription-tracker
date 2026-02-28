package com.health.medicare.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicationTrackingResponseDto {
    private Long id;
    private Long patientId;
    private Long prescriptionMedicineId;  // ✅ needed for frontend mark-taken call
    private String medicineName;
    private String dosage;
    private String slot;          // MORNING, AFTERNOON, NIGHT
    private LocalDate trackingDate;
    private String status;        // PENDING, ON_TIME, LATE, MISSED
    private LocalDateTime markedAt;
    private String meal;          // before / after
    private String timeStart;
    private String timeEnd;
}