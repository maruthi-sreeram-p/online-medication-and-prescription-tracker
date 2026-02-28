package com.health.medicare.repository;

import com.health.medicare.model.MedicationTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MedicationTrackingRepository extends JpaRepository<MedicationTracking, Long> {

    List<MedicationTracking> findByPatientIdAndTrackingDate(Long patientId, LocalDate date);

    List<MedicationTracking> findByPatientId(Long patientId);

    // ✅ Find specific tracking record for a patient+medicine+slot+date (for mark-taken logic)
    Optional<MedicationTracking> findByPatientIdAndPrescriptionMedicineIdAndSlotAndTrackingDate(
            Long patientId, Long prescriptionMedicineId, String slot, LocalDate date);

    @Query("SELECT mt FROM MedicationTracking mt WHERE mt.patient.id = :patientId AND mt.trackingDate BETWEEN :startDate AND :endDate")
    List<MedicationTracking> findByPatientIdAndDateRange(Long patientId, LocalDate startDate, LocalDate endDate);

    long countByPatientIdAndStatus(Long patientId, String status);
}