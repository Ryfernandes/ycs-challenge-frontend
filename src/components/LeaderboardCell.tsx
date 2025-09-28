import './LeaderboardCell.css';
import type { Team } from '../utils/types';

interface Props {
  team: Team
}


function LeaderboardCell({ team }: Props) {
  return (
    <div className='cell'>
      <div className='cell-name'>
        {team.name}
      </div>
      <div className='cell-points'>
        {team.points} points
      </div>
    </div>
  )
}

export default LeaderboardCell;