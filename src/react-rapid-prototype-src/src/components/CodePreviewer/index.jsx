import React from 'react';
import ReactDomServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { generateComponentCode } from '../../generators/component';

const CodePreviewer = (props) => {
    const {
        dispatchToggleIsPreviewing,
        location,
        currentRoute,
        children
    } = props;

    const toggleIsPreviewing = () => {
        dispatchToggleIsPreviewing(false);
    };

    const componentCode = generateComponentCode(ReactDomServer.renderToStaticMarkup(<StaticRouter>{children}</StaticRouter>), location, currentRoute);
    
    return <div>
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