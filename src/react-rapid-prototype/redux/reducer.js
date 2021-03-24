import { defaultLocations, defaultProject } from "../components/defaults";
import { SET_CURRENT_FORM, SET_CURRENT_ROUTE, SET_LINK_LOCATIONS, SET_PROJECT, TOGGLE_IS_EDITING } from "./actions";

const initialState = {
    project: defaultProject,
    linkLocations: defaultLocations,
    currentRoute: undefined,
    currentForm: undefined,
    isEditing: false
};

const appReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_PROJECT :
            return {
                ...state,
                project: action.payload
            };
        case SET_LINK_LOCATIONS :
            return {
                ...state,
                linkLocations: action.payload
            };
        case SET_CURRENT_ROUTE :
            return {
                ...state,
                currentRoute: action.payload
            };
        case SET_CURRENT_FORM :
            return {
                ...state,
                currentForm: action.payload
            };
        case TOGGLE_IS_EDITING :
            return {
                ...state,
                isEditing: !state.isEditing
            };
        default:
            return state;
    }
};

export default appReducer;