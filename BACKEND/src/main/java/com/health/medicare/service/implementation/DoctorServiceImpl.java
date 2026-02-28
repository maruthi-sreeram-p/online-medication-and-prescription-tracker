package com.health.medicare.service.implementation;

import com.health.medicare.dto.response.DoctorResponseDto;
import com.health.medicare.dto.response.PatientResponseDto;
import com.health.medicare.model.Doctor;
import com.health.medicare.model.DoctorPatient;
import com.health.medicare.model.Patient;
import com.health.medicare.repository.*;
import com.health.medicare.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorPatientRepository doctorPatientRepository;
    private final PatientRequestRepository patientRequestRepository;
    private final MedicationTrackingRepository medicationTrackingRepository;

    @Override
    public DoctorResponseDto getDoctorDashboard(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<DoctorPatient> myPatients = doctorPatientRepository
                .findByDoctorIdAndStatus(doctorId, "ACTIVE");

        int pendingRequests = patientRequestRepository
                .findByDoctorIdAndStatus(doctorId, "PENDING").size();

        return DoctorResponseDto.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .specialization(doctor.getSpecialization())
                .hospitalName(doctor.getHospitalName())
                .status(doctor.getStatus())
                .totalPatients(myPatients.size())
                .pendingRequests(pendingRequests)
                .averageAdherence(78.0)
                .build();
    }

    @Override
    public List<PatientResponseDto> getMyPatients(Long doctorId) {
        List<DoctorPatient> connections = doctorPatientRepository
                .findByDoctorIdAndStatus(doctorId, "ACTIVE");

        return connections.stream().map(conn -> {
            Patient p = conn.getPatient();
            long onTime = medicationTrackingRepository
                    .countByPatientIdAndStatus(p.getId(), "ON_TIME");
            long total = medicationTrackingRepository
                    .findByPatientId(p.getId()).size();
            double adherence = total > 0 ? (onTime * 100.0 / total) : 0;

            return PatientResponseDto.builder()
                    .id(p.getId())
                    .name(p.getName())
                    .email(p.getEmail())
                    .phone(p.getPhone())
                    .age(p.getAge())
                    .gender(p.getGender())
                    .bloodGroup(p.getBloodGroup())
                    .status(p.getStatus())
                    .adherencePercentage(Math.round(adherence * 10.0) / 10.0)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public PatientResponseDto getPatientDetail(Long doctorId, Long patientId) {
        Patient p = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        long onTime = medicationTrackingRepository
                .countByPatientIdAndStatus(patientId, "ON_TIME");
        long total = medicationTrackingRepository
                .findByPatientId(patientId).size();
        double adherence = total > 0 ? (onTime * 100.0 / total) : 0;

        return PatientResponseDto.builder()
                .id(p.getId())
                .name(p.getName())
                .email(p.getEmail())
                .phone(p.getPhone())
                .age(p.getAge())
                .gender(p.getGender())
                .bloodGroup(p.getBloodGroup())
                .adherencePercentage(Math.round(adherence * 10.0) / 10.0)
                .build();
    }
}