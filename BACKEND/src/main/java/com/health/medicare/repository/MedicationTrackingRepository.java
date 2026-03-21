package com.health.medicare.repository;

import com.health.medicare.model.MedicationTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MedicationTrackingRepository extends JpaRepository<MedicationTracking, Long> {

    List<MedicationTracking> findByPatientId(Long patientId);

    long countByPatientIdAndStatus(Long patientId, String status);

    // ✅ Used by MedicationTrackingServiceImpl to check existing records
    Optional<MedicationTracking> findByPatientIdAndPrescriptionMedicineIdAndSlotAndTrackingDate(
            Long patientId,
            Long prescriptionMedicineId,
            String slot,
            LocalDate trackingDate);
}