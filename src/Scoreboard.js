import React from 'react';

import './Scoreboard.css';

const Scoreboard = ({ users }) => {
  return (
    <table className="scoreboard">
      <thead>
        <tr>
          <th>Estimator</th>
          <th>Estimation</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u =>
          <tr key={u.username}>
            <td>{u.username}</td>
            <td>{u.vote}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Scoreboard;
