import React from 'react';
import { connect } from 'react-redux';
import { toggleIsEditing } from '../../redux/actions';

const RouteEditor = (props) => {
    const {currentRoute, location, dispatchToggleIsEditing} = props;
    const currentURL = location.pathname;
    const routeProps = (typeof currentRoute === 'undefined')
        ? {
            description: '',
            exits: [],
            forms: [],
            route: currentURL
        } : currentRoute;
    
    const handleDescription = (e) => {console.log(e)};
    
    const saveChanges = () => {};
    const addFormProp = () => {};
    const addExitProp = () => {};
    const exitTypes = ['form', 'link', 'global'];
    return (
        <section style={{padding: '0 10px'}}>
            <form onSubmit={saveChanges}>
                <h1>Current url: { currentURL }</h1>
                <div>
                    <textarea id="description" name="description" style={{width: '400px', height: '200px'}} 
                        value={routeProps.description}
                        placeholder='Description'
                        onChange={handleDescription}></textarea>
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

                <button type="button" onClick={dispatchToggleIsEditing}>Cancel</button>
                <button type="submit">Save Changes</button>
            </form>
        </section>
    );
};

const mapStateToProps = (state) => {
    return {
        currentRoute: state.currentRoute
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchToggleIsEditing: () => dispatch(toggleIsEditing()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteEditor);