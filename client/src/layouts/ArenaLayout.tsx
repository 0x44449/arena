import { Outlet } from "react-router-dom";
import VaultPage from "@/pages/Vault/VaultPage";

function ArenaLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside
        style={{
          width: 80,
          borderRight: '1px solid #e5e7eb',
          background: '#f9fafb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <VaultPage />
      </aside>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}

export default ArenaLayout;