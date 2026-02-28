import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from './theme/theme';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Doctor imports
import DoctorLayout from './components/layout/DoctorLayout';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfile from './pages/doctor/DoctorProfile';
import PatientRequests from './pages/doctor/PatientRequests';
import MyPatients from './pages/doctor/MyPatients';
import Prescriptions from './pages/doctor/Prescriptions';
import PatientHistory from './pages/doctor/PatientHistory';
import PatientDetail from './pages/doctor/PatientDetail';

// Patient imports
import PatientLayout from './components/layout/PatientLayout';
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientMedications from './pages/patient/PatientMedications';
import PatientPrescriptions from './pages/patient/PatientPrescriptions';
import PatientProfile from './pages/patient/PatientProfile';
import FindDoctors from './pages/patient/FindDoctors';   // ← NEW

// Staff imports
import StaffLayout from './components/layout/StaffLayout';
import StaffDashboard from './pages/staff/StaffDashboard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Doctor Routes */}
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="requests" element={<PatientRequests />} />
            <Route path="patients" element={<MyPatients />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="profile" element={<DoctorProfile />} />
            <Route path="history" element={<PatientHistory />} />
            <Route path="patient/:patientId" element={<PatientDetail />} />
          </Route>

          {/* Patient Routes */}
          <Route path="/patient" element={<PatientLayout />}>
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="medications" element={<PatientMedications />} />
            <Route path="prescriptions" element={<PatientPrescriptions />} />
            <Route path="find-doctors" element={<FindDoctors />} />  {/* ← NEW */}
            <Route path="profile" element={<PatientProfile />} />
          </Route>

          {/* Staff Routes */}
          <Route path="/staff" element={<StaffLayout />}>
            <Route path="dashboard" element={<StaffDashboard />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;