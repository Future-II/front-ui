import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './shared/components/Layout/Layout';
import Home from './features/Home/pages/Home';
import MekyasReports from './features/Reports/pages/MekyasReports';
import ViewReports from './features/Reports/pages/ViewReports';
import NoqraReports from './features/Reports/pages/NoqraReports';
import ManagementDashboard from './features/Dashboard/pages/ManagementDashboard';
import UserSettings from './features/Settings/pages/UserSettings';
import SupportPage from './features/Support/pages/SupportPage';
import MekyasLogin from './features/Reports/pages/MekyasLogin';
import AuthGuard from './shared/components/AuthGuard'; // ⬅️ add this
import EquipmentReport from './features/Equipment/pages/EquipmentReport';

export function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Protect Mekyas Reports */}
          <Route
            path="/reports/mekyas"
            element={
              <AuthGuard>
                <MekyasReports />
              </AuthGuard>
            }
          />

          <Route path="/reports/view" element={<ViewReports />} />
          <Route path="/reports/noqra" element={<NoqraReports />} />
          <Route path="/dashboard" element={<ManagementDashboard />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/support" element={<SupportPage />} />

          {/* Login route */}
          <Route path="/auth/mekyas" element={<MekyasLogin />} />
          <Route path='/reports/equipment' element={<EquipmentReport/>} />
        </Routes>
      </Layout>
    </Router>
  );
}
