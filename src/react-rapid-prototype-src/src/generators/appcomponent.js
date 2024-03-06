const locationToComponentName = (locationStr) => {
    let componentName = locationStr
        .replace('/', '').replace(/:/g, '')
        .split('/').map((part) => part.substring(0,1).toUpperCase() + part.substring(1).toLowerCase())
        .join('');
    if (!componentName.length) {
        componentName = 'Home';
    }
    componentName += 'Page';

    return componentName;
};

export const generateAppCode = (project) => {
    const importString = `import 'React' from react;
import { Switch, Route } from 'react-router-dom';
import Template from './Template';
` + project.routes.map((objRoute) => `import ${locationToComponentName(objRoute.route)} from './Pages/${locationToComponentName(objRoute.route)}';
`).join('');

    const routesString = project.routes.map((objRoute) => `
            <Route exact path='${objRoute.route}' component={${locationToComponentName(objRoute.route)}} />`).join('').trim();

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