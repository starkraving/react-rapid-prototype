import { componentNameFromRouteProps } from "./libs";

export const generateAppCode = (project) => {
    const importString = `import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Template from './Template';
` + project.routes.map((objRoute) => `import ${componentNameFromRouteProps(objRoute)} from './Pages/${componentNameFromRouteProps(objRoute)}';
`).join('');

    const routesString = project.routes.map((objRoute) => `
            <Route exact path='${objRoute.route}' component={${componentNameFromRouteProps(objRoute)}} />`).join('').trim();

    return `
${importString}
const App = () => {
  return (
    <Template>
        <Switch>
            ${routesString}
        </Switch>
    </Template>
  );
};

export default App;`;
}