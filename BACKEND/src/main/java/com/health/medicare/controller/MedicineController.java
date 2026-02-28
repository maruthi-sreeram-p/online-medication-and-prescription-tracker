package com.health.medicare.controller;

import com.health.medicare.model.Medicine;
import com.health.medicare.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineRepository medicineRepository;

    // GET /api/medicines - get all medicines
    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        List<Medicine> medicines = medicineRepository.findAll();

        // If no medicines exist yet, create default ones
        if (medicines.isEmpty()) {
            List<Medicine> defaults = List.of(
                    Medicine.builder().name("Dolo 650").description("Fever & Pain relief").build(),
                    Medicine.builder().name("Paracetamol 500mg").description("Pain relief").build(),
                    Medicine.builder().name("Amoxicillin 250mg").description("Antibiotic").build(),
                    Medicine.builder().name("Cetirizine 10mg").description("Antihistamine").build(),
                    Medicine.builder().name("Metformin 500mg").description("Diabetes").build(),
                    Medicine.builder().name("Amlodipine 5mg").description("Blood pressure").build(),
                    Medicine.builder().name("Pantoprazole 40mg").description("Acidity").build(),
                    Medicine.builder().name("Azithromycin 500mg").description("Antibiotic").build()
            );
            medicines = medicineRepository.saveAll(defaults);
        }

        return ResponseEntity.ok(medicines);
    }

    // POST /api/medicines - add new medicine
    @PostMapping
    public ResponseEntity<Medicine> addMedicine(@RequestBody Medicine medicine) {
        return ResponseEntity.ok(medicineRepository.save(medicine));
    }
}