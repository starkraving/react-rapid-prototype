import React, { Suspense, useEffect, useState } from 'react';
import {ReactRapidPrototype} from './react-rapid-prototype-src/src';

const LazyLoadedApp = () => {
  const [project, setProject] = useState(null);
  const [AppTemplate, setTemplate] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const importProject = import(process.env.REACT_APP_PATH_TO_PROJECT);
    const importAppTemplate = import(process.env.REACT_APP_PATH_TO_TEMPLATE);
    let _project;
    let _AppTemplate;
    Promise.all([importProject, importAppTemplate]).then((imported) => {
      [{default: _project}, {default: _AppTemplate}] = imported;
      setProject(_project);
      setTemplate(() => _AppTemplate);
      return setLoaded(true);
    });
  }, []);

  return (
    loaded && <ReactRapidPrototype
      project={project}
      renderProject={AppTemplate}
      linkLocations={JSON.parse(process.env.REACT_APP_LINK_LOCATIONS)}
    />
  );
};

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyLoadedApp />
    </Suspense>
  )
}

export default App;
