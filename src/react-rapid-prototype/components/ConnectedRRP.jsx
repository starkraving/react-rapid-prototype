import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { resetProject, setCurrentForm, setCurrentRoute, setLinkLocations, setProject, toggleIsEditing, toggleIsUpdated } from '../redux/actions';
import RouteEditor from './RouteEditor';
import RouteViewer from './RouteViewer';

class ConnectedRRP extends React.Component
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
                console.log('UPDATED:', currentRoute);
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
            currentForm,
            history,
            location,
            dispatchToggleIsEditing,
            dispatchSetCurrentForm,
            dispatchResetProject
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
            currentForm, 
            project, 
            history,
            location,
            handleExport,
            dispatchToggleIsEditing,
            dispatchSetCurrentForm,
            dispatchResetProject,
            globalExits: project.globalExits || []
        };

        return (!this.state.currentRoute || isEditing)
            ? (<RouteEditor location={location}/>)
            : this.state.renderer(renderProps);
    }
}

const mapStateToProps = (state, ownProps) => {
    const {project, isEditing, isUpdated, linkLocations, currentRoute, currentForm} = state;
    const {project: userDefinedProject = null, renderProject = null, linkLocations: userDefinedLocations = null} = ownProps;
    return {
        project: userDefinedProject || project,
        isUserDefinedProject: userDefinedProject !== null, 
        linkLocations: userDefinedLocations || linkLocations,
        isUserDefinedLocations: userDefinedLocations !== null,
        isEditing,
        isUpdated,
        renderProject,
        currentRoute,
        currentForm,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchSetProject: (project) => dispatch(setProject(project)),
        dispatchResetProject: () => dispatch(resetProject()),
        dispatchSetLinkLocations: (locations) => dispatch(setLinkLocations(locations)),
        dispatchSetCurrentRoute: (route) => dispatch(setCurrentRoute(route)),
        dispatchSetCurrentForm: (form) => dispatch(setCurrentForm(form)),
        dispatchToggleIsEditing: (isEditing) => dispatch(toggleIsEditing(isEditing)),
        dispatchToggleIsUpdated: (isUpdated) => dispatch(toggleIsUpdated(isUpdated)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ConnectedRRP));