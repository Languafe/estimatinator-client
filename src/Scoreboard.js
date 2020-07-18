import React from 'react';

import './Scoreboard.css';

const Scoreboard = ({ votes }) => {
  return (
    <table className="scoreboard">
      <thead>
        <tr>
          <th>Estimator</th>
          <th>Estimation</th>
        </tr>
      </thead>
      <tbody>
        {votes.map(v =>
          <tr key={v.username}>
            <td>{v.username}</td>
            <td>{v.vote}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Scoreboard;
