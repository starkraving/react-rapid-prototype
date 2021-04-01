import React from 'react';
import { connect } from 'react-redux';
import { saveRoute, toggleIsEditing } from '../../redux/actions';
import './styles.scss';

class RouteEditor extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            routeProps: {},
            routeForms: [],
            routeExits: [],

            formProps: undefined,
            formInputs: [],
        };
        this.setMinimumFields = this.setMinimumFields.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleFormAction = this.handleFormAction.bind(this);
        this.handleRouteForm = this.handleRouteForm.bind(this);
        this.handleRouteExit = this.handleRouteExit.bind(this);
        this.handleFormInput = this.handleFormInput.bind(this);
        this.saveRouteChanges = this.saveRouteChanges.bind(this);
        this.saveFormChanges = this.saveFormChanges.bind(this);
    }

    componentDidMount() {
        const {currentRoute, currentForm: currentFormIndex, location} = this.props;
        const currentURL = location.pathname;
        this.setState({
            formProps: (typeof currentFormIndex === 'undefined')
                ? undefined
                : JSON.parse(JSON.stringify(currentRoute.forms[currentFormIndex])),
            routeProps: (typeof currentRoute === 'undefined')
                ? {
                    description: '',
                    exits: [],
                    forms: [],
                    route: currentURL
                } : JSON.parse(JSON.stringify(currentRoute))
        }, this.setMinimumFields)
    }

    setMinimumFields() {
        const {formProps} = this.state;
        if (typeof formProps !== 'undefined') {
            const formInputs = [...Array(formProps.inputs.length + 1).keys()]
                .map((index) => (formProps.inputs.length > index)
                    ? formProps.inputs[index]
                    : {
                        type: 'text',
                        label: '',
                        attributes: '',
                        value: ''
                    });
            this.setState({formInputs});
            return;
        }

        const {routeProps} = this.state;
        const routeForms = [...Array(routeProps.forms.length + 1).keys()]
            .map((index) => (routeProps.forms.length > index)
                ? routeProps.forms[index]
                : {
                    action: {
                        name: '',
                        description: '',
                        button: {
                            type: 'submit',
                            label: '',
                            attributes: ''
                        },
                        exit: {
                            route: null,
                            visibleText: '',
                            routeLocations: ['general']
                        }
                    },
                    inputs: []
                });
        
        const routeExits = [...Array(routeProps.exits.length + 1).keys()]
            .map((index) => (routeProps.exits.length > index)
                ? routeProps.exits[index]
                : {
                    route: '',
                    visibleText: '',
                    routeLocations: ['general']
                });

        this.setState({routeForms, routeExits});
    }
        
    handleDescription(e) {
        const {routeProps} = this.state;
        this.setState({routeProps: {
            ...routeProps,
            description: e.target.value
        }});
    };

    handleFormAction(e) {
        let {formProps} = this.state;
        const fieldName = e.target.name;
        const value = e.target.value;

        switch (fieldName) {
            case 'name' :
            case 'description' :
                formProps.action[fieldName] = value;
                break;
            
            case 'button' :
                formProps.action.button.label = value;
                break;

            case 'exit' :
                if (typeof formProps.action.exit.route === 'undefined') {
                    formProps.action.exit = {
                        route: null,
                        visibleText: '',
                        routeLocations: ['general']
                    };
                }
                formProps.action.exit.route = value;
                break;
            
            default :
                break;
        }

        this.setState({formProps});
    };
    
    handleRouteForm(index) {
        return (e) => {
            const {routeProps, routeForms} = this.state;
            const form = routeForms[index];
            const fieldName = e.target.name;
            const value = e.target.value;
            
            switch (fieldName) {
                case 'visibleText' :
                    form.action.button.label = value;
                    break;
                case 'action' :
                    form.action.name = value;
                    break;
                default :
                    // TODO: handle exitType change
                    break;
            }
            routeProps.forms[index] = form;
            this.setState({routeProps}, this.setMinimumFields);
        };
    }
    
    handleRouteExit(index) {
        return (e) => {
            const {routeProps, routeExits} = this.state;
            const exit = routeExits[index];
            const fieldName = e.target.name;
            const value = e.target.value;
            
            if (fieldName === 'exitType') {
                // TODO handle exitType change
            }
            exit[fieldName] = value;
            routeProps.exits[index] = exit;
            this.setState({routeProps}, this.setMinimumFields);
        };
    }
    
    handleFormInput(index) {
        return (e) => {
            const {formInputs, formProps} = this.state;
            const fieldName = e.target.name;
            const value = e.target.value;
            const input = {
                ...formInputs[index],
                [fieldName]: value
            };

            formProps.inputs[index] = input;
            this.setState({formProps}, this.setMinimumFields);
        };
    };
    
    saveRouteChanges(e) {
        const {dispatchSaveRoute, dispatchToggleIsEditing} = this.props;
        const {routeProps} = this.state;
        // TODO: handle global exits
        dispatchSaveRoute(routeProps);
        dispatchToggleIsEditing(false);
        e.preventDefault();
    };
    
    saveFormChanges(e) {
        const {currentRoute, currentForm, dispatchSaveRoute, dispatchToggleIsEditing} = this.props;
        const {formProps} = this.state;
        currentRoute.forms[currentForm] = formProps;
        dispatchSaveRoute(currentRoute);
        dispatchToggleIsEditing(false);
        e.preventDefault();
    };

    render() {
        const {routeProps, routeForms, routeExits, formInputs} = this.state;
        const {location, linkLocations, dispatchToggleIsEditing, currentRoute, currentForm: currentFormIndex} = this.props;
        const currentForm = !isNaN(currentFormIndex) && currentRoute.forms[currentFormIndex]
            ? currentRoute.forms[currentFormIndex] : undefined;
        const currentURL = location.pathname;
        const exitTypes = ['form', 'link', 'global'];
        const inputTypes = ['text', 'email', 'number', 'range', 'url', 'password', 'select', 'radio', 'checkbox', 'file'];
        return (
            <section>
                {
                    typeof currentForm === 'undefined' && <form onSubmit={this.saveRouteChanges}>
                        <h1>Current URL: {currentURL}</h1>
                        <div>
                            <textarea id='description' defaultValue={routeProps.description} onChange={this.handleDescription}></textarea>
                            <aside>
                                <p>
                                    Use the textarea to give this route some descriptive text which will be readable when the user navigates
                                    through the project. For example, "Displays a grid of product summaries, each with images, product name and price.
                                </p>
                                <p>
                                    For forms, specify the visible button text, eg "Add to Cart", and the action. The action is the component
                                    method that should be invoked when the button is clicked, eg "addToCart".
                                </p>
                                <p>
                                    For exits, specify the visible link text, eg "More Info", and the route the link should go to. The route should
                                    start with a "/", and can include route parameters, eg "/products/:productId". Use an exit type of "Global" if
                                    you want the link to be visible on all pages of the app, not just the current one -- for example, site-wide
                                    navigation.
                                </p>
                            </aside>
                        </div>
                        <h3>Forms</h3>
                        {
                            routeForms.map((form, fIdx) => (
                                <div className='route-props' key={`form_${fIdx}`}>
                                    <label className='route-prop'>
                                        Exit Type:
                                        <select name='exitType' defaultValue='form' onChange={this.handleRouteForm(fIdx)}>
                                            {
                                                exitTypes.map((type, i) => (
                                                    <option key={`exittype_${fIdx}_${i}`} value={type}>{ type }</option>
                                                ))
                                            }
                                        </select>
                                    </label>
                                    <label className='route-prop'>
                                        Button Text:
                                        <input type='text' name='visibleText' defaultValue={form.action.button.label}
                                            onChange={this.handleRouteForm(fIdx)}
                                            required={form.action.name.length > 0}/>
                                    </label>
                                    <label className='route-prop'>
                                        Action:
                                        <input type='text' name='action' defaultValue={form.action.name}
                                            onChange={this.handleRouteForm(fIdx)}
                                            required={form.action.button.label.length > 0}/>
                                    </label>
                                    &nbsp; &nbsp;
                                    Prototype:
                                    {
                                        linkLocations.map((loc, lIdx) => {
                                            return (
                                                <span style={{marginRight: '1em'}} key={`formlocation_${fIdx}_${lIdx}`}>
                                                    <label className='prototype'>
                                                        <input type='checkbox' defaultValue={loc}/>
                                                        {loc}
                                                    </label>
                                                </span>
                                            )
                                        })
                                    }
                                </div>
                            ))
                        }
                        <h3>Exits</h3>
                        {
                            routeExits.map((exit, idx) => (
                            <div className='route-props' key={`exit_${idx}`}>
                                <label className='route-prop'>
                                    Exit Type:
                                    <select name='exitType' defaultValue='link' onChange={this.handleRouteExit(idx)}>
                                        {
                                            exitTypes.map((type, i) => (
                                                <option key={`exittype_${idx}_${i}`} value={type}>{ type }</option>
                                            ))
                                        }
                                    </select>
                                </label>
                                <label className='route-prop'>
                                    Link Text:
                                    <input type='text' name='visibleText' defaultValue={exit.visibleText} 
                                        onChange={this.handleRouteExit(idx)}
                                        required={exit.route.length > 0}/>
                                </label>
                                <label className='route-prop'>
                                    Route:
                                    <input type='text' name='route' defaultValue={exit.route} 
                                        onChange={this.handleRouteExit(idx)}
                                        required={exit.visibleText.length > 0}/>
                                </label>
                                &nbsp; &nbsp;
                                Prototype:
                                {
                                    linkLocations.map((loc, lIdx) => {
                                        return (
                                            <span key={`loc_${idx}_${lIdx}`} style={{marginRight: '1em'}}>
                                                <label className='prototype'>
                                                    <input type='checkbox' defaultValue={loc}/>
                                                    {loc}
                                                </label>
                                            </span>
                                        );
                                    })
                                }
                            </div>
                            ))
                        }
                        <button type='button' onClick={dispatchToggleIsEditing}>Cancel</button>
                        <button type='submit'>Save Changes</button>
                    </form>
                }
                {
                    typeof currentForm !== 'undefined' && <form onSubmit={this.saveFormChanges}>
                        <h1>Current url: { currentURL }</h1>
                        <div>
                            <label className='form-prop'>
                                Action Name:
                                <input type='text' name='name' defaultValue={currentForm.action.name} required onChange={this.handleFormAction}/>
                            </label>
                        </div>
                        <div>
                            <label htmlFor='description'>Description: </label><br/>
                            <textarea id='description' name='description' defaultValue={currentForm.action.description}
                                onChange={this.handleFormAction}></textarea>
                            <aside>
                                <p>
                                    Use the textarea to explain to the viewer what will happen when the form button is pressed, eg "Sends a
                                    request to the API server specifying the product and cart info".
                                </p>
                                <p>
                                    The action name and button text are carried over from the route properties form, and can be changed here if
                                    needed.
                                </p>
                                <p>
                                    You can optionally specify a route to redirect to after the main action of the form is done. For example, a
                                    form that signs the user up for a newsletter might redirect to a "thank-you" page afterwards. If you leave it
                                    blank, the user will stay on the current page.
                                </p>
                                <p>
                                    Use the form inputs to specify the form fields that will be visible on the page along with the submit button.
                                    For inputs of type "select", "checkbox", or "radio", use a comma-separated list in the "Value" property to
                                    generate a list of options or boxes -- one for each item. You can specify any other HTML attributes you want
                                    for the input in the "Attributes" field, complete with quotes, eg <code>class="form-control" maxlength="256"</code>
                                </p>
                            </aside>

                        </div>
                        <div>
                            <label className='form-prop'>
                                Button Text:
                                <input type='text' name='button' defaultValue={currentForm.action.button.label}
                                    onChange={this.handleFormAction}/>
                            </label>
                        </div>
                        <div>
                            <label className='form-prop'>
                                Redirect to:
                                <input type='text' name='exit' defaultValue={currentForm.action.exit.route}
                                    onChange={this.handleFormAction}/>
                            </label>
                        </div>
                        <h3>Form Inputs</h3>
                        {
                            formInputs.map((input, ff) => (<div className='input-props' key={`ff_${ff}`}>
                                <label className='input-prop'>
                                    Input type:
                                    <select name='type' defaultValue={input.type} onChange={this.handleFormInput(ff)}>
                                        {
                                            inputTypes.map((type, i) => (
                                                <option key={`type_${ff}_${i}`} value={type}>{ type }</option>
                                            ))
                                        }
                                        
                                    </select>
                                </label>
                                <label className='input-prop'>
                                    Label Text:
                                    <input type='text' name='label' defaultValue={input.label}
                                        onChange={this.handleFormInput(ff)}
                                        required={ff < formInputs.length - 1}/>
                                </label>
                                <label className='input-prop'>
                                    Value:
                                    <input type='text' name='value' defaultValue={input.value}
                                        onChange={this.handleFormInput(ff)}/>
                                </label>
                                <label className='input-prop'>
                                    Attributes:
                                    <input type='text' name='attributes' defaultValue={input.attributes}
                                        onChange={this.handleFormInput(ff)}/>
                                </label>
                            </div>))
                        }

                        <button type='button' onClick={dispatchToggleIsEditing}>Cancel</button>
                        <button type='submit'>Save Changes</button>
                    </form>
                }
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currentRoute: state.currentRoute,
        linkLocations: state.linkLocations,
        currentForm: state.currentForm,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchToggleIsEditing: (isEditing) => dispatch(toggleIsEditing(isEditing)),
        dispatchSaveRoute: (routeProps, globalExits = []) => dispatch(saveRoute(routeProps, globalExits)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteEditor);