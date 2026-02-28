package com.health.medicare.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "prescription_medicines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionMedicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @ManyToOne
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    private String dosage;
    private Integer durationDays;

    // Comma separated: MORNING,AFTERNOON,NIGHT
    private String frequency;

    // Morning slot
    private String morningMeal;
    private String morningTimeStart;
    private String morningTimeEnd;

    // Afternoon slot
    private String afternoonMeal;
    private String afternoonTimeStart;
    private String afternoonTimeEnd;

    // Night slot
    private String nightMeal;
    private String nightTimeStart;
    private String nightTimeEnd;
}