package com.health.medicare.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionMedicineResponseDto {
    private Long id;
    private Long medicineId;
    private String medicineName;
    private String dosage;
    private Integer durationDays;
    private String frequency;
    private String morningMeal;
    private String morningTimeStart;
    private String morningTimeEnd;
    private String afternoonMeal;
    private String afternoonTimeStart;
    private String afternoonTimeEnd;
    private String nightMeal;
    private String nightTimeStart;
    private String nightTimeEnd;
}