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
        handleSaveProject,
        globalExits,
        isDevMode,
        isPreviewing,
        isProjectServer,
        isSavingProject,
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
            {
                isProjectServer
                    ? <button type='button' onClick={handleSaveProject} disabled={isSavingProject}>{isSavingProject ? 'Saving...' : 'Save Project'}</button>
                    : <button type='button' onClick={handleExport}>Export Project JSON</button>
            }
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
        const exitLocations = exit && exit.routeLocations && exit.routeLocations.length ? exit.routeLocations : ['general'];
        exitLocations.forEach((loc) => {
            const fixedLoc = loc.length > 0 ? loc : 'general';
            if (!collector.hasOwnProperty(fixedLoc)) {
                collector[fixedLoc] = [];
            }
            collector[fixedLoc].push(exit);
        });
        return collector;
    }, {});

    const bucketedForms = currentRoute.forms.reduce((collector, form) => {
        const formLocations = form.action && form.action.exit && form.action.exit.routeLocations && form.action.exit.routeLocations.length ? form.action.exit.routeLocations : ['general']
        formLocations.forEach((loc) => {
            const fixedLoc = loc.length > 0 ? loc : 'general';
            if (!collector.hasOwnProperty(fixedLoc)) {
                collector[fixedLoc] = [];
            }
            collector[fixedLoc].push(form);
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