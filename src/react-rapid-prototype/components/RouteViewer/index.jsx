import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

const RouteViewer = (props) => {
    const {
        currentRoute,
        currentForm: currentFormIndex, 
        history,
        location,
        handleExport,
        dispatchToggleIsEditing,
        dispatchSetCurrentForm,
        dispatchResetProject,
        globalExits,
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
        && currentForm.action.exit.route.length > 0;

    const handleFormButton = (form) => (e) => {
        dispatchSetCurrentForm(form);
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

    return (
        <section id='route_details'>
            <h1>Current url: { currentURL }</h1>
            <p>
                { routeFound ? currentRoute.description : 'Route not defined' }
            </p>

            {
                !currentForm && <div>
                    <div id='controls'>
                        <button type='button' onClick={startEditing}>Edit Properties</button>
                        <button type='button' onClick={handleExport}>Export Project JSON</button>
                        <button type='button' onClick={resetProject}>Reset</button>
                    </div>
                    {
                        routeFound && <div>
                            {
                                currentRoute.forms.length > 0 && <h3>Forms</h3>
                            }
                            {
                                currentRoute.forms.map((form, f) => (<form key={`form_${f}`} onSubmit={handleFormButton(f)}>
                                    <div className='pageForm'>
                                        {
                                            form.inputs.map((input, i) => (
                                                <div className='inputs' key={`input_${f}_${i}`}>
                                                    {
                                                        ['text', 'email', 'password', 'number'].indexOf(input.type) > -1 && <label>
                                                            {input.label}: 
                                                            <input type={input.type} defaultValue={input.value}/>
                                                        </label>
                                                    }
                                                    {
                                                        ['radio', 'checkbox'].indexOf(input.type) > -1 && <span>
                                                            {input.label}: 
                                                            {
                                                                input.value.split(',').map((value, k) => (<label key={`label_${f}_${i}_${k}`}>
                                                                    <input key={`input_${f}_${i}_${k}`} name={`input_${f}_${i}`} type={input.type} value={value}/>
                                                                    {value}
                                                                </label>))
                                                            }
                                                        </span>
                                                    }
                                                </div>
                                            ))
                                        }
                                        <button type='submit'>{form.action.button.label}</button>
                                    </div>
                                </form>))
                            }
                            {
                                currentRoute.exits.length > 0 && <div>
                                    <h3>Exits</h3>
                                    <ul>
                                        {
                                            currentRoute.exits.map((exit, e) => (
                                                <li key={`exit_${e}`}>
                                                    <Link to={exit.route}>{exit.visibleText}</Link>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            }
                        </div>
                    }
                    {
                        globalExits.length > 0 && <div>
                            <h3>Global Exits</h3>
                            <ul>
                                {
                                    globalExits.map((exit, e) => (
                                        <li key={`global_${e}`}>
                                            <Link to={exit.route}>{exit.visibleText}</Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    }
                </div>
            }
            {
                currentForm && <div>
                <h3>{ currentForm.action.name }</h3>
                <p>{ currentForm.action.description }</p>
                <div>
                    {
                        currentFormExit && <button onClick={clearFormAndNavigate}>
                            Navigate to {currentForm.action.exit.route} 
                        </button>
                    }
                    {
                        !currentFormExit && <button onClick={clearFormSelection}>Finished</button>
                    }

                    <div id="controls">
                        <button onClick={startEditing}>Edit Form</button>
                    </div>
                </div>
              </div>
            }
        </section>
    );
};

export default RouteViewer;