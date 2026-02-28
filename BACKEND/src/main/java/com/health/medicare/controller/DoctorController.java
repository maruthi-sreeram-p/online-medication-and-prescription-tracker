package com.health.medicare.controller;

import com.health.medicare.dto.response.DoctorResponseDto;
import com.health.medicare.dto.response.PatientResponseDto;
import com.health.medicare.model.Doctor;
import com.health.medicare.model.DoctorPatient;
import com.health.medicare.model.Patient;
import com.health.medicare.model.PatientRequest;
import com.health.medicare.repository.DoctorPatientRepository;
import com.health.medicare.repository.DoctorRepository;
import com.health.medicare.repository.PatientRequestRepository;
import com.health.medicare.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;
    private final DoctorRepository doctorRepository;
    private final PatientRequestRepository patientRequestRepository;
    private final DoctorPatientRepository doctorPatientRepository;

    // GET /api/doctors/{doctorId}/dashboard
    @GetMapping("/{doctorId}/dashboard")
    public ResponseEntity<DoctorResponseDto> getDashboard(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.getDoctorDashboard(doctorId));
    }

    // GET /api/doctors/{doctorId}/patients
    @GetMapping("/{doctorId}/patients")
    public ResponseEntity<List<PatientResponseDto>> getMyPatients(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.getMyPatients(doctorId));
    }

    // GET /api/doctors/{doctorId}/patients/{patientId}
    @GetMapping("/{doctorId}/patients/{patientId}")
    public ResponseEntity<PatientResponseDto> getPatientDetail(
            @PathVariable Long doctorId,
            @PathVariable Long patientId) {
        return ResponseEntity.ok(doctorService.getPatientDetail(doctorId, patientId));
    }

    // ✅ GET /api/doctors/{doctorId}/requests
    // Returns PENDING patient requests with FULL patient info (name, age, gender, phone)
    @GetMapping("/{doctorId}/requests")
    public ResponseEntity<List<Map<String, Object>>> getPendingRequests(@PathVariable Long doctorId) {
        List<PatientRequest> pending = patientRequestRepository
                .findByDoctorIdAndStatus(doctorId, "PENDING");

        List<Map<String, Object>> result = pending.stream().map(req -> {
            Patient p = req.getPatient();
            Map<String, Object> map = new HashMap<>();
            map.put("id", req.getId());
            map.put("patientId", p.getId());
            map.put("patientName", p.getName());          // ✅ Real patient name shown in UI
            map.put("email", p.getEmail());
            map.put("phone", p.getPhone() != null ? p.getPhone() : "N/A");
            map.put("age", p.getAge() != null ? p.getAge() : 0);
            map.put("gender", p.getGender() != null ? p.getGender() : "N/A");
            map.put("status", req.getStatus());
            map.put("requestedAt", req.getRequestedAt() != null ? req.getRequestedAt().toString() : "");
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // ✅ PUT /api/doctors/{doctorId}/requests/{requestId}/accept
    // Accepts patient request AND creates DoctorPatient connection
    @PutMapping("/{doctorId}/requests/{requestId}/accept")
    public ResponseEntity<String> acceptRequest(
            @PathVariable Long doctorId,
            @PathVariable Long requestId) {

        PatientRequest req = patientRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        req.setStatus("ACCEPTED");
        patientRequestRepository.save(req);

        // Link doctor and patient in DoctorPatient table
        boolean alreadyLinked = doctorPatientRepository
                .existsByDoctorIdAndPatientId(doctorId, req.getPatient().getId());

        if (!alreadyLinked) {
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            DoctorPatient link = DoctorPatient.builder()
                    .doctor(doctor)
                    .patient(req.getPatient())
                    .status("ACTIVE")
                    .build();
            doctorPatientRepository.save(link);
        }

        return ResponseEntity.ok("Request accepted! Patient added to your list.");
    }

    // ✅ PUT /api/doctors/{doctorId}/requests/{requestId}/reject
    @PutMapping("/{doctorId}/requests/{requestId}/reject")
    public ResponseEntity<String> rejectRequest(
            @PathVariable Long doctorId,
            @PathVariable Long requestId) {

        PatientRequest req = patientRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        req.setStatus("REJECTED");
        patientRequestRepository.save(req);

        return ResponseEntity.ok("Request rejected.");
    }

    // GET /api/doctors/all — all doctors (for Find Doctors patient page)
    @GetMapping("/all")
    public ResponseEntity<List<DoctorResponseDto>> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        List<DoctorResponseDto> result = doctors.stream().map(d ->
                DoctorResponseDto.builder()
                        .id(d.getId())
                        .name(d.getName())
                        .email(d.getEmail())
                        .phone(d.getPhone())
                        .specialization(d.getSpecialization())
                        .hospitalName(d.getHospitalName())
                        .status(d.getStatus())
                        .totalPatients(0)
                        .pendingRequests(0)
                        .averageAdherence(0.0)
                        .build()
        ).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // PUT /api/doctors/{doctorId}/approve
    @PutMapping("/{doctorId}/approve")
    public ResponseEntity<String> approveDoctor(@PathVariable Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setStatus("APPROVED");
        doctorRepository.save(doctor);
        return ResponseEntity.ok("Doctor approved!");
    }
}