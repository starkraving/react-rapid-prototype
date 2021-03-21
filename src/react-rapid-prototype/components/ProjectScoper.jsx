import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as QueryString from 'query-string';

import defaultProject from './project.json';
import RouteViewer from './RouteViewer';
import RouteEditor from './RouteEditor/index';

const ProjectScoper = ({project = defaultProject, renderProject = null}) => {
    const defaultRenderer = (props) => (<RouteViewer {...props} project={project}></RouteViewer>);
    const renderer = renderProject || defaultRenderer;
    const viewOrEdit = (props) => {
        const {match, location} = props;
        const queryParams = QueryString.parse(location.search);
        const foundRoute = project.routes.filter((routeProp) => routeProp.route === match.url).pop();
        return (typeof foundRoute === 'undefined' || (queryParams.mode && queryParams.mode === 'edit'))
            ? (<RouteEditor {...props} foundRoute={foundRoute}></RouteEditor>)
            : renderer(props);
    };

    return (
        <BrowserRouter>
            <Switch>
                <Route path='*' render={viewOrEdit}></Route>
            </Switch>
        </BrowserRouter>
    );
};

export default ProjectScoper;