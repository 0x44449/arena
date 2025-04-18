import { useZoneQuery } from '@/hooks/zone';
import { useNavigate, useParams } from 'react-router-dom';
import ZoneLabel from './ZoneLabel';
import VaultBanner from './VaultBanner';
import { useCachedVault } from '@/hooks/vault';

function ZonePage() {
  const navigate = useNavigate();
  const { vaultId, zoneId } = useParams<{ vaultId: string, zoneId: string }>();
  const vault = useCachedVault(vaultId);
  const { data: zones, isLoading, error } = useZoneQuery(vaultId);

  const handleSpaceLabelClick = (id: string) => {
    navigate(`/vault/${vaultId}/zone/${id}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <VaultBanner name={vault?.name ?? ''} />
      <div>
        {zones?.map((zone) => (
          <ZoneLabel
            key={zone.zoneId}
            id={zone.zoneId}
            name={zone.name}
            isActive={zoneId === zone.zoneId}
            onClick={handleSpaceLabelClick}
          />
        ))}
      </div>
    </div>
  );
}

export default ZonePage;
