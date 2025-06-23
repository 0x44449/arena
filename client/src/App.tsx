import { Routes, Route } from 'react-router-dom';
import ArenaLayout from '@/layouts/ArenaLayout';
import TeamLayout from './layouts/TeamLayout';
import WorkspaceLayout from './layouts/WorkspaceLayout';
import LoginPage from './pages/Auth/LoginPage';
import ProtectedRoute from './pages/Auth/ProtectedRoute';
import RegisterPage from './pages/Auth/RegisterPage';
import IndexPage from './pages/IndexPage';
import useBootstrap from './bootstrap';
import ArenaView from './views/ArenaView';

export default function App() {
  useBootstrap();

  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/arena/*" element={<ProtectedRoute><ArenaView /></ProtectedRoute>} />
    </Routes>
  )
}
