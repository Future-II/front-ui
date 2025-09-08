import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './shared/components/Layout/Layout';
import Home from './features/Home/pages/Home';
import MekyasReports from './features/Reports/pages/MekyasReports';
import JadeerReports from './features/Reports/pages/JadeerReports';
import ViewReports from './features/Reports/pages/ViewReports';
import NoqraReports from './features/Reports/pages/NoqraReports';
import ManagementDashboard from './features/Dashboard/pages/ManagementDashboard';
import UserSettings from './features/Settings/pages/UserSettings';
import SupportPage from './features/Support/pages/SupportPage';
import MekyasLogin from './features/Reports/pages/MekyasLogin';
import AuthGuard from './shared/components/AuthGuard'; // Mekyas-specific auth guard
import GlobalAuthGuard from './shared/components/GlobalAuthGuard'; // Global auth guard
import EquipmentReport from './features/Equipment/pages/EquipmentReport';
import ManualPropertyExtraction from './features/Reports/sections/ManualPropertyExtraction';
import ReportForm from './features/Reports/pages/ReportForm';

export function App() {
  return (
    <Router>
      <GlobalAuthGuard>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Protect Mekyas Reports with its own auth (keep separate) */}
            <Route
              path="/reports/mekyas"
              element={
                <AuthGuard>
                  <MekyasReports />
                </AuthGuard>
              }
            />
            
            {/* All other routes are now protected by GlobalAuthGuard */}
            <Route path="/reports/jadeer" element={<JadeerReports />} />
            <Route path="/reports/manual" element={<ManualPropertyExtraction />} />
            <Route path="/reports/view" element={<ViewReports />} />
            <Route path="/reports/noqra" element={<NoqraReports />} />
            <Route path="/reports/newManual" element={<ReportForm />} />
            <Route path="/dashboard" element={<ManagementDashboard />} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/equipment/report" element={<EquipmentReport />} />

            {/* Mekyas login route (keep separate) */}
            <Route path="/auth/mekyas" element={<MekyasLogin />} />
          </Routes>
        </Layout>
      </GlobalAuthGuard>
    </Router>
  );
}