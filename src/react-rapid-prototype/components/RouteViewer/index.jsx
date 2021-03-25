import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

const RouteViewer = (props) => {
    const {
        currentRoute,
        currentForm, 
        history,
        location,
        dispatchToggleIsEditing,
        dispatchSetCurrentForm,
        globalExits,
    } = props;

    const currentURL = location.pathname;
    const routeFound = typeof currentRoute !== 'undefined';

    const handleFormButton = (form) => (e) => {
        dispatchSetCurrentForm(form);
        e.preventDefault();
    };

    const clearFormSelection = () => {
        dispatchSetCurrentForm(undefined);
    };

    const clearFormAndNavigate = () => {
        dispatchSetCurrentForm(undefined);
        history.push(currentForm.action.exit.route);
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
                        <button type='button' onClick={dispatchToggleIsEditing}>Edit Properties</button>
                        <button type='button' >Export Project JSON</button>
                        <button type='button' >Reset</button>
                    </div>
                    {
                        routeFound && <div>
                            {
                                currentRoute.forms.length > 0 && <h3>Forms</h3>
                            }
                            {
                                currentRoute.forms.map((form, f) => (<form key={`form_${f}`} onSubmit={handleFormButton(form)}>
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
                        currentForm.action.exit && <button onClick={clearFormAndNavigate}>
                            Navigate to {currentForm.action.exit.route} 
                        </button>
                    }
                    {
                        !currentForm.action.exit && <button onClick={clearFormSelection}>Finished</button>
                    }

                    <div id="controls">
                        <button onClick={dispatchToggleIsEditing}>Edit Form</button>
                    </div>
                </div>
              </div>
            }
        </section>
    );
};

export default RouteViewer;