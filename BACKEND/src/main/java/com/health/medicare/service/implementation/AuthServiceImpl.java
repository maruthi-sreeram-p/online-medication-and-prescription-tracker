package com.health.medicare.service.implementation;

import com.health.medicare.dto.request.LoginRequestDto;
import com.health.medicare.dto.request.RegistrationRequestDto;
import com.health.medicare.dto.response.LoginResponseDto;
import com.health.medicare.exception.InvalidCredentialsException;
import com.health.medicare.model.Admin;
import com.health.medicare.model.Doctor;
import com.health.medicare.model.Patient;
import com.health.medicare.model.Staff;
import com.health.medicare.repository.AdminRepository;
import com.health.medicare.repository.DoctorRepository;
import com.health.medicare.repository.PatientRepository;
import com.health.medicare.repository.StaffRepository;
import com.health.medicare.security.JwtUtil;
import com.health.medicare.security.Role;
import com.health.medicare.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final StaffRepository staffRepository;
    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Override
    public LoginResponseDto login(LoginRequestDto request) {
        String email = request.getEmail();
        String password = request.getPassword();

        // Check Doctor
        var doctorOpt = doctorRepository.findByEmail(email);
        if (doctorOpt.isPresent()) {
            Doctor doctor = doctorOpt.get();
            if (!passwordEncoder.matches(password, doctor.getPassword()))
                throw new InvalidCredentialsException("Invalid email or password");
            String token = jwtUtil.generateToken(email, "DOCTOR");
            return LoginResponseDto.builder()
                    .token(token).role("DOCTOR")
                    .userId(doctor.getId()).name(doctor.getName())
                    .email(doctor.getEmail()).status(doctor.getStatus())
                    .build();
        }

        // Check Patient
        var patientOpt = patientRepository.findByEmail(email);
        if (patientOpt.isPresent()) {
            Patient patient = patientOpt.get();
            if (!passwordEncoder.matches(password, patient.getPassword()))
                throw new InvalidCredentialsException("Invalid email or password");
            String token = jwtUtil.generateToken(email, "PATIENT");
            return LoginResponseDto.builder()
                    .token(token).role("PATIENT")
                    .userId(patient.getId()).name(patient.getName())
                    .email(patient.getEmail()).status(patient.getStatus())
                    .build();
        }

        // Check Staff
        var staffOpt = staffRepository.findByEmail(email);
        if (staffOpt.isPresent()) {
            Staff staff = staffOpt.get();
            if (!passwordEncoder.matches(password, staff.getPassword()))
                throw new InvalidCredentialsException("Invalid email or password");
            String token = jwtUtil.generateToken(email, "STAFF");
            return LoginResponseDto.builder()
                    .token(token).role("STAFF")
                    .userId(staff.getId()).name(staff.getName())
                    .email(staff.getEmail()).status(staff.getStatus())
                    .build();
        }

        // Check Admin
        var adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (!passwordEncoder.matches(password, admin.getPassword()))
                throw new InvalidCredentialsException("Invalid email or password");
            String token = jwtUtil.generateToken(email, "ADMIN");
            return LoginResponseDto.builder()
                    .token(token).role("ADMIN")
                    .userId(admin.getId()).name(admin.getName())
                    .email(admin.getEmail()).status(admin.getStatus())
                    .build();
        }

        throw new InvalidCredentialsException("Invalid email or password");
    }

    @Override
    public LoginResponseDto register(RegistrationRequestDto request) {
        String role = request.getRole().toUpperCase();
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        if (role.equals("DOCTOR")) {
            if (doctorRepository.findByEmail(request.getEmail()).isPresent())
                throw new RuntimeException("Email already registered");
            Doctor doctor = Doctor.builder()
                    .name(request.getName()).email(request.getEmail())
                    .password(encodedPassword).phone(request.getPhone())
                    .specialization(request.getSpecialization())
                    .hospitalName(request.getHospitalName())
                    .licenseNumber(request.getLicenseNumber())
                    .role(Role.DOCTOR).status("APPROVED")
                    .build();
            doctorRepository.save(doctor);
            String token = jwtUtil.generateToken(request.getEmail(), "DOCTOR");
            return LoginResponseDto.builder()
                    .token(token).role("DOCTOR")
                    .userId(doctor.getId()).name(doctor.getName())
                    .email(doctor.getEmail()).status("APPROVED")
                    .build();
        }

        if (role.equals("PATIENT")) {
            if (patientRepository.findByEmail(request.getEmail()).isPresent())
                throw new RuntimeException("Email already registered");
            Patient patient = Patient.builder()
                    .name(request.getName()).email(request.getEmail())
                    .password(encodedPassword).phone(request.getPhone())
                    .age(request.getAge()).gender(request.getGender())
                    .bloodGroup(request.getBloodGroup())
                    .role(Role.PATIENT).status("ACTIVE")
                    .build();
            patientRepository.save(patient);
            String token = jwtUtil.generateToken(request.getEmail(), "PATIENT");
            return LoginResponseDto.builder()
                    .token(token).role("PATIENT")
                    .userId(patient.getId()).name(patient.getName())
                    .email(patient.getEmail()).status("ACTIVE")
                    .build();
        }

        if (role.equals("STAFF")) {
            if (staffRepository.findByEmail(request.getEmail()).isPresent())
                throw new RuntimeException("Email already registered");
            Staff staff = Staff.builder()
                    .name(request.getName()).email(request.getEmail())
                    .password(encodedPassword).phone(request.getPhone())
                    .staffRole(request.getStaffRole())
                    .hospitalName(request.getHospitalName())
                    .shift(request.getShift())
                    .role(Role.STAFF).status("ACTIVE")
                    .build();
            staffRepository.save(staff);
            String token = jwtUtil.generateToken(request.getEmail(), "STAFF");
            return LoginResponseDto.builder()
                    .token(token).role("STAFF")
                    .userId(staff.getId()).name(staff.getName())
                    .email(staff.getEmail()).status("ACTIVE")
                    .build();
        }

        if (role.equals("ADMIN")) {
            if (adminRepository.findByEmail(request.getEmail()).isPresent())
                throw new RuntimeException("Email already registered");
            Admin admin = Admin.builder()
                    .name(request.getName()).email(request.getEmail())
                    .password(encodedPassword).phone(request.getPhone())
                    .role(Role.ADMIN).status("ACTIVE")
                    .build();
            adminRepository.save(admin);
            String token = jwtUtil.generateToken(request.getEmail(), "ADMIN");
            return LoginResponseDto.builder()
                    .token(token).role("ADMIN")
                    .userId(admin.getId()).name(admin.getName())
                    .email(admin.getEmail()).status("ACTIVE")
                    .build();
        }

        throw new RuntimeException("Invalid role: " + role);
    }
}