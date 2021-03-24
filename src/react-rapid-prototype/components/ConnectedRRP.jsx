import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { setCurrentForm, setCurrentRoute, setLinkLocations, setProject, toggleIsEditing } from '../redux/actions';
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
            isUserDefinedLocations
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
        if (prevProps.location.pathname === this.props.location.pathname) {
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

        if (currentRoute) {
            this.setState({currentRoute});
            dispatchSetCurrentRoute(currentRoute);
        }
    }

    render() {
        const {isEditing, project, currentForm, history, location, dispatchToggleIsEditing, dispatchSetCurrentForm} = this.props;
        const {currentRoute} = this.state;
        const renderProps = {
            currentRoute, 
            currentForm, 
            project, 
            history,
            location,
            dispatchToggleIsEditing,
            dispatchSetCurrentForm,
            globalExits: project.globalExits || []
        };

        return (!this.state.currentRoute || isEditing)
            ? (<RouteEditor location={location}/>)
            : this.state.renderer(renderProps);
    }
}

const mapStateToProps = (state, ownProps) => {
    const {project, isEditing, linkLocations, currentForm} = state;
    const {project: userDefinedProject = null, renderProject = null, linkLocations: userDefinedLocations = null} = ownProps;
    return {
        project: userDefinedProject || project,
        isUserDefinedProject: userDefinedProject !== null, 
        linkLocations: userDefinedLocations || linkLocations,
        isUserDefinedLocations: userDefinedLocations !== null,
        isEditing,
        renderProject,
        currentForm,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchSetProject: (project) => dispatch(setProject(project)),
        dispatchSetLinkLocations: (locations) => dispatch(setLinkLocations(locations)),
        dispatchSetCurrentRoute: (route) => dispatch(setCurrentRoute(route)),
        dispatchSetCurrentForm: (form) => dispatch(setCurrentForm(form)),
        dispatchToggleIsEditing: () => dispatch(toggleIsEditing()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ConnectedRRP));