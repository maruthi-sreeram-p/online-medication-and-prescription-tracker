package com.health.medicare.dto.request;

import lombok.*;

@Data
public class PrescriptionMedicineRequestDto {
    private Long medicineId;
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