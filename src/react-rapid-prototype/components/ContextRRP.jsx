import React from 'react';
import { withRouter } from 'react-router';
import { useContextRRP } from '../context/store';
import { resetProject, setCurrentForm, setCurrentRoute, setLinkLocations, setProject, toggleIsEditing, toggleIsUpdated } from '../context/actions';
import RouteEditor from './RouteEditor';
import RouteViewer from './RouteViewer';
import NotFound from './RouteViewer/notfound';

class ContextRRP extends React.Component
{
    defaultRenderer = (props) => (<RouteViewer {...props}></RouteViewer>);

    constructor(props) {
        super(props);
        this.state = {
            renderer: this.defaultRenderer,
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
            isUserDefinedProject,
            isUserDefinedLocations,
        } = this.props;

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
            project,
            currentFormIndex,
            history,
            location,
            dispatchToggleIsEditing,
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
        
        const renderProps = {
            currentRoute, 
            currentFormIndex, 
            project, 
            history,
            location,
            isDevMode,
            handleExport,
            dispatchToggleIsEditing,
            dispatchSetCurrentForm,
            dispatchResetProject,
            globalExits: project.globalExits || []
        };

        return (!currentRoute || isEditing)
            ? (isDevMode ? <RouteEditor location={location}/> : <NotFound location={location}/>)
            : this.state.renderer(renderProps);
    }
}

const ProppedRRP = (ownProps) => {
    const {state, dispatch} = useContextRRP();
    const {project, linkLocations, currentRoute, currentFormIndex, isEditing, isUpdated, isDevMode} = state;
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
        location,
        history,

        dispatchSetProject: (project) => dispatch(setProject(project)),
        dispatchResetProject: () => dispatch(resetProject()),
        dispatchSetLinkLocations: (locations) => dispatch(setLinkLocations(locations)),
        dispatchSetCurrentRoute: (route) => dispatch(setCurrentRoute(route)),
        dispatchSetCurrentForm: (formIndex) => dispatch(setCurrentForm(formIndex)),
        dispatchToggleIsEditing: (isEditing) => dispatch(toggleIsEditing(isEditing)),
        dispatchToggleIsUpdated: (isUpdated) => dispatch(toggleIsUpdated(isUpdated)),
    };

    return <ContextRRP {...propsForComponent} />;
};

export default withRouter(ProppedRRP);