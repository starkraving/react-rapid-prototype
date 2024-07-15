import React, { useRef } from 'react';
import ReactDomServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { generateComponentCode } from '../../generators/component';
import { generateFormComponentCode } from '../../generators/formcomponent';
import { generateTemplateCode } from '../../generators/templatecomponent';
import { generateAppCode } from '../../generators/appcomponent';
import { generateIndexCode } from '../../generators/indexcomponent';
import './styles.scss';
import { componentNameFromRouteProps } from '../../generators/libs';
import SyntaxHighlighter from './SyntaxHighlighter';
import CodeExporter from '../CodeExporter';


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

    const modalRef = useRef(null);

    const handleModalOpen = () => {
        modalRef.current.open();
    };
    
    const handleDirectoryTreeClick = (file, route, form) => () => {
        dispatchSetCurrentPreview({file, route, form});
    };

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
            componentCode = generateFormComponentCode(ReactDomServer.renderToStaticMarkup(<StaticRouter>{children}</StaticRouter>), currentFormIndex, currentRoute.forms[currentFormIndex]);
            break;
        default :
            componentCode = generateComponentCode(ReactDomServer.renderToStaticMarkup(<StaticRouter>{children}</StaticRouter>), currentRoute.route, currentRoute);
    }

    return <>
        <div id="controls">
            <h2>React Rapid Prototyper</h2>
            <section>
                <h3><i className='fa-solid fa-eye'></i>Modes</h3>
                <button type='button' disabled>
                    <i className="fa-solid fa-code"></i>Preview Code
                </button>
                <button onClick={toggleIsPreviewing}>
                    <i className="fa-solid fa-window-maximize"></i>Development Mode
                </button>
            </section>
            <section>
                <h3><i className='fa-solid fa-bolt'></i>Actions</h3>
                <button type='button' onClick={handleModalOpen}>
                    <i className="fa-solid fa-file-export"></i>Generate project files
                </button>
            </section>
            <section>
                <h3><i className="fa-solid fa-folder"></i>Project Structure</h3>
                <div className="tree">
                    <ul>
                        <li>
                            <i className="fa-solid fa-folder"></i>pages
                            <ul>
                                {
                                    project.routes.map((objRoute, routeIndex) => (
                                        <li className="folder" key={`route_${routeIndex}`}>
                                            <span title={componentNameFromRouteProps(objRoute)}><i className="fa-solid fa-folder"></i>{componentNameFromRouteProps(objRoute)}</span>
                                            <ul>
                                                <li><button onClick={handleDirectoryTreeClick(undefined, objRoute, undefined)} title='index.jsx' disabled={objRoute && currentRoute && objRoute.route === currentRoute.route && isNaN(currentFormIndex)}>index.jsx</button></li>
                                                {
                                                    objRoute.forms.map((formProps, formIndex) => (
                                                        <li key={`form_${formIndex}`} title={(formProps?.filename ?? `Form${formIndex+1}`) + '.jsx'}>
                                                            <button onClick={handleDirectoryTreeClick(undefined, objRoute, formIndex)} disabled={objRoute && currentRoute && objRoute.route === currentRoute.route && currentFormIndex === formIndex}>{formProps?.filename ?? `Form${formIndex+1}`}.jsx</button>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                        <li>
                            <i className="fa-solid fa-folder"></i>template
                            <ul>
                                <li><button onClick={handleDirectoryTreeClick('template/index.jsx', undefined, undefined)} title='index.js' disabled={file === 'template/index.jsx'}>index.jsx</button></li>
                            </ul>
                        </li>
                        <li><button onClick={handleDirectoryTreeClick('App.jsx', undefined, undefined)} title='App.jsx' disabled={file === 'App.jsx'}>App.jsx</button></li>
                        <li><button onClick={handleDirectoryTreeClick('index.js', undefined, undefined)} title='index.js'>index.js</button></li>
                    </ul>
                </div>
            </section>
        </div>
        <div className="code_preview">
            <h2>Code Preview</h2>
            <SyntaxHighlighter str={componentCode} />
        </div>
        <CodeExporter ref={modalRef} />
    </>
};

export default CodePreviewer