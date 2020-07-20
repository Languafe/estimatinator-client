import React, { useState, useEffect } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import io from 'socket.io-client';

import Scoreboard from './Scoreboard';
import VotingPanel from './VotingPanel';

import './Estimatinator.css';

const estimatinatorEndpoint = 'http://10.0.0.107:5000';


const Estimatinator = ({ match }) => {
  const history = useHistory();
  let { session } = useParams();

  const [connection, setConnection] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [username, setUsername] = useState(localStorage.username);
  const [sessionId, setSessionId] = useState(session || '');
  const [estimatinatorState, setEstimatinatorState] = useState('disconnected');
  const [users, setUsers] = useState([]);
  const [myVote, setMyVote] = useState(null);
  const [copyResultMessage, setCopyResultMessage] = useState('');

  useEffect(() => {
    if (username && session) {
      const socket = io(estimatinatorEndpoint, {
        query: {
          username,
          session
        }
      });
      setConnection(socket);

      return () => {
        setConnection(null);
        socket.disconnect();
      };
    }
  }, [username, session]);

  const handleChangeUsername = (username) => {
    localStorage.username = username;
    setUsername(username);
  };

  const handleJoinSession = () => {
    if (!username || !sessionId) {
      alert('you must set username and session to connect');
    }
    else {
      history.push(sessionId);
    }
  };

  const handleResetReceived = () => {
    setMyVote(null);
    setEstimatinatorState('voting');
  };

  const handleRevealReceived = () => {
    setEstimatinatorState('voting-finished');
  };

  useEffect(() => {
    const handleChangedUsers = users => setUsers(users);
    if (connection) {
      setEstimatinatorState('connected');
      connection.on('users', handleChangedUsers);
      connection.on('reset', handleResetReceived);
      connection.on('reveal', handleRevealReceived);
      return () => {
        connection.off('users', handleChangedUsers);
        connection.off('reset', handleResetReceived);
        connection.off('reveal', handleRevealReceived);
      };
    }
  }, [connection]);



  const handleVote = (value) => {
    setMyVote(value);
    connection.emit('vote', value);
  };

  const handleLeave = () => {
    window.location.pathname = '/';
  };

  const copySessionUrlToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopyResultMessage('Copied to clipboard!');
    setTimeout(() => setCopyResultMessage(''), 5000);
  };

  const handleReset = () => {
    connection.emit('reset');
    setMyVote(null);
  };

  const handleReveal = () => {
    connection.emit('reveal');
  };

  return (
    <div className="App">
      <h1>Estimatinator</h1>
      {session &&
        <div>
          <div>Session ID: <i>{session}</i> <button onClick={copySessionUrlToClipboard}>Copy</button> {copyResultMessage}</div>
          <button className="leave" onClick={handleLeave}>Leave</button>
        </div>
      }
      {estimatinatorState === 'disconnected' ?
        <form onSubmit={(e) => { e.preventDefault(); handleJoinSession(); }}>
          <div className="row">
            <label htmlFor="username">Username</label>
            <input onBlur={() => handleChangeUsername(usernameInput)} required value={usernameInput} autoFocus={!usernameInput} spellCheck="false" id="username" autoComplete="off" onChange={(e) => setUsernameInput(e.target.value)} />
          </div>
          <div className="row">
            <label htmlFor="session-id">Session</label>
            <input required value={sessionId} autoFocus={!session && username} spellCheck="false" id="session-id" autoComplete="off" onChange={(e) => setSessionId(e.target.value)} />
          </div>
          <button type="submit">Join</button>
        </form>
        :
        <>


          {estimatinatorState === 'voting'
            ? <>
              <div>
                {users.map(u => `${u.username}${u.vote !== undefined ? '✔' : ''}`).join(', ')}
              </div>
              <VotingPanel selected={myVote} onSubmit={(value) => handleVote(value)} />
            </>
            : 
            <>
            <Scoreboard users={users} />
            {!myVote && <VotingPanel selected={myVote} onSubmit={(value) => handleVote(value)} />}
            </>
          }
        </>
      }
      <hr />
      <div>
        <button onClick={handleReset}>Clear votes</button>
        <button onClick={handleReveal}>Reveal current votes</button>
      </div>
    </div>
  );
};

export default Estimatinator;
