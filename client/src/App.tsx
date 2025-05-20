import { Routes, Route } from 'react-router-dom';
import ArenaLayout from '@/layouts/ArenaLayout';
import TeamLayout from './layouts/TeamLayout';
import WorkspaceLayout from './layouts/WorkspaceLayout';
import LoginPage from './pages/Auth/LoginPage';
import ProtectedRoute from './pages/Auth/ProtectedRoute';
import RegisterPage from './pages/Auth/RegisterPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/arena" element={
        <ProtectedRoute>
          <ArenaLayout />
        </ProtectedRoute>
      }>
        <Route path=":teamId" element={<TeamLayout />}>
          <Route path=":workspaceId" element={<WorkspaceLayout />}>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
