import React from 'react';
import { withRouter } from 'react-router';
import { useContextRRP } from '../context/store';
import {
    resetProject,
    setCurrentForm,
    setCurrentPreview,
    setCurrentRoute,
    setLinkLocations,
    setProject,
    toggleIsEditing,
    toggleIsPreviewing,
    toggleIsProjectServer,
    toggleIsSavingProject,
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
            isSavingProject,
            project,
            currentFormIndex,
            currentPreview,
            history,
            location,
            dispatchToggleIsEditing,
            dispatchToggleIsPreviewing,
            dispatchSetCurrentForm,
            dispatchSetCurrentPreview,
            dispatchResetProject,
            dispatchToggleIsSavingProject,
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

        const handleSaveProject = () => {
            if (process && process.env && process.env.REACT_APP_SERVER_PORT && !isSavingProject) {
                dispatchToggleIsSavingProject(true);
                fetch('http://localhost:'+process.env.REACT_APP_SERVER_PORT+'/project', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({project})
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.status === 'OK' && data.message) {
                            console.log(data.message);
                            dispatchToggleIsSavingProject(false);
                        }
                    })
                    .catch(() => {
                        console.error('Saving project not successful');
                        dispatchToggleIsSavingProject(false);
                    });
            }
        }

        const previewProps = {
            dispatchToggleIsPreviewing,
            dispatchSetCurrentPreview,
            location,
            currentPreview,
            project,
        };
        
        const renderProps = {
            currentRoute, 
            currentFormIndex: isPreviewing ? null : currentFormIndex, 
            project, 
            history,
            location,
            isDevMode,
            isPreviewing,
            isProjectServer,
            isSavingProject,    
            handleExport,
            handleSaveProject,
            dispatchToggleIsEditing,
            dispatchToggleIsPreviewing,
            dispatchSetCurrentForm,
            dispatchResetProject,
            globalExits: project.globalExits || []
        };

        return (!currentRoute || isEditing)
            ? (isDevMode ? <RouteEditor location={location}/> : <NotFound location={location}/>)
            : (
                isPreviewing
                    ? <CodePreviewer {...previewProps}>{this.state.renderer({
                            ...renderProps,
                            currentRoute: currentPreview.route,
                            currentFormIndex: undefined,
                            location: {pathname: currentPreview?.route?.route ?? location.pathname}
                        })}</CodePreviewer>
                    : this.state.renderer(renderProps)
            );
    }
}

const ProppedRRP = (ownProps) => {
    const {state, dispatch} = useContextRRP();
    const {project, linkLocations, currentRoute, currentFormIndex, currentPreview, isEditing, isUpdated, isDevMode, isPreviewing, isProjectServer, isSavingProject} = state;
    const {project: userDefinedProject = null, renderProject = null, linkLocations: userDefinedLocations = null, location, history} = ownProps;
    const propsForComponent = {
        project: userDefinedProject || project,
        isUserDefinedProject: userDefinedProject !== null, 
        linkLocations: userDefinedLocations || linkLocations,
        isUserDefinedLocations: userDefinedLocations !== null,
        renderProject,
        currentRoute,
        currentFormIndex,
        currentPreview,
        isEditing,
        isUpdated,
        isDevMode,
        isPreviewing,
        isProjectServer,
        isSavingProject,
        location,
        history,

        dispatchSetProject: (project) => dispatch(setProject(project)),
        dispatchResetProject: () => dispatch(resetProject()),
        dispatchSetLinkLocations: (locations) => dispatch(setLinkLocations(locations)),
        dispatchSetCurrentRoute: (route) => dispatch(setCurrentRoute(route)),
        dispatchSetCurrentForm: (formIndex) => dispatch(setCurrentForm(formIndex)),
        dispatchSetCurrentPreview: (preview) => dispatch(setCurrentPreview(preview)),
        dispatchToggleIsEditing: (isEditing) => dispatch(toggleIsEditing(isEditing)),
        dispatchToggleIsUpdated: (isUpdated) => dispatch(toggleIsUpdated(isUpdated)),
        dispatchToggleIsPreviewing: (isPreviewing) => dispatch(toggleIsPreviewing(isPreviewing)),
        dispatchToggleIsProjectServer: (isProjectServer) => dispatch(toggleIsProjectServer(isProjectServer)),
        dispatchToggleIsSavingProject: (isSavingProject) => dispatch(toggleIsSavingProject(isSavingProject)),
    };

    return <ContextRRP {...propsForComponent} />;
};

export default withRouter(ProppedRRP);