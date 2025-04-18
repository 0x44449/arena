import { Outlet } from "react-router-dom";
import ZonePage from "@/pages/Zone/ZonePage";

function VaultLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside
        style={{
          width: 240,
          borderRight: '1px solid #e5e7eb',
          background: '#ffffff'
        }}
      >
        <ZonePage />
      </aside>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}

export default VaultLayout;
