import './Modal.css';
import type { Challenge, Team } from '../utils/types';

interface Props {
  challenge: Challenge;
  close: () => void;
  teams: Record<string, Team>,
}

function Modal({ challenge, close, teams }: Props) {

  return (
    <div className='modal-overlay' onClick={close}>
      <div className={`modal ${challenge.color}`} onClick={(e) => e.stopPropagation()}>
        <div className='modal-inner-text'>
          <div className='modal-first-row'>
            <div className='modal-title-container'>
              <div className='modal-title font-dm-sans'>{challenge.title}</div>
            </div>
            <div className='modal-points-title font-dm-sans'>+{challenge.points} pts</div>
          </div>
          <div className='modal-desc font-dm-sans'>{challenge.description}</div>
          <div className='modal-status font-dm-sans'><strong>Task status:</strong> {challenge.completed_by == null ? 'Available' : `Completed by `} <u>{challenge.completed_by ? teams[challenge.completed_by].name : ''}</u></div>
        </div>
      </div>
    </div>
  )
}

export default Modal