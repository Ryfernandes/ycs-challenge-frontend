import './ColorBlock.css';

interface Props {
  id: number;
  title: string;
  desc: string;
  available: boolean;
  points: number;
  open: (id: number) => void;
  color: string;
}

function ColorBlock ({ id, title, desc, available, points, open, color }: Props) {
  const handleClick = () => {
    open(id)
  }

  return (
    <div className={`block ${available ? '' : 'completed'} ${color}`} onClick={handleClick}>
      <div className='inner-text'>
        <div className='first-row'>
          <div className='title-container'>
            <div className='block-title font-dm-sans'>{title}</div>
            <div className='block-subtitle font-dm-sans'>({available ? 'available' : 'completed'})</div>
          </div>
          <div className='points-title font-dm-sans'>{points > 0 ? '+' : ''}{points} pts</div>
        </div>
        <div className='block-desc font-dm-sans'>{desc}</div>
      </div>
    </div>
  )
}

export default ColorBlock;