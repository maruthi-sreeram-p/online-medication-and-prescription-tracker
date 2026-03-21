package com.health.medicare.repository;

import com.health.medicare.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    // ✅ Used by MedicationTrackingServiceImpl.getTodaySchedule()
    List<Prescription> findByPatientId(Long patientId);

    List<Prescription> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    List<Prescription> findByDoctorId(Long doctorId);
}