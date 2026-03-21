package com.health.medicare.controller;

import com.health.medicare.model.Doctor;
import com.health.medicare.model.Patient;
import com.health.medicare.model.Staff;
import com.health.medicare.repository.DoctorRepository;
import com.health.medicare.repository.PatientRepository;
import com.health.medicare.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final StaffRepository staffRepository;

    // GET /api/admin/dashboard — stats for admin dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalStaff", staffRepository.count());
        stats.put("pendingDoctors", doctorRepository.findAll()
                .stream().filter(d -> "PENDING".equals(d.getStatus())).count());
        return ResponseEntity.ok(stats);
    }

    // GET /api/admin/doctors — all doctors
    @GetMapping("/doctors")
    public ResponseEntity<List<Map<String, Object>>> getAllDoctors() {
        List<Map<String, Object>> result = doctorRepository.findAll().stream().map(d -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", d.getId());
            map.put("name", d.getName());
            map.put("email", d.getEmail());
            map.put("phone", d.getPhone());
            map.put("specialization", d.getSpecialization());
            map.put("hospitalName", d.getHospitalName());
            map.put("licenseNumber", d.getLicenseNumber());
            map.put("status", d.getStatus());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // PUT /api/admin/doctors/{id}/approve
    @PutMapping("/doctors/{id}/approve")
    public ResponseEntity<String> approveDoctor(@PathVariable Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setStatus("APPROVED");
        doctorRepository.save(doctor);
        return ResponseEntity.ok("Doctor approved successfully");
    }

    // PUT /api/admin/doctors/{id}/reject
    @PutMapping("/doctors/{id}/reject")
    public ResponseEntity<String> rejectDoctor(@PathVariable Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setStatus("REJECTED");
        doctorRepository.save(doctor);
        return ResponseEntity.ok("Doctor rejected");
    }

    // GET /api/admin/patients — all patients
    @GetMapping("/patients")
    public ResponseEntity<List<Map<String, Object>>> getAllPatients() {
        List<Map<String, Object>> result = patientRepository.findAll().stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("email", p.getEmail());
            map.put("phone", p.getPhone());
            map.put("age", p.getAge());
            map.put("gender", p.getGender());
            map.put("bloodGroup", p.getBloodGroup());
            map.put("status", p.getStatus());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // PUT /api/admin/patients/{id}/toggle-status
    @PutMapping("/patients/{id}/toggle-status")
    public ResponseEntity<String> togglePatientStatus(@PathVariable Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        patient.setStatus("ACTIVE".equals(patient.getStatus()) ? "INACTIVE" : "ACTIVE");
        patientRepository.save(patient);
        return ResponseEntity.ok("Patient status updated to " + patient.getStatus());
    }

    // GET /api/admin/staff — all staff
    @GetMapping("/staff")
    public ResponseEntity<List<Map<String, Object>>> getAllStaff() {
        List<Map<String, Object>> result = staffRepository.findAll().stream().map(s -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            map.put("name", s.getName());
            map.put("email", s.getEmail());
            map.put("phone", s.getPhone());
            map.put("staffRole", s.getStaffRole());
            map.put("hospitalName", s.getHospitalName());
            map.put("shift", s.getShift());
            map.put("status", s.getStatus());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // PUT /api/admin/staff/{id}/toggle-status
    @PutMapping("/staff/{id}/toggle-status")
    public ResponseEntity<String> toggleStaffStatus(@PathVariable Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        staff.setStatus("ACTIVE".equals(staff.getStatus()) ? "INACTIVE" : "ACTIVE");
        staffRepository.save(staff);
        return ResponseEntity.ok("Staff status updated to " + staff.getStatus());
    }
}