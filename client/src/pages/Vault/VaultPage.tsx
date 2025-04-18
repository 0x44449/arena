import VaultIcon from './VaultIcon';
import { useVaultsQuery } from '@/hooks/vault';
import { useNavigate, useParams } from 'react-router-dom';

function VaultPage() {
  const navigate = useNavigate();
  const { vaultId } = useParams<{ vaultId: string }>();
  const { data: vaults, isLoading, error } = useVaultsQuery();

  const handleOutpostIconClick = (id: string) => {
    navigate(`/vault/${id}`);
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      {vaults?.map((vault) => (
        <VaultIcon
          key={vault.vaultId}
          id={vault.vaultId}
          name={vault.name}
          isActive={vaultId === vault.vaultId}
          onClick={handleOutpostIconClick}
        />
      ))}
    </div>
  )
}

export default VaultPage;
