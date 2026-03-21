package com.health.medicare.service.implementation;

import com.health.medicare.dto.response.PatientResponseDto;
import com.health.medicare.dto.response.PrescriptionResponseDto;
import com.health.medicare.dto.response.PrescriptionMedicineResponseDto;
import com.health.medicare.model.*;
import com.health.medicare.repository.*;
import com.health.medicare.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRequestRepository patientRequestRepository;
    private final PrescriptionRepository prescriptionRepository;
    // ✅ FIX: Added so we can explicitly load medicines without relying on lazy collection
    private final PrescriptionMedicineRepository prescriptionMedicineRepository;

    @Override
    @Transactional
    public String sendRequestToDoctor(Long patientId, Long doctorId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        boolean alreadyRequested = patientRequestRepository
                .existsByPatientIdAndDoctorIdAndStatus(patientId, doctorId, "PENDING");
        if (alreadyRequested) {
            throw new RuntimeException("Request already sent to this doctor");
        }

        PatientRequest request = PatientRequest.builder()
                .patient(patient).doctor(doctor).status("PENDING").build();
        patientRequestRepository.save(request);
        return "Request sent successfully";
    }

    /**
     * ✅ FIX: @Transactional + explicit prescriptionMedicineRepository call.
     * Without @Transactional, the Hibernate session closes after findByPatientIdOrderByCreatedAtDesc,
     * so p.getMedicines() throws LazyInitializationException → caught silently → empty prescriptions shown.
     */
    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionResponseDto> getMyPrescriptions(Long patientId) {
        List<Prescription> prescriptions = prescriptionRepository
                .findByPatientIdOrderByCreatedAtDesc(patientId);

        return prescriptions.stream().map(p -> {
            // ✅ FIX: Explicit repo call — doesn't rely on lazy collection
            List<PrescriptionMedicine> rawMeds =
                    prescriptionMedicineRepository.findByPrescriptionId(p.getId());

            List<PrescriptionMedicineResponseDto> medicines = rawMeds.stream()
                    .map(m -> PrescriptionMedicineResponseDto.builder()
                            .id(m.getId())
                            .medicineId(m.getMedicine().getId())
                            .medicineName(m.getMedicine().getName())
                            .dosage(m.getDosage())
                            .durationDays(m.getDurationDays())
                            .frequency(m.getFrequency())
                            .morningMeal(m.getMorningMeal())
                            .morningTimeStart(m.getMorningTimeStart())
                            .morningTimeEnd(m.getMorningTimeEnd())
                            .afternoonMeal(m.getAfternoonMeal())
                            .afternoonTimeStart(m.getAfternoonTimeStart())
                            .afternoonTimeEnd(m.getAfternoonTimeEnd())
                            .nightMeal(m.getNightMeal())
                            .nightTimeStart(m.getNightTimeStart())
                            .nightTimeEnd(m.getNightTimeEnd())
                            .build())
                    .collect(Collectors.toList());

            return PrescriptionResponseDto.builder()
                    .id(p.getId())
                    .doctorId(p.getDoctor().getId())
                    .doctorName(p.getDoctor().getName())
                    .patientId(p.getPatient().getId())
                    .patientName(p.getPatient().getName())
                    .remarks(p.getRemarks())
                    .patientCondition(p.getPatientCondition())
                    .caretakerType(p.getCaretakerType())
                    .caretakerName(p.getCaretakerName())
                    .caretakerPhone(p.getCaretakerPhone())
                    .createdAt(p.getCreatedAt())
                    .medicines(medicines)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PatientResponseDto getMyProfile(Long patientId) {
        Patient p = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return PatientResponseDto.builder()
                .id(p.getId()).name(p.getName()).email(p.getEmail())
                .phone(p.getPhone()).age(p.getAge()).gender(p.getGender())
                .bloodGroup(p.getBloodGroup()).status(p.getStatus())
                .build();
    }

    @Override
    @Transactional
    public PatientResponseDto updateProfile(Long patientId, Map<String, Object> updates) {
        Patient p = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (updates.containsKey("name") && updates.get("name") != null)
            p.setName(updates.get("name").toString());
        if (updates.containsKey("phone") && updates.get("phone") != null)
            p.setPhone(updates.get("phone").toString());
        if (updates.containsKey("gender") && updates.get("gender") != null)
            p.setGender(updates.get("gender").toString());
        if (updates.containsKey("bloodGroup") && updates.get("bloodGroup") != null)
            p.setBloodGroup(updates.get("bloodGroup").toString());
        if (updates.containsKey("age") && updates.get("age") != null) {
            try { p.setAge(Integer.parseInt(updates.get("age").toString())); }
            catch (NumberFormatException ignored) {}
        }

        patientRepository.save(p);

        return PatientResponseDto.builder()
                .id(p.getId()).name(p.getName()).email(p.getEmail())
                .phone(p.getPhone()).age(p.getAge()).gender(p.getGender())
                .bloodGroup(p.getBloodGroup()).status(p.getStatus())
                .build();
    }
}