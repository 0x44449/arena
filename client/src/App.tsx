import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './pages/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';
import useBootstrap from './bootstrap';
import ArenaPage from './pages/ArenaPage';
import SettingPage from './pages/SettingPage';
import ProfileSettingPage from './pages/setting/ProfileSettingPage';
import IndexRedirect from './pages/IndexRedirect';

export default function App() {
  useBootstrap();

  return (
    <Routes>
      <Route path="/" element={<IndexRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/arena/*" element={<ProtectedRoute><ArenaPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingPage /></ProtectedRoute>}>
        <Route path="profile" element={<ProfileSettingPage />} />
      </Route>
    </Routes>
  )
}
