package com.health.medicare.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctor_patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorPatient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    private LocalDateTime connectedAt = LocalDateTime.now();

    // ACTIVE, INACTIVE
    private String status = "ACTIVE";
}