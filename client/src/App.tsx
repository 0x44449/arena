import { Routes, Route } from 'react-router-dom';
import ArenaLayout from '@/layouts/ArenaLayout';
import VaultLayout from '@/layouts/VaultLayout';
import ZoneLayout from '@/layouts/ZoneLayout';
import DeckLayout from './layouts/DeckLayout';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ArenaLayout />}>
        <Route index element={<div>Vault를 선택하세요</div>} />
        <Route path="vault/:vaultId" element={<VaultLayout />}>
          <Route index element={<div>Zone을 선택하세요</div>} />
          <Route path="zone/:zoneId" element={<ZoneLayout />}>
            <Route index element={<DeckLayout />} />
            <Route path="deck/chat" element={<DeckLayout />} />
            <Route path="deck/board" element={<DeckLayout />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
