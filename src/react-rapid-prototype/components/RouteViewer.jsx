import React from 'react';
import { Link } from 'react-router-dom';

const RouteViewer = (props) => {
    const {
        currentRoute, 
        location,
        dispatchToggleIsEditing,
        dispatchSetCurrentForm,
        globalExits,
    } = props;

    const currentURL = location.pathname;
    const routeFound = typeof currentRoute !== 'undefined';

    const handleFormButton = (form) => () => {
        dispatchSetCurrentForm(form);
    };

    return (
        <section>
            <h1>Current url: { currentURL }</h1>
            <p>
                { routeFound ? currentRoute.description : 'Route not defined' }
            </p>

            <div>
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
                            currentRoute.forms.map((form, f) => (<form key={`form_${f}`}>
                                <div className='pageForm'>
                                    {
                                        form.inputs.map((input, i) => (
                                            <div key={`input_${f}_${i}`}>{input.type}</div>
                                        ))
                                    }
                                    <button onClick={handleFormButton(form)}>{form.action.button.label}</button>
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
        </section>
    );
};

export default RouteViewer;