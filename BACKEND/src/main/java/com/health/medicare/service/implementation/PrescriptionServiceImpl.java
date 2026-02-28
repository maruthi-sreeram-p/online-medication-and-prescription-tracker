package com.health.medicare.service.implementation;

import com.health.medicare.dto.request.PrescriptionRequestDto;
import com.health.medicare.dto.request.PrescriptionMedicineRequestDto;
import com.health.medicare.dto.response.PrescriptionResponseDto;
import com.health.medicare.dto.response.PrescriptionMedicineResponseDto;
import com.health.medicare.model.*;
import com.health.medicare.repository.*;
import com.health.medicare.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionMedicineRepository prescriptionMedicineRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final MedicineRepository medicineRepository;

    @Override
    public PrescriptionResponseDto createPrescription(Long doctorId, PrescriptionRequestDto request) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Prescription prescription = Prescription.builder()
                .doctor(doctor)
                .patient(patient)
                .remarks(request.getRemarks())
                .patientCondition(request.getPatientCondition())
                .caretakerType(request.getCaretakerType())
                .caretakerName(request.getCaretakerName())
                .caretakerPhone(request.getCaretakerPhone())
                .build();

        Prescription saved = prescriptionRepository.save(prescription);

        List<PrescriptionMedicine> medicines = new ArrayList<>();
        for (PrescriptionMedicineRequestDto medDto : request.getMedicines()) {
            Medicine medicine = medicineRepository.findById(medDto.getMedicineId())
                    .orElseThrow(() -> new RuntimeException("Medicine not found"));

            PrescriptionMedicine pm = PrescriptionMedicine.builder()
                    .prescription(saved)
                    .medicine(medicine)
                    .dosage(medDto.getDosage())
                    .durationDays(medDto.getDurationDays())
                    .frequency(medDto.getFrequency())
                    .morningMeal(medDto.getMorningMeal())
                    .morningTimeStart(medDto.getMorningTimeStart())
                    .morningTimeEnd(medDto.getMorningTimeEnd())
                    .afternoonMeal(medDto.getAfternoonMeal())
                    .afternoonTimeStart(medDto.getAfternoonTimeStart())
                    .afternoonTimeEnd(medDto.getAfternoonTimeEnd())
                    .nightMeal(medDto.getNightMeal())
                    .nightTimeStart(medDto.getNightTimeStart())
                    .nightTimeEnd(medDto.getNightTimeEnd())
                    .build();
            medicines.add(prescriptionMedicineRepository.save(pm));
        }

        List<PrescriptionMedicineResponseDto> medicineResponses = medicines.stream()
                .map(m -> PrescriptionMedicineResponseDto.builder()
                        .id(m.getId())
                        .medicineId(m.getMedicine().getId())
                        .medicineName(m.getMedicine().getName())
                        .dosage(m.getDosage())
                        .durationDays(m.getDurationDays())
                        .frequency(m.getFrequency())
                        .build())
                .collect(Collectors.toList());

        return PrescriptionResponseDto.builder()
                .id(saved.getId())
                .doctorId(doctor.getId())
                .doctorName(doctor.getName())
                .patientId(patient.getId())
                .patientName(patient.getName())
                .remarks(saved.getRemarks())
                .patientCondition(saved.getPatientCondition())
                .caretakerType(saved.getCaretakerType())
                .createdAt(saved.getCreatedAt())
                .medicines(medicineResponses)
                .build();
    }

    @Override
    public List<PrescriptionResponseDto> getDoctorPrescriptions(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId)
                .stream().map(p -> PrescriptionResponseDto.builder()
                        .id(p.getId())
                        .patientId(p.getPatient().getId())
                        .patientName(p.getPatient().getName())
                        .remarks(p.getRemarks())
                        .createdAt(p.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionResponseDto> getPatientPrescriptions(Long patientId) {
        return prescriptionRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream().map(p -> PrescriptionResponseDto.builder()
                        .id(p.getId())
                        .doctorId(p.getDoctor().getId())
                        .doctorName(p.getDoctor().getName())
                        .remarks(p.getRemarks())
                        .createdAt(p.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}