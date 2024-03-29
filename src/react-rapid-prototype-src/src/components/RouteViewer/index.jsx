import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';
import useRouteViewerProps from './useRouteViewerProps';

const RouteViewer = (props) => {
    const {
        currentRoute,
        currentURL,
        currentForm,
        currentFormExit,
        globalExits,
        isDevMode,
        isPreviewing,
        routeFound,
        handleFormButton,
        clearFormSelection,
        clearFormAndNavigate,
        DevModeRouteControls,
        DevModeFormControls
    } = useRouteViewerProps(props);

    return (
        <section id='route_details'>
            <h1>Current url: { currentURL }</h1>
            <p>
                { routeFound ? currentRoute.description : 'Route not defined' }
            </p>

            {
                !currentForm && <div>
                    {
                        isDevMode && !isPreviewing && <DevModeRouteControls/>
                    }
                    {
                        routeFound && <div data-content-start>
                            {
                                currentRoute.forms.length > 0 && <h3>Forms</h3>
                            }
                            {
                                currentRoute.forms.map((form, f) => (<form data-content-form={form.action.name} key={`form_${f}`} onSubmit={handleFormButton(f)}>
                                    <div className='pageForm'>
                                        {
                                            form.inputs.map((input, i) => (
                                                <div className='inputs' key={`input_${f}_${i}`}>
                                                    {
                                                        ['text', 'email', 'url', 'password', 'number', 'file', 'range'].indexOf(input.type) > -1 && <label>
                                                            {input.label}: 
                                                            <input type={input.type} defaultValue={input.value}/>
                                                        </label>
                                                    }
                                                    {
                                                        ['radio', 'checkbox'].indexOf(input.type) > -1 && <span>
                                                            {input.label}: 
                                                            {
                                                                input.value.split(',').map((value, k) => (<label key={`label_${f}_${i}_${k}`}>
                                                                    <input key={`input_${f}_${i}_${k}`}
                                                                        name={`input_${f}_${i}`}
                                                                        type={input.type}
                                                                        value={value}/>
                                                                    {value}
                                                                </label>))
                                                            }
                                                        </span>
                                                    }
                                                    {
                                                        input.type === 'button' && <button type='button' defaultValue={input.value}>{input.label}</button>
                                                    }
                                                    {
                                                        input.type === 'textarea' && <label>
                                                            {input.label}:<br/>
                                                            <textarea defaultValue={input.value}></textarea>
                                                        </label>
                                                    }
                                                    {
                                                        input.type === 'select' && <label>
                                                            {input.label}:
                                                            <select>
                                                                {
                                                                    input.value.split(',').map((value, k) => (
                                                                        <option key={`option_${f}_${i}_${k}`} value={value}>{value}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </label>
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
                                                    <Link data-content-exit to={exit.route}>{exit.visibleText}</Link>
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
                                            <Link data-content-exit to={exit.route}>{exit.visibleText}</Link>
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
                            Navigate to {currentFormExit} 
                        </button>
                    }
                    {
                        !currentFormExit && <button onClick={clearFormSelection}>Finished</button>
                    }

                    {
                        isDevMode && !isPreviewing && <DevModeFormControls/>
                    }
                </div>
              </div>
            }
        </section>
    );
};

export default RouteViewer;