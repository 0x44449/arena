import './VaultBanner.css';

interface VaultBannerProps {
  name: string;
}

function VaultBanner(props: VaultBannerProps) {
  return (
    <div className="vault-banner">
      <div className="vault-banner__name" title={props.name}>{props.name}</div>
    </div>
  )
}

export default VaultBanner;
