export const SET_PROJECT = 'SET_PROJECT';
export const SET_LINK_LOCATIONS = 'SET_LINK_LOCATIONS';
export const SET_CURRENT_ROUTE = 'SET_CURRENT_ROUTE';
export const SET_CURRENT_FORM = 'SET_CURRENT_FORM';
export const TOGGLE_IS_EDITING = 'TOGGLE_IS_EDITING';

export const setProject = (project) => ({
    type: SET_PROJECT,
    payload: project
});

export const setLinkLocations = (locations) => ({
    type: SET_LINK_LOCATIONS,
    payload: locations
});

export const setCurrentRoute = (route) => ({
    type: SET_CURRENT_ROUTE,
    payload: route
});

export const setCurrentForm = (form) => ({
    type: SET_CURRENT_FORM,
    payload: form
});

export const toggleIsEditing = (isEditing) => ({
    type: TOGGLE_IS_EDITING,
    payload: isEditing
});