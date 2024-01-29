const useRouteViewerProps = function(props) {

    const {
        currentFormIndex, 
        history,
        location,
        dispatchToggleIsEditing,
        dispatchToggleIsPreviewing,
        dispatchSetCurrentForm,
        dispatchResetProject,

        currentRoute,
        handleExport,
        globalExits,
        isDevMode,
        isPreviewing,
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

    const startPreviewing = () => {
        dispatchToggleIsPreviewing(true);
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
            {
                routeFound && <button type='button' onClick={startPreviewing}>Preview Code</button>
            }
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

    const bucketedExits = [
        ...currentRoute.exits,
        ...globalExits
    ].reduce((collector, exit) => {
        exit.routeLocations.forEach((loc) => {
            if (!collector.hasOwnProperty(loc)) {
                collector[loc] = [];
            }
            collector[loc].push(exit);
        });
        return collector;
    }, {});

    const bucketedForms = currentRoute.forms.reduce((collector, form) => {
        form.action.exit.routeLocations.forEach((loc) => {
            if (!collector.hasOwnProperty(loc)) {
                collector[loc] = [];
            }
            collector[loc].push(form);
        })
        return collector;
    }, {});

    return {
        currentRoute,
        currentURL,
        currentForm,
        currentFormExit,
        globalExits,
        isDevMode,
        isPreviewing,
        routeFound,
        bucketedExits,
        bucketedForms,
        handleFormButton,
        clearFormSelection,
        clearFormAndNavigate,
        DevModeRouteControls,
        DevModeFormControls
    }

}

export default useRouteViewerProps;