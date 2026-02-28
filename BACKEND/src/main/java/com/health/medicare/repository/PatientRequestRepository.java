package com.health.medicare.repository;

import com.health.medicare.model.PatientRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PatientRequestRepository extends JpaRepository<PatientRequest, Long> {
    List<PatientRequest> findByDoctorIdAndStatus(Long doctorId, String status);
    List<PatientRequest> findByPatientIdAndStatus(Long patientId, String status);
    boolean existsByPatientIdAndDoctorIdAndStatus(Long patientId, Long doctorId, String status);
}