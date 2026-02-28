package com.health.medicare.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medication_tracking")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicationTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "prescription_medicine_id", nullable = false)
    private PrescriptionMedicine prescriptionMedicine;

    // MORNING, AFTERNOON, NIGHT
    private String slot;

    private LocalDate trackingDate;

    // ON_TIME, LATE, MISSED, PENDING
    private String status = "PENDING";

    private LocalDateTime markedAt;
}