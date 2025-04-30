import { Routes, Route } from 'react-router-dom';
import ArenaLayout from '@/layouts/ArenaLayout';
import TeamLayout from './layouts/TeamLayout';
import WorkspaceLayout from './layouts/WorkspaceLayout';
import LoginPage from './pages/Login/LoginPage';
import ProtectedRoute from './pages/Login/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
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
