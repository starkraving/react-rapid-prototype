import React from 'react';
import ReactDomServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { generateComponentCode } from '../../generators/component';
import { generateFormComponentCode } from '../../generators/formcomponent';
import { generateTemplateCode } from '../../generators/templatecomponent';
import { generateAppCode } from '../../generators/appcomponent';
import { generateIndexCode } from '../../generators/indexcomponent';
import './styles.scss';

const componentName = (route) => {
    let componentName = route
        .replace('/', '').replace(/:/g, '')
        .split('/').map((part) => part.substring(0,1).toUpperCase() + part.substring(1).toLowerCase())
        .join('');
    if (!componentName.length) {
        componentName = 'Home';
    }
    componentName += 'Page';

    return componentName;
}

const CodePreviewer = (props) => {
    const {
        dispatchToggleIsPreviewing,
        dispatchSetCurrentPreview,
        currentPreview,
        children,
        project,
    } = props;

    const toggleIsPreviewing = () => {
        dispatchToggleIsPreviewing(false);
    };

    const {
        file,
        route: currentRoute,
        form: currentFormIndex,
    } = currentPreview;

    let componentCode;

    switch(true) {
        case file === 'App.jsx' :
            componentCode = generateAppCode(project);
            break;
        case file === 'template/index.jsx' :
            componentCode = generateTemplateCode(ReactDomServer.renderToStaticMarkup(<StaticRouter>{children}</StaticRouter>));
            break;
        case file === 'index.js' :
            componentCode = generateIndexCode();
            break;
        case !isNaN(currentFormIndex) :
            componentCode = generateFormComponentCode(ReactDomServer.renderToStaticMarkup(<StaticRouter>{children}</StaticRouter>), currentFormIndex);
            break;
        default :
            componentCode = generateComponentCode(ReactDomServer.renderToStaticMarkup(<StaticRouter>{children}</StaticRouter>), currentRoute.route, currentRoute);
    }
    
    const handleDirectoryTreeClick = (file, route, form) => () => {
        dispatchSetCurrentPreview({file, route, form});
    };

    return <div className="code_preview">
        <div className="tree">
            <h2>Code Previewer</h2>
            <ul>
                <li className="folder">
                    Pages
                    <ul>
                        {
                            project.routes.map((objRoute, routeIndex) => (
                                <li className="folder" key={`route_${routeIndex}`}>
                                    {componentName(objRoute.route)}
                                    <ul>
                                        <li><button onClick={handleDirectoryTreeClick(undefined, objRoute, undefined)}>index.jsx</button></li>
                                        {
                                            objRoute.forms.map((_, formIndex) => (
                                                <li key={`form_${formIndex}`}>
                                                    <button onClick={handleDirectoryTreeClick(undefined, objRoute, formIndex)}>{`Form${formIndex+1}`}.jsx</button>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </li>
                            ))
                        }
                    </ul>
                </li>
                <li className="folder">
                    Template
                    <ul>
                        <li><button onClick={handleDirectoryTreeClick('template/index.jsx', undefined, undefined)}>index.jsx</button></li>
                    </ul>
                </li>
                <li><button onClick={handleDirectoryTreeClick('App.jsx', undefined, undefined)}>App.jsx</button></li>
                <li><button onClick={handleDirectoryTreeClick('index.js', undefined, undefined)}>index.js</button></li>
            </ul>
        </div>
        <code>
            <pre>
                {componentCode}
            </pre>
        </code>
        <div id='controls'>
            <button onClick={toggleIsPreviewing}>Back</button>
        </div>
    </div>
};

export default CodePreviewer