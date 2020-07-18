import React from 'react';

import './VotingPanel.css';

const fibonacciNumbers = [
    0,
    1,
    1,
    2,
    3,
    5,
    8,
    13,
    21
];

const VotingPanel = ({ options = fibonacciNumbers, onSubmit }) => {
    return (
        <div className="voting-panel">
            {options.map((value, i) =>
                <button key={i} onClick={() => onSubmit(options)}>{value}</button>)}
        </div>
    );
};

export default VotingPanel;
