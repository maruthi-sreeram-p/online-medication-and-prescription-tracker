package com.health.medicare.dto.request;

import lombok.*;
import java.util.List;

@Data
public class PrescriptionRequestDto {
    private Long patientId;
    private String remarks;
    private String patientCondition;
    private String caretakerType;
    private String caretakerName;
    private String caretakerPhone;
    private List<Long> assignedStaffIds;
    private List<PrescriptionMedicineRequestDto> medicines;
}