import React from 'react';
import AppTemplate from './apptemplate/template';
import ReactRapidPrototype from './react-rapid-prototype/ReactRapidPrototype';
import project from './strata.json';

function App() {
  return (
    <ReactRapidPrototype
     project={project}
     renderProject={AppTemplate}
     linkLocations={['topNav', 'footer', 'general', 'homecal', 'card']}
     />
  );
}

export default App;
