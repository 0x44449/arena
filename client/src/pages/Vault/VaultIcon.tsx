import './VaultIcon.css';

interface VaultIconProps {
  id: string;
  name: string;
  isActive: boolean;
  onClick?: (id: string, name: string, isActive: boolean) => void;
}

function VaultIcon(props: VaultIconProps) {
  const handleClick = () => {
    props.onClick?.(props.id, props.name, props.isActive);
  }

  return (
    <div onClick={handleClick} className={`vault-icon ${props.isActive ? 'active' : ''}`}>
      {props.name.charAt(0)}
    </div>
  )
}

export default VaultIcon;
