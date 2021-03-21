import React from 'react';

const RouteEditor = (props) => {
    console.log(props);
    const {foundRoute, match} = props;
    const currentURL = match.url;
    const routeProps = (typeof foundRoute === 'undefined')
        ? {
            description: '',
            exits: [],
            forms: [],
            route: currentURL
        } : foundRoute;
    const saveChanges = () => {};
    const addFormProp = () => {};
    const addExitProp = () => {};
    const toggleEditing = () => {};
    const exitTypes = ['form', 'link', 'global'];
    return (
        <section style={{padding: '0 10px'}}>
            <form onSubmit={saveChanges}>
                <h1>Current url: { currentURL }</h1>
                <div>
                    <textarea id="description" name="description" style={{width: '400px', height: '200px'}} 
                        value={routeProps.description}
                        placeholder='Description'></textarea>
                </div>

                <h3>Forms</h3>
                {
                    routeProps.forms && routeProps.forms.map((form) => (
                        <div>
                            <label>
                                Exit Type:
                                <select name="exitType">
                                    {
                                        exitTypes.map((type) => (
                                            <option>{type}</option>
                                        ))
                                    }
                                </select>
                            </label>
                            <label>
                                Button Text:
                                <input type="text" name="visibleText" value={form.action.button.label} onKeyUp={addFormProp}/>
                            </label>
                            <label>
                                Action:
                                <input type="text" formControlName="action"/>
                            </label>
                        </div>
                    ))
                }

                <h3>Exits</h3>
                {
                    routeProps.exits && routeProps.exits.map((exit) => (
                        <div>
                            <label>
                                Exit Type:
                                <select name="exitType">
                                    {
                                        exitTypes.map((type) => (
                                            <option value={type}>{type}</option>
                                        ))
                                    }
                                </select>
                            </label>
                            <label>
                                Link Text:
                                <input type="text" name="visibleText" value={exit.visibleText} onKeyUp={addExitProp}/>
                            </label>
                            <label>
                                Route:
                                <input type="text" name="action" value={exit.route}/>
                            </label>
                        </div>
                    ))
                }

                <button type="button" onClick={toggleEditing}>Cancel</button>
                <button type="submit">Save Changes</button>
            </form>
        </section>
    );
};

export default RouteEditor;