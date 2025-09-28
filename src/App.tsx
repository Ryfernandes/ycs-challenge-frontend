import './App.css';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

import type { Challenge, Team } from './utils/types';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import ColorBlock from './components/ColorBlock';
import LeaderboardCell from './components/LeaderboardCell';

const socket = io('https://ycs-challenge-backend.onrender.com/');

function App() {
  /*const exampleChallenges: Record<string, Challenge> = {
    '1': {'color': 'pink', 'id': 1, 'title': 'Eat a Watermelon', 'description': "That's it. Just eat a complete watermelon as a team. Bring us the empty rind to complete this challenge. And here is some empty text that is going to overflow the screen eventually so I can work on putting this onto two lines", 'points': 10, 'completed_by': null, 'updated_at': '2025-09-27 21:57:56.467494'},
    '2': {'color': 'green', 'id': 2, 'title': 'High Five Squared!', 'description': "High five five strangers in a row. You must high five all five strangers within five seconds and record the attempt in order for it to count.", 'points': 1000, 'completed_by': '1', 'updated_at': '2025-09-27 21:57:56.467494'},
    '3': {'color': 'pink', 'id': 3, 'title': 'Eat a Watermelon', 'description': "That's it. Just eat a complete watermelon as a team. Bring us the empty rind to complete this challenge.", 'points': 10, 'completed_by': '1', 'updated_at': '2025-09-27 21:57:56.467494'},
    '4': {'color': 'orange', 'id': 4, 'title': 'High Five Squared!', 'description': "High five five strangers in a row. You must high five all five strangers within five seconds and record the attempt in order for it to count.", 'points': 40, 'completed_by': '2', 'updated_at': '2025-09-27 21:57:56.467494'},
    '5': {'color': 'red', 'id': 5, 'title': 'Eat a Watermelon', 'description': "That's it. Just eat a complete watermelon as a team. Bring us the empty rind to complete this challenge.", 'points': 10, 'completed_by': null, 'updated_at': '2025-09-27 21:57:56.467494'},
    '6': {'color': 'blue', 'id': 6, 'title': 'High Five Squared!', 'description': "High five five strangers in a row. You must high five all five strangers within five seconds and record the attempt in order for it to count.", 'points': 40, 'completed_by': '3', 'updated_at': '2025-09-27 21:57:56.467494'},
    '7': {'color': 'red', 'id': 7, 'title': 'Eat a Watermelon', 'description': "That's it. Just eat a complete watermelon as a team. Bring us the empty rind to complete this challenge.", 'points': 10, 'completed_by': null, 'updated_at': '2025-09-27 21:57:56.467494'},
    '8': {'color': 'blue', 'id': 8, 'title': 'High Five Squared!', 'description': "High five five strangers in a row. You must high five all five strangers within five seconds and record the attempt in order for it to count.", 'points': 40, 'completed_by': '3', 'updated_at': '2025-09-27 21:57:56.467494'},
  }

  const exampleTeams: Record<string, Team> = {
    '1': {'id': 1, 'name': 'CourseTable', 'points': 0},
    '2': {'id': 2, 'name': 'y/labs', 'points': 0},
    '3': {'id': 3, 'name': 'Catalyst 1', 'points': 0}
  }*/

  const [challenges, setChallenges] = useState<Record<string, Challenge>>({});
  const [teamNames, setTeamNames] = useState<Record<string, Team>>({});
  const [teamsList, setTeamsList] = useState<Team[]>([]);

  const [selectedChallenge, setSelectedChallenge] = useState<string>("");

  useEffect(() => {
    const updateScores = () => {
      console.log('Updating scores');
      let currTeams: Record<string, Team> = teamNames;

      Object.values(currTeams).forEach((team: Team) => {
        currTeams[team.id].points = 0;
      });

      Object.values(challenges).forEach((challenge: Challenge) => {
        if (challenge.completed_by && challenge.completed_by in currTeams) {
          currTeams[challenge.completed_by].points += challenge.points;
        }
      });

      setTeamNames(currTeams);
      setTeamsList(Object.values(currTeams).sort((a, b) => b.points - a.points));
    }

    const timeout = setTimeout(() => {
      updateScores();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [challenges]);

  useEffect(() => {
    if (selectedChallenge) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => document.body.classList.remove('modal-open');
  }, [selectedChallenge]);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        console.log('Fetching');
        const res = await axios.get('https://ycs-challenge-backend.onrender.com/challenges');
        const challengeMap: Record<string, Challenge> = {};
        res.data.forEach((challenge: Challenge) => {
          challengeMap[challenge.id] = challenge;
        });
        setChallenges(challengeMap);
      } catch (err) {
        console.error('Failed to fetch challenges', err);
      }
    }

    async function fetchTeams() {
      try {
        console.log('Fetching');
        const res = await axios.get('https://ycs-challenge-backend.onrender.com/teams');
        const teamMap: Record<string, Team> = {};
        res.data.forEach((team: Team) => {
          teamMap[team.id] = {...team, 'points': 0};
        });
        console.log('Team Map:', teamMap);
        setTeamNames(teamMap);
        setTeamsList(Object.values(teamMap).sort((a, b) => b.points - a.points));
      } catch (err) {
        console.error('Failed to fetch teams', err);
      }
    }

    fetchTeams();
    console.log('Done fetching teams');
    fetchChallenges();
    console.log('Done fetching challenges');
  }, []);

  useEffect(() => {
    socket.on('challenge-update', ({type, challenge}) => {
      setChallenges((prev) => {
        const updated = { ...prev };

        if (type === 'INSERT' || type === 'UPDATE') {
          updated[challenge.id] = challenge;
        } else if (type === 'DELETE') {
          delete updated[challenge.id];
        }

        return updated;
      });
    });

    socket.on('team-update', ({type, team}) => {
      setTeamNames((prev) => {
        const updated = { ...prev };

        if (type === 'INSERT' || type === 'UPDATE') {
          updated[team.id] = team;
        } else if (type === 'DELETE') {
          delete updated[team.id];
        }

        return updated;
      });
    });

    return () => {
      socket.off('challenge-update');
      socket.off('team-update');
    };
  }, []);

  const sortedChallenges = Object.values(challenges).sort((a, b) => a.points - b.points);

  const openModal = (id: number) => {
    setSelectedChallenge(id.toString());
  }

  const closeModal = () => {
    setSelectedChallenge("");
  }

  return (
    <>
      <Navbar />

      <div
        className="ycs-background font-dm-sans"
      >
        y/cs
      </div>

      <h1 className="font-dm-sans title" >y/cs Initiation</h1>
      <p className="font-dm-sans description">
        Welcome to the <strong>2025 y/cs Initiation!</strong> As a team, you will race to complete as many
        initiation tasks as possible, shown below. When you complete a task, have your team leader text the
        initiation committee for review. If approved, the points shown will be awarded to your team, and the
        task will be locked. The prize of winning y/cs Initiation? Free boba at your development team or Catalyst
        group's first meeting. May the odds be ever in your favor!
      </p>

      <h1 className="font-dm-sans main-sub-title" >Leaderboard</h1>
      <div className="leaderboard-container">
        {teamsList.map((team) => (
          <LeaderboardCell
            team={team}
          />
        ))}
      </div>

      <h1 className="font-dm-sans main-sub-title" >Tasks</h1>
      <div className='boxes-container'>
        {sortedChallenges.map((challenge) => (
          <ColorBlock
            id={challenge.id}
            title={challenge.title}
            desc={challenge.description}
            available={challenge.completed_by == null}
            points={challenge.points}
            open={openModal}
            color={challenge.color}
          />
        ))}
      </div>

      {selectedChallenge ? (
        <div>
          <Modal
            challenge={challenges[selectedChallenge]}
            close={closeModal}
            teams={teamNames}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default App
