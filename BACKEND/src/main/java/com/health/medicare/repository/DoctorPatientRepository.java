package com.health.medicare.repository;

import com.health.medicare.model.DoctorPatient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DoctorPatientRepository extends JpaRepository<DoctorPatient, Long> {
    List<DoctorPatient> findByDoctorIdAndStatus(Long doctorId, String status);
    List<DoctorPatient> findByPatientIdAndStatus(Long patientId, String status);
    boolean existsByDoctorIdAndPatientId(Long doctorId, Long patientId);
}