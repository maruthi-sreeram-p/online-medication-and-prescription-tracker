import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Grid, TextField,
  Button, Select, MenuItem, FormControl, InputLabel, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  ToggleButton, ToggleButtonGroup, Avatar, Divider, CircularProgress, Alert
} from '@mui/material';
import {
  Add, Delete, CheckCircle, Person, FamilyRestroom,
  LocalHospital, PersonOutline, Brightness5, WbSunny, Brightness3
} from '@mui/icons-material';
import api from '../../services/api';

const Prescriptions = () => {

  const doctorId = localStorage.getItem('userId');

  const [patients, setPatients] = useState([]);
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [selectedPatient, setSelectedPatient] = useState('');
  const [remarks, setRemarks] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  // Condition & Caretaker
  const [patientCondition, setPatientCondition] = useState('STABLE');
  const [caretakerType, setCaretakerType] = useState('SELF');
  const [caretakerName, setCaretakerName] = useState('');
  const [caretakerPhone, setCaretakerPhone] = useState('');

  // Staff shifts for CRITICAL patients
  const [staffShifts, setStaffShifts] = useState({
    morning: { name: '', phone: '' },
    afternoon: { name: '', phone: '' },
    night: { name: '', phone: '' }
  });

  const [currentMed, setCurrentMed] = useState({
    medicineId: '',
    medicineName: '',
    dosage: '',
    durationDays: '',
    frequency: [],
    morning: { meal: '', timeStart: '07:00', timeEnd: '09:00' },
    afternoon: { meal: '', timeStart: '12:00', timeEnd: '13:00' },
    night: { meal: '', timeStart: '21:00', timeEnd: '22:00' }
  });

  useEffect(() => {
    fetchPatients();
    fetchMedicines();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get(`/doctors/${doctorId}/patients`);
      setPatients(res.data);
    } catch (err) {
      setPatients([]);
    }
  };

  const fetchMedicines = async () => {
    try {
      const res = await api.get('/medicines');
      setAvailableMedicines(res.data);
    } catch (err) {
      setAvailableMedicines([
        { id: 1, name: 'Dolo 650' },
        { id: 2, name: 'Paracetamol 500mg' },
        { id: 3, name: 'Amoxicillin 250mg' },
        { id: 4, name: 'Cetirizine 10mg' },
        { id: 5, name: 'Metformin 500mg' },
        { id: 6, name: 'Amlodipine 5mg' }
      ]);
    } finally {
      setLoadingData(false);
    }
  };

  const handleConditionChange = (val) => {
    if (!val) return;
    setPatientCondition(val);
    // Auto-reset caretaker type based on condition
    if (val === 'STABLE') {
      setCaretakerType('SELF');
    } else {
      setCaretakerType('STAFF');
    }
    setCaretakerName('');
    setCaretakerPhone('');
  };

  const toggleFrequency = (slot) => {
    const freq = currentMed.frequency.includes(slot)
      ? currentMed.frequency.filter(f => f !== slot)
      : [...currentMed.frequency, slot];
    setCurrentMed({ ...currentMed, frequency: freq });
  };

  const updateSlot = (slot, field, value) => {
    setCurrentMed({ ...currentMed, [slot]: { ...currentMed[slot], [field]: value } });
  };

  const handleAddMedicine = () => {
    if (!currentMed.medicineId || !currentMed.dosage || currentMed.frequency.length === 0) {
      alert('Please select medicine, dosage, and at least one time slot!');
      return;
    }
    setMedicines([...medicines, { ...currentMed }]);
    setCurrentMed({
      medicineId: '', medicineName: '', dosage: '', durationDays: '', frequency: [],
      morning: { meal: '', timeStart: '07:00', timeEnd: '09:00' },
      afternoon: { meal: '', timeStart: '12:00', timeEnd: '13:00' },
      night: { meal: '', timeStart: '21:00', timeEnd: '22:00' }
    });
    setOpenDialog(false);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!selectedPatient || medicines.length === 0) {
      setErrorMsg('Please select a patient and add at least one medicine!');
      return;
    }
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Build caretaker data
    let finalCaretakerName = null;
    let finalCaretakerPhone = null;

    if (patientCondition === 'STABLE' && caretakerType === 'FAMILY') {
      finalCaretakerName = caretakerName;
      finalCaretakerPhone = caretakerPhone;
    } else if (patientCondition === 'CRITICAL') {
      // Store staff shift info as JSON string
      finalCaretakerName = JSON.stringify(staffShifts);
    }

    const payload = {
      patientId: selectedPatient,
      remarks,
      patientCondition,
      caretakerType,
      caretakerName: finalCaretakerName,
      caretakerPhone: finalCaretakerPhone,
      medicines: medicines.map(m => ({
        medicineId: m.medicineId,
        dosage: m.dosage,
        durationDays: m.durationDays ? parseInt(m.durationDays) : 7,
        frequency: m.frequency.join(',').toUpperCase(),
        morningMeal: m.morning.meal,
        morningTimeStart: m.morning.timeStart,
        morningTimeEnd: m.morning.timeEnd,
        afternoonMeal: m.afternoon.meal,
        afternoonTimeStart: m.afternoon.timeStart,
        afternoonTimeEnd: m.afternoon.timeEnd,
        nightMeal: m.night.meal,
        nightTimeStart: m.night.timeStart,
        nightTimeEnd: m.night.timeEnd
      }))
    };

    try {
      await api.post(`/prescriptions/${doctorId}`, payload);
      setSuccessMsg('✅ Prescription saved! Patient can now see their medicines.');
      setSelectedPatient('');
      setRemarks('');
      setMedicines([]);
      setPatientCondition('STABLE');
      setCaretakerType('SELF');
      setCaretakerName('');
      setCaretakerPhone('');
      setStaffShifts({
        morning: { name: '', phone: '' },
        afternoon: { name: '', phone: '' },
        night: { name: '', phone: '' }
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to save prescription. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const slotColors = {
    morning: { bg: '#fff8e1', color: '#f57f17', border: '#ffe082', label: '🌅 Morning', time: '7:00 AM - 9:00 AM' },
    afternoon: { bg: '#e3f2fd', color: '#1565c0', border: '#90caf9', label: '☀️ Afternoon', time: '12:00 PM - 1:00 PM' },
    night: { bg: '#ede7f6', color: '#4527a0', border: '#b39ddb', label: '🌙 Night', time: '9:00 PM - 10:00 PM' }
  };

  const shiftConfig = [
    { key: 'morning', label: '🌅 Morning Shift', time: '6:00 AM – 2:00 PM', color: '#f57f17', bg: '#fff8e1', border: '#ffe08244' },
    { key: 'afternoon', label: '☀️ Afternoon Shift', time: '2:00 PM – 10:00 PM', color: '#1565c0', bg: '#e3f2fd', border: '#90caf944' },
    { key: 'night', label: '🌙 Night Shift', time: '10:00 PM – 6:00 AM', color: '#4527a0', bg: '#ede7f6', border: '#b39ddb44' }
  ];

  if (loadingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress sx={{ color: '#0062ff' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="xl">

        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b' }}>Create Prescription</Typography>
          <Typography color="textSecondary">Write detailed prescriptions with medication timing and caretaker assignment</Typography>
        </Box>

        {successMsg && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}
        {errorMsg && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}

        {/* ─── STEP 1: Patient & Notes ─── */}
        <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0', mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Box sx={{ bgcolor: '#0062ff', color: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14 }}>1</Box>
              <Typography variant="h6" fontWeight="bold">Patient & Notes</Typography>
            </Box>

            {patients.length === 0 ? (
              <Box sx={{ p: 3, bgcolor: '#fff3e0', borderRadius: 3, border: '1px solid #ffe082' }}>
                <Typography color="textSecondary" fontWeight="bold">⚠️ No patients connected yet!</Typography>
                <Typography variant="body2" color="textSecondary" mt={0.5}>
                  Patients will appear here after they send you a request and you accept it from Patient Requests page.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Patient *</InputLabel>
                    <Select
                      value={selectedPatient}
                      onChange={(e) => setSelectedPatient(e.target.value)}
                      label="Select Patient *"
                      sx={{ borderRadius: 2 }}
                    >
                      {patients.map(p => (
                        <MenuItem key={p.id} value={p.id}>
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Avatar sx={{ bgcolor: '#0062ff', width: 32, height: 32, fontSize: 14 }}>
                              {p.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography fontWeight="bold" fontSize="0.9rem">{p.name}</Typography>
                              <Typography variant="caption" color="textSecondary">{p.age} yrs • {p.gender}</Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Doctor's Remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    multiline rows={2}
                    placeholder="E.g. Follow up after 7 days, avoid spicy food..."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>

        {/* ─── STEP 2: Patient Condition & Caretaker ─── */}
        <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0', mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Box sx={{ bgcolor: '#0062ff', color: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14 }}>2</Box>
              <Typography variant="h6" fontWeight="bold">Patient Condition & Caretaker Assignment</Typography>
            </Box>

            {/* Patient Condition Cards */}
            <Typography variant="body2" fontWeight="bold" mb={1.5} sx={{ color: '#475569' }}>Patient Condition *</Typography>
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} md={6}>
                <Box
                  onClick={() => handleConditionChange('STABLE')}
                  sx={{
                    p: 3, borderRadius: 3, cursor: 'pointer',
                    border: patientCondition === 'STABLE' ? '2px solid #2e7d32' : '1px solid #e2e8f0',
                    bgcolor: patientCondition === 'STABLE' ? '#f1f8e9' : 'white',
                    transition: 'all 0.2s', '&:hover': { borderColor: '#2e7d32' }
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box sx={{ bgcolor: '#e8f5e9', p: 1.5, borderRadius: 2 }}>
                      <PersonOutline sx={{ color: '#2e7d32', fontSize: 28 }} />
                    </Box>
                    <Box flex={1}>
                      <Typography fontWeight="bold">✅ Stable Patient</Typography>
                      <Typography variant="caption" color="textSecondary">Can manage medication with self or family help</Typography>
                    </Box>
                    {patientCondition === 'STABLE' && <CheckCircle sx={{ color: '#2e7d32' }} />}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  onClick={() => handleConditionChange('CRITICAL')}
                  sx={{
                    p: 3, borderRadius: 3, cursor: 'pointer',
                    border: patientCondition === 'CRITICAL' ? '2px solid #d32f2f' : '1px solid #e2e8f0',
                    bgcolor: patientCondition === 'CRITICAL' ? '#fff5f5' : 'white',
                    transition: 'all 0.2s', '&:hover': { borderColor: '#d32f2f' }
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box sx={{ bgcolor: '#ffebee', p: 1.5, borderRadius: 2 }}>
                      <LocalHospital sx={{ color: '#d32f2f', fontSize: 28 }} />
                    </Box>
                    <Box flex={1}>
                      <Typography fontWeight="bold">🚨 Critical Patient</Typography>
                      <Typography variant="caption" color="textSecondary">Needs professional hospital staff monitoring</Typography>
                    </Box>
                    {patientCondition === 'CRITICAL' && <CheckCircle sx={{ color: '#d32f2f' }} />}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* ── STABLE: Self or Family ── */}
            {patientCondition === 'STABLE' && (
              <>
                <Typography variant="body2" fontWeight="bold" mb={1.5} sx={{ color: '#475569' }}>Who will monitor medication?</Typography>
                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12} md={6}>
                    <Box
                      onClick={() => setCaretakerType('SELF')}
                      sx={{
                        p: 3, borderRadius: 3, cursor: 'pointer',
                        border: caretakerType === 'SELF' ? '2px solid #0062ff' : '1px solid #e2e8f0',
                        bgcolor: caretakerType === 'SELF' ? '#f0f7ff' : 'white',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box sx={{ bgcolor: '#e3f2fd', p: 1.5, borderRadius: 2 }}>
                          <Person sx={{ color: '#0062ff', fontSize: 28 }} />
                        </Box>
                        <Box flex={1}>
                          <Typography fontWeight="bold">👤 Self</Typography>
                          <Typography variant="caption" color="textSecondary">Patient marks their own medicines</Typography>
                        </Box>
                        {caretakerType === 'SELF' && <CheckCircle sx={{ color: '#0062ff' }} />}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      onClick={() => setCaretakerType('FAMILY')}
                      sx={{
                        p: 3, borderRadius: 3, cursor: 'pointer',
                        border: caretakerType === 'FAMILY' ? '2px solid #0062ff' : '1px solid #e2e8f0',
                        bgcolor: caretakerType === 'FAMILY' ? '#f0f7ff' : 'white',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box sx={{ bgcolor: '#e3f2fd', p: 1.5, borderRadius: 2 }}>
                          <FamilyRestroom sx={{ color: '#0062ff', fontSize: 28 }} />
                        </Box>
                        <Box flex={1}>
                          <Typography fontWeight="bold">👨‍👩‍👧 Family / Friend</Typography>
                          <Typography variant="caption" color="textSecondary">A family member monitors the patient</Typography>
                        </Box>
                        {caretakerType === 'FAMILY' && <CheckCircle sx={{ color: '#0062ff' }} />}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Family details */}
                {caretakerType === 'FAMILY' && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth label="Caretaker Name *"
                        value={caretakerName}
                        onChange={(e) => setCaretakerName(e.target.value)}
                        placeholder="e.g. Raju (Brother)"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth label="Caretaker Phone *"
                        value={caretakerPhone}
                        onChange={(e) => setCaretakerPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                  </Grid>
                )}
              </>
            )}

            {/* ── CRITICAL: Staff Shifts ── */}
            {patientCondition === 'CRITICAL' && (
              <>
                <Box sx={{ p: 2, bgcolor: '#fff5f5', borderRadius: 3, border: '1px solid #ffcdd2', mb: 3 }}>
                  <Typography fontWeight="bold" sx={{ color: '#d32f2f' }}>🏥 Assign Medical Staff per Shift</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Each assigned staff member will monitor and give medicines to the patient during their shift
                  </Typography>
                </Box>

                {shiftConfig.map(shift => (
                  <Box
                    key={shift.key}
                    sx={{ p: 2.5, borderRadius: 3, bgcolor: shift.bg, border: `1px solid ${shift.color}33`, mb: 2 }}
                  >
                    <Typography fontWeight="bold" sx={{ color: shift.color, mb: 1.5 }}>
                      {shift.label}{' '}
                      <Typography component="span" variant="caption" color="textSecondary">({shift.time})</Typography>
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth size="small"
                          label="Staff Name"
                          value={staffShifts[shift.key].name}
                          onChange={e => setStaffShifts({
                            ...staffShifts,
                            [shift.key]: { ...staffShifts[shift.key], name: e.target.value }
                          })}
                          placeholder="e.g. Nurse Priya"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth size="small"
                          label="Staff Phone"
                          value={staffShifts[shift.key].phone}
                          onChange={e => setStaffShifts({
                            ...staffShifts,
                            [shift.key]: { ...staffShifts[shift.key], phone: e.target.value }
                          })}
                          placeholder="e.g. 9876543210"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </>
            )}
          </CardContent>
        </Card>

        {/* ─── STEP 3: Medicines ─── */}
        <Card sx={{ borderRadius: 4, boxShadow: 2, border: '1px solid #e2e8f0', mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ bgcolor: '#0062ff', color: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14 }}>3</Box>
                <Typography variant="h6" fontWeight="bold">Medicines ({medicines.length})</Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenDialog(true)}
                sx={{ bgcolor: '#0062ff', fontWeight: 700, borderRadius: 2 }}
              >
                Add Medicine
              </Button>
            </Box>

            {medicines.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 3, border: '2px dashed #e2e8f0' }}>
                <Typography color="textSecondary" fontWeight="bold">No medicines added yet</Typography>
                <Typography variant="caption" color="textSecondary">Click "Add Medicine" to add medications</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: 3 }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell><strong>Medicine</strong></TableCell>
                      <TableCell><strong>Dosage</strong></TableCell>
                      <TableCell><strong>Duration</strong></TableCell>
                      <TableCell><strong>Slots</strong></TableCell>
                      <TableCell><strong>Schedule</strong></TableCell>
                      <TableCell><strong>Remove</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medicines.map((med, index) => (
                      <TableRow key={index}>
                        <TableCell><Typography fontWeight="bold">{med.medicineName}</Typography></TableCell>
                        <TableCell>
                          <Chip label={med.dosage} size="small" sx={{ bgcolor: '#e3f2fd', color: '#0062ff', fontWeight: 700 }} />
                        </TableCell>
                        <TableCell><Typography>{med.durationDays || 7} days</Typography></TableCell>
                        <TableCell>
                          <Box display="flex" gap={0.5} flexWrap="wrap">
                            {med.frequency.map(f => (
                              <Chip key={f} label={f} size="small"
                                sx={{
                                  bgcolor: f === 'morning' ? '#fff8e1' : f === 'afternoon' ? '#e3f2fd' : '#ede7f6',
                                  color: f === 'morning' ? '#f57f17' : f === 'afternoon' ? '#1565c0' : '#4527a0',
                                  fontWeight: 700
                                }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" flexDirection="column" gap={0.3}>
                            {med.frequency.includes('morning') && (
                              <Typography variant="caption" sx={{ color: '#f57f17' }}>
                                🌅 {med.morning.meal || '-'} | {med.morning.timeStart}–{med.morning.timeEnd}
                              </Typography>
                            )}
                            {med.frequency.includes('afternoon') && (
                              <Typography variant="caption" sx={{ color: '#1565c0' }}>
                                ☀️ {med.afternoon.meal || '-'} | {med.afternoon.timeStart}–{med.afternoon.timeEnd}
                              </Typography>
                            )}
                            {med.frequency.includes('night') && (
                              <Typography variant="caption" sx={{ color: '#4527a0' }}>
                                🌙 {med.night.meal || '-'} | {med.night.timeStart}–{med.night.timeEnd}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleRemoveMedicine(index)} color="error" size="small">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          fullWidth variant="contained" size="large"
          onClick={handleSave} disabled={saving || patients.length === 0}
          sx={{ py: 2, bgcolor: '#0062ff', fontWeight: 800, fontSize: '1rem', borderRadius: 3 }}
        >
          {saving ? 'Saving Prescription...' : '💾 Save Prescription'}
        </Button>

        {/* ─── Add Medicine Dialog ─── */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' }}>
            ➕ Add Medicine
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Medicine *</InputLabel>
                  <Select
                    value={currentMed.medicineId}
                    onChange={(e) => {
                      const med = availableMedicines.find(m => m.id === e.target.value);
                      setCurrentMed({ ...currentMed, medicineId: e.target.value, medicineName: med?.name || '' });
                    }}
                    label="Select Medicine *"
                    sx={{ borderRadius: 2 }}
                  >
                    {availableMedicines.map(m => (
                      <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth label="Dosage *" placeholder="e.g. 650mg"
                  value={currentMed.dosage}
                  onChange={(e) => setCurrentMed({ ...currentMed, dosage: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth label="Duration (days)" type="number" placeholder="e.g. 7"
                  value={currentMed.durationDays}
                  onChange={(e) => setCurrentMed({ ...currentMed, durationDays: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" fontWeight="bold" mb={2} sx={{ color: '#1e293b' }}>
                  Select Time Slots *
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {['morning', 'afternoon', 'night'].map(slot => {
                    const config = slotColors[slot];
                    const isSelected = currentMed.frequency.includes(slot);
                    return (
                      <Box
                        key={slot}
                        onClick={() => toggleFrequency(slot)}
                        sx={{
                          p: 2, borderRadius: 3, cursor: 'pointer',
                          border: isSelected ? `2px solid ${config.color}` : '1px solid #e2e8f0',
                          bgcolor: isSelected ? config.bg : '#fafafa',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center" gap={1.5}>
                            <Typography fontWeight="bold" sx={{ color: config.color }}>{config.label}</Typography>
                            <Typography variant="caption" color="textSecondary">{config.time}</Typography>
                          </Box>
                          {isSelected && <CheckCircle sx={{ color: config.color }} />}
                        </Box>

                        {isSelected && (
                          <Box mt={2} onClick={e => e.stopPropagation()}>
                            <Grid container spacing={1.5}>
                              <Grid item xs={12}>
                                <ToggleButtonGroup
                                  value={currentMed[slot].meal}
                                  exclusive
                                  onChange={(e, val) => val && updateSlot(slot, 'meal', val)}
                                  size="small" fullWidth
                                >
                                  <ToggleButton value="before" sx={{ fontWeight: 700, borderRadius: '8px 0 0 8px' }}>
                                    🍽️ Before Meal
                                  </ToggleButton>
                                  <ToggleButton value="after" sx={{ fontWeight: 700, borderRadius: '0 8px 8px 0' }}>
                                    ✅ After Meal
                                  </ToggleButton>
                                </ToggleButtonGroup>
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  fullWidth type="time" label="Start Time" size="small"
                                  value={currentMed[slot].timeStart}
                                  onChange={(e) => updateSlot(slot, 'timeStart', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  fullWidth type="time" label="End Time" size="small"
                                  value={currentMed[slot].timeEnd}
                                  onChange={(e) => updateSlot(slot, 'timeEnd', e.target.value)}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ fontWeight: 700 }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAddMedicine}
              sx={{ bgcolor: '#0062ff', fontWeight: 700, borderRadius: 2 }}
            >
              Add to Prescription
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  );
};

export default Prescriptions;