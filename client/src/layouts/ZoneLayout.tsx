import { Outlet } from "react-router-dom";

function ZoneLayout() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#ffffff'
      }}
    >
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}

export default ZoneLayout;
