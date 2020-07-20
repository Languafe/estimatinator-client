import React from 'react';

import './VotingPanel.css';

const defaultOptions = [
  1,
  2,
  3,
  4,
  6,
  8,
  10,
  12,
  16
];

const VotingPanel = ({ options = defaultOptions, selected, onSubmit }) => {
  return (
    <div className="voting-panel">
      {options.map((value, i) =>
        <button key={i} className={selected === value ? 'selected' : ''} onClick={() => onSubmit(value)}>{value}</button>)}
    </div>
  );
};

export default VotingPanel;
