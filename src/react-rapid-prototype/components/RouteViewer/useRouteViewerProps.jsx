const useRouteViewerProps = function(props) {

    const {
        currentFormIndex, 
        history,
        location,
        dispatchToggleIsEditing,
        dispatchSetCurrentForm,
        dispatchResetProject,

        currentRoute,
        handleExport,
        globalExits,
        isDevMode,
    } = props;

    const currentURL = location.pathname;
    const routeFound = typeof currentRoute !== 'undefined';
    const currentForm = (typeof currentFormIndex !== 'undefined' && currentRoute && currentRoute.forms[currentFormIndex])
        ? currentRoute.forms[currentFormIndex] : undefined;
    const currentFormExit =
        typeof currentForm !== 'undefined'
        && typeof currentForm.action !== 'undefined'
        && typeof currentForm.action.exit !== 'undefined'
        && typeof currentForm.action.exit.route === 'string'
        && currentForm.action.exit.route.length > 0
            ? currentForm.action.exit.route : undefined;

    const handleFormButton = (formIndex) => (e) => {
        dispatchSetCurrentForm(formIndex);
        e.preventDefault();
    };

    const startEditing = () => {
        dispatchToggleIsEditing(true);
    };

    const clearFormSelection = () => {
        dispatchSetCurrentForm(undefined);
    };

    const clearFormAndNavigate = () => {
        dispatchSetCurrentForm(undefined);
        history.push(currentForm.action.exit.route);
    };

    const resetProject = () => {
        dispatchResetProject();
        history.push('/');
    }

    const DevModeRouteControls = () => (
        <div id='controls'>
            <button type='button' onClick={startEditing}>Edit Properties</button>
            <button type='button' onClick={handleExport}>Export Project JSON</button>
            <button type='button' onClick={resetProject}>Reset</button>
        </div>
    );

    const DevModeFormControls = () => (
        <div id="controls">
            <button onClick={startEditing}>Edit Form</button>
        </div>
    );

    return {
        currentRoute,
        currentURL,
        currentForm,
        currentFormExit,
        globalExits,
        isDevMode,
        routeFound,
        handleFormButton,
        clearFormSelection,
        clearFormAndNavigate,
        DevModeRouteControls,
        DevModeFormControls
    }

}

export default useRouteViewerProps;