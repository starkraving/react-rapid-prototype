import React from 'react';
import { withRouter } from 'react-router';
import { useContextRRP } from '../context/store';
import {
    resetProject,
    setCurrentForm,
    setCurrentRoute,
    setLinkLocations,
    setProject,
    toggleIsEditing,
    toggleIsPreviewing,
    toggleIsProjectServer,
    toggleIsUpdated
} from '../context/actions';
import RouteEditor from './RouteEditor';
import RouteViewer from './RouteViewer';
import NotFound from './RouteViewer/notfound';
import CodePreviewer from './CodePreviewer';

class ContextRRP extends React.Component
{

    constructor(props) {
        super(props);

        const defaultRenderer = (props) => {return (<RouteViewer {...props}></RouteViewer>)};
        this.state = {
            renderer: defaultRenderer,
            currentRoute: null
        };
        this.handleCurrentRoute = this.handleCurrentRoute.bind(this);
    }

    componentDidMount() {

        const {
            project, 
            renderProject = null, 
            linkLocations,
            dispatchSetLinkLocations,
            dispatchSetProject,
            dispatchToggleIsProjectServer,
            isUserDefinedProject,
            isUserDefinedLocations,
        } = this.props;

        // check to see if project server is running
        if (process && process.env && process.env.REACT_APP_SERVER_PORT) {
            console.log('SERVER PORT: ', process.env.REACT_APP_SERVER_PORT);
            fetch('http://localhost:'+process.env.REACT_APP_SERVER_PORT+'/health')
                .then(response => response.json())
                .then(data => {
                    if (data.status && data.status === 'OK') {
                        dispatchToggleIsProjectServer(true);
                    }
                })
                .catch(() => {
                    dispatchToggleIsProjectServer(false);
                });
        }

        if (renderProject) {
            this.setState({renderer: renderProject});
        }
        if (isUserDefinedProject) {
            dispatchSetProject(project);
        }
        if (isUserDefinedLocations) {
            dispatchSetLinkLocations(linkLocations);
        }

        this.handleCurrentRoute();
    }

    componentDidUpdate(prevProps) {
        const {isUpdated, location, currentRoute, dispatchToggleIsUpdated} = this.props;
        if (prevProps.isUpdated !== isUpdated && isUpdated) {
            this.setState({currentRoute}, () => {
                dispatchToggleIsUpdated(false);
            });
            return;
        }
        if (prevProps.location.pathname === location.pathname) {
            return;
        }
        this.handleCurrentRoute();
    }

    handleCurrentRoute() {
        const {
            project,
            location,
            dispatchSetCurrentRoute
        } = this.props;

        const currentRoute = !project 
            ? undefined 
            : project.routes.filter((routeProp) => routeProp.route === location.pathname).pop();

        this.setState({currentRoute});
        dispatchSetCurrentRoute(currentRoute);
    }

    render() {
        const {
            isEditing,
            isPreviewing,
            isProjectServer,
            project,
            currentFormIndex,
            history,
            location,
            dispatchToggleIsEditing,
            dispatchToggleIsPreviewing,
            dispatchSetCurrentForm,
            dispatchResetProject,
            isDevMode,
        } = this.props;
        const {currentRoute} = this.state;
        const handleExport = () => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(
              new Blob([JSON.stringify(project)], {type: 'application/json'})
            );
            a.download = 'project.json';
            a.click();
          }

        const previewProps = {
            dispatchToggleIsPreviewing,
            location,
            currentRoute
        };
        
        const renderProps = {
            currentRoute, 
            currentFormIndex, 
            project, 
            history,
            location,
            isDevMode,
            isPreviewing,
            isProjectServer,
            handleExport,
            dispatchToggleIsEditing,
            dispatchToggleIsPreviewing,
            dispatchSetCurrentForm,
            dispatchResetProject,
            globalExits: project.globalExits || []
        };

        return (!currentRoute || isEditing)
            ? (isDevMode ? <RouteEditor location={location}/> : <NotFound location={location}/>)
            : (isPreviewing ? <CodePreviewer {...previewProps}>{this.state.renderer(renderProps)}</CodePreviewer> : this.state.renderer(renderProps));
    }
}

const ProppedRRP = (ownProps) => {
    const {state, dispatch} = useContextRRP();
    const {project, linkLocations, currentRoute, currentFormIndex, isEditing, isUpdated, isDevMode, isPreviewing, isProjectServer} = state;
    const {project: userDefinedProject = null, renderProject = null, linkLocations: userDefinedLocations = null, location, history} = ownProps;
    const propsForComponent = {
        project: userDefinedProject || project,
        isUserDefinedProject: userDefinedProject !== null, 
        linkLocations: userDefinedLocations || linkLocations,
        isUserDefinedLocations: userDefinedLocations !== null,
        renderProject,
        currentRoute,
        currentFormIndex,
        isEditing,
        isUpdated,
        isDevMode,
        isPreviewing,
        isProjectServer,
        location,
        history,

        dispatchSetProject: (project) => dispatch(setProject(project)),
        dispatchResetProject: () => dispatch(resetProject()),
        dispatchSetLinkLocations: (locations) => dispatch(setLinkLocations(locations)),
        dispatchSetCurrentRoute: (route) => dispatch(setCurrentRoute(route)),
        dispatchSetCurrentForm: (formIndex) => dispatch(setCurrentForm(formIndex)),
        dispatchToggleIsEditing: (isEditing) => dispatch(toggleIsEditing(isEditing)),
        dispatchToggleIsUpdated: (isUpdated) => dispatch(toggleIsUpdated(isUpdated)),
        dispatchToggleIsPreviewing: (isPreviewing) => dispatch(toggleIsPreviewing(isPreviewing)),
        dispatchToggleIsProjectServer: (isProjectServer) => dispatch(toggleIsProjectServer(isProjectServer)),
    };

    return <ContextRRP {...propsForComponent} />;
};

export default withRouter(ProppedRRP);