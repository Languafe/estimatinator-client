import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Estimatinator from './Estimatinator';

function App() {
  return (
    <Router>
      <Route path={['/:session', '/']}>
        <Estimatinator />
      </Route>
    </Router>
  );
}

export default App;
