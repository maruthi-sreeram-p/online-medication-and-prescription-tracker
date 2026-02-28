package com.health.medicare.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionResponseDto {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private Long patientId;
    private String patientName;
    private String remarks;
    private String patientCondition;
    private String caretakerType;
    private String caretakerName;
    private String caretakerPhone;
    private LocalDateTime createdAt;
    private List<PrescriptionMedicineResponseDto> medicines;
}