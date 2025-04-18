import './ZoneLabel.css';

interface ZoneLabelProps {
  id: string;
  name: string;
  isActive: boolean;
  onClick?: (id: string, name: string, isActive: boolean) => void;
}

function ZoneLabel(props: ZoneLabelProps) {
  const handleClick = () => {
    props.onClick?.(props.id, props.name, props.isActive);
  };

  return (
    <div onClick={handleClick} className={`zone-label ${props.isActive ? 'active' : ''}`}>
      <span>#</span>{props.name}
    </div>
  )
}

export default ZoneLabel;
