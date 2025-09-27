import './App.css';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import type { Challenge } from './utils/types';

const socket = io('http://localhost:3001');

function App() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    socket.on('challenge-update', (data) => {
      setChallenges((prev) => ({
        ...prev,
        [data.id]: data
      }));
    });

    return () => {
      socket.off('challenge-update');
    };
  }, []);

  const sortedChallenges = challenges.sort((a, b) => a.id - b.id);

  return (
    <div>
      <h1>Challenge Dashboard</h1>
      <ul>
        {sortedChallenges.map((challenge) => (
          <li key={challenge.id}>
            <strong>{challenge.title}</strong> — {challenge.status}<br/>
            <small>{challenge.description}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
