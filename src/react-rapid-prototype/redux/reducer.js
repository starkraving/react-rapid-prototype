import { defaultLocations, defaultProject } from "../components/defaults";
import {
    RESET_PROJECT,
    SAVE_ROUTE,
    SET_CURRENT_FORM,
    SET_CURRENT_ROUTE,
    SET_LINK_LOCATIONS,
    SET_PROJECT,
    TOGGLE_IS_EDITING,
    TOGGLE_IS_UPDATED
} from "./actions";

const initialState = {
    project: JSON.parse(JSON.stringify(defaultProject)),
    linkLocations: defaultLocations,
    currentRoute: undefined,
    currentFormIndex: undefined,
    isEditing: false,
    isUpdated: false,
};

const appReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_PROJECT :
            return {
                ...state,
                project: action.payload,
            };
        case RESET_PROJECT :
            const project = JSON.parse(JSON.stringify(defaultProject));
            return {
                ...initialState,
                project,
                currentRoute: project.routes[0],
                isUpdated: true,
            };
        case SET_LINK_LOCATIONS :
            return {
                ...state,
                linkLocations: action.payload,
            };
        case SET_CURRENT_ROUTE :
            return {
                ...state,
                currentRoute: action.payload,
            };
        case SET_CURRENT_FORM :
            return {
                ...state,
                currentFormIndex: action.payload,
            };
        case TOGGLE_IS_EDITING :
            return {
                ...state,
                isEditing: action.payload,
            };
        case TOGGLE_IS_UPDATED :
            return {
                ...state,
                isUpdated: action.payload,
            }
        case SAVE_ROUTE :
            const {routeProps, globalExits} = action.payload;
            return {
                ...state,
                project: upsertRoute(state, routeProps, globalExits),
                currentRoute: routeProps,
                isUpdated: true,
            }
        default:
            return state;
    }
};

function upsertRoute(state, routeProps, globalExits) {
    let {project} = state;
    let pos = project.routes.reduce((found, searchedRouteProps, index) => {
        if (typeof found === 'number') {
            return found;
        }
        return (searchedRouteProps.route === routeProps.route)
            ? index : null;
    }, null);
    if (pos === null) {
        pos = project.routes.length;
    }
    project.routes.splice(pos, 1, routeProps);
    if (globalExits.length > 0) {
        project.globalExits.push(...globalExits);
    }
    return project;
}

export default appReducer;