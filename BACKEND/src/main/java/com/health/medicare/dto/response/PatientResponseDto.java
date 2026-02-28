package com.health.medicare.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponseDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private String status;
    private Double adherencePercentage;
    private Integer totalDays;
    private Integer completedDays;
    private String caretakerType;
    private String caretakerName;
    private String condition;
}