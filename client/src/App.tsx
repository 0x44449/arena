import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import ProtectedRoute from './pages/Auth/ProtectedRoute';
import RegisterPage from './pages/Auth/RegisterPage';
import IndexPage from './pages/IndexPage';
import useBootstrap from './bootstrap';
import ArenaView from './views/ArenaView';
import ProfileView from './views/SettingView/ProfileView';
import SettingView from './views/SettingView';

export default function App() {
  useBootstrap();

  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/arena/*" element={<ProtectedRoute><ArenaView /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingView /></ProtectedRoute>}>
        <Route path="profile" element={<ProfileView />} />
      </Route>
    </Routes>
  )
}
