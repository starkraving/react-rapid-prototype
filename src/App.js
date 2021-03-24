import React from 'react';
import ReactRapidPrototype from './react-rapid-prototype/ReactRapidPrototype';
import project from './project.json';

function App() {
  return (
    <ReactRapidPrototype project={project}></ReactRapidPrototype>
  );
}

export default App;
