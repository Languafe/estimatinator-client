import React, { useEffect, useState } from 'react';
// import { BrowserRouter } from 'react-router';

import io from 'socket.io-client';

import './App.css';
import Scoreboard from './Scoreboard';
import VotingPanel from './VotingPanel';

const estimatinatorEndpoint = 'http://10.0.0.107:5000';

function App() {
  const [connection, setConnection] = useState(null);
  const [username, setUsername] = useState(localStorage.username);
  const [session, setSession] = useState('estimatinator');
  const [estimatinatorState, setEstimatinatorState] = useState('disconnected');
  const [users, setUsers] = useState([]);
  const [votes, setVotes] = useState([]);

  const handleChangeUsername = (username) => {
    localStorage.username = username;
    setUsername(username);
  };

  const handleUserJoin = (user) => {
    console.log('someone joined');
  };

  const handleJoinSession = (sessionId) => {
    if (!username || !session) {
      alert('you must set username and session to connect');
    }
    else {
      const socket = io(estimatinatorEndpoint, {
        query: {
          username,
          session
        }
      });
      setConnection(socket);
    }
  };

  useEffect(() => {
    if (connection) {
      setEstimatinatorState('connected');
      connection.on('users', users => {
        setUsers(users);
      });
      return () => connection.off('joined', handleUserJoin);
    }
  }, [connection, users]);

  // const handleVote = (value) => {
  // };

  return (
    <div className="App">
      <h1>Estimatinator</h1>
      {estimatinatorState === 'disconnected' ?
        <form onSubmit={(e) => {e.preventDefault(); handleJoinSession(); }}>
          <div className="row">
            <label htmlFor="username">Username</label>
            <input value={username} autoFocus={!username} spellCheck="false" id="username" autoComplete="off" onChange={(e) => handleChangeUsername(e.target.value)} />
          </div>
          <div className="row">
            <label htmlFor="session-id">Session</label>
            <input value={session} autoFocus={!session} spellCheck="false" id="session-id" autoComplete="off" onChange={(e) => setSession(e.target.value)} />
          </div>
          <button type="submit">Join</button>
        </form>
        :
        <>
          <div>
            {users.map(u => u.username).join(', ')}
          </div>

          {estimatinatorState === 'voteFinished'
            ? <Scoreboard votes={votes} />
            : <VotingPanel onSubmit={() => setEstimatinatorState('voteFinished')} />
          }
        </>
      }

    </div>
  );
}

export default App;
