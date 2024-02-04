import React from 'react';
import AppTemplate from './apptemplate/template';
import project from './strata.json';
import {ReactRapidPrototype} from 'react-rapid-prototype';

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
