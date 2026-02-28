package com.health.medicare.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorResponseDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String specialization;
    private String hospitalName;
    private String status;
    private Integer totalPatients;
    private Integer pendingRequests;
    private Double averageAdherence;
}