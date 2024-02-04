import React from 'react';
import { useContextRRP } from '../../context/store';
import { saveRoute, toggleIsEditing } from '../../context/actions';
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
        this.handleCancel = this.handleCancel.bind(this);
        this.saveRouteChanges = this.saveRouteChanges.bind(this);
        this.saveFormChanges = this.saveFormChanges.bind(this);
    }

    static emptyForm = {
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
    };

    static emptyExit = {
        route: '',
        visibleText: '',
        routeLocations: ['general']
    };

    componentDidMount() {
        const {currentRoute, currentFormIndex, location} = this.props;
        const currentURL = location.pathname;
        const formProps = (typeof currentFormIndex === 'undefined')
                ? undefined
                : JSON.parse(JSON.stringify(currentRoute.forms[currentFormIndex]));
        const routeProps = (typeof currentRoute === 'undefined')
                ? {
                    description: '',
                    exits: [],
                    forms: [],
                    route: currentURL
                } : JSON.parse(JSON.stringify(currentRoute));
        
        this.setState({
            formProps,
            routeProps,
        }, this.setMinimumFields);
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
                ? {
                    type: 'form',
                    ...RouteEditor.fixFormLocations(routeProps.forms[index]),
                }
                : {
                    type: 'form',
                    ...RouteEditor.emptyForm,
                });
        
        const routeExits = [...Array(routeProps.exits.length + 1).keys()]
            .map((index) => (routeProps.exits.length > index)
                ? {
                    type: 'link',
                    ...RouteEditor.fixExitLocations(routeProps.exits[index]),
                }
                : {
                    type: 'link',
                    ...RouteEditor.emptyExit,
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
            const form = JSON.parse(JSON.stringify(routeForms[index]));
            const fieldName = e.target.name;
            const value = e.target.value;
            
            switch (fieldName) {
                case 'visibleText' :
                    form.action.button.label = value;
                    break;
                case 'action' :
                    form.action.name = value;
                    break;
                case 'exitType' :
                    form.type = value;
                    break;
                case 'prototype' :
                    if (e.target.checked) {
                        form.action.exit.routeLocations.push(value);
                    } else {
                        const pos = form.action.exit.routeLocations.indexOf(value);
                        if (pos > -1) {
                            form.action.exit.routeLocations.splice(pos, 1);
                        }
                    }
                    break;
                default :
                    break;
            }
            routeProps.forms[index] = form;
            this.setState({routeProps}, this.setMinimumFields);
        };
    }
    
    handleRouteExit(index) {
        return (e) => {
            const {routeProps, routeExits} = this.state;
            const exit = JSON.parse(JSON.stringify(routeExits[index]));
            const value = e.target.value;
            const fieldName = e.target.name;
            
            switch (fieldName) {
                case 'exitType' :
                    exit.type = value;
                    break;
                case 'prototype' :
                    if (e.target.checked) {
                        exit.routeLocations.push(value);
                    } else {
                        const pos = exit.routeLocations.indexOf(value);
                        if (pos > -1) {
                            exit.routeLocations.splice(pos, 1);
                        }
                    }
                    break;
                default :
                    exit[fieldName] = value;
                    break;
            }
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

    handleCancel(e) {
        this.setMinimumFields();
        this.props.dispatchToggleIsEditing(false);
        e.preventDefault();
    }
    
    saveRouteChanges(e) {
        const {dispatchSaveRoute, dispatchToggleIsEditing} = this.props;
        const {routeProps} = this.state;
        const {forms, exits, globals} = RouteEditor.remapExitTypes(routeProps);
        routeProps.forms = forms;
        routeProps.exits = exits;

        dispatchSaveRoute(routeProps, globals);
        dispatchToggleIsEditing(false);
        e.preventDefault();
    };
    
    saveFormChanges(e) {
        const {currentRoute, currentFormIndex, dispatchSaveRoute, dispatchToggleIsEditing} = this.props;
        const {formProps} = this.state;
        currentRoute.forms[currentFormIndex] = formProps;
        dispatchSaveRoute(currentRoute);
        dispatchToggleIsEditing(false);
        e.preventDefault();
    };

    render() {
        const {routeProps, routeForms, routeExits, formProps, formInputs} = this.state;
        const {location, linkLocations, currentFormIndex} = this.props;
        const currentURL = location.pathname;
        const exitTypes = ['form', 'link', 'global'];
        const inputTypes = ['textarea', 'text', 'email', 'number', 'range', 'url', 'password', 'select', 'radio', 'checkbox', 'file', 'button'];
        return (
            <section>
                {
                    typeof currentFormIndex === 'undefined' && <form onSubmit={this.saveRouteChanges}>
                        <h1>Current URL: {currentURL}</h1>
                        <div>
                            <textarea id='description' value={routeProps.description} onChange={this.handleDescription}></textarea>
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
                                        <select name='exitType' value={form.type} onChange={this.handleRouteForm(fIdx)}>
                                            {
                                                exitTypes.map((type, i) => (
                                                    <option key={`exittype_form_${fIdx}_${i}`} value={type}>{ type }</option>
                                                ))
                                            }
                                        </select>
                                    </label>
                                    <label className='route-prop'>
                                        Button Text:
                                        <input type='text' name='visibleText' value={form.action.button.label}
                                            onChange={this.handleRouteForm(fIdx)}
                                            required={form.action.name.length > 0}/>
                                    </label>
                                    <label className='route-prop'>
                                        Action:
                                        <input type='text' name='action' value={form.action.name}
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
                                                        <input type='checkbox' name='prototype'
                                                            value={loc} 
                                                            checked={form.action.exit.routeLocations.indexOf(loc) > -1}
                                                            onChange={this.handleRouteForm(fIdx)}
                                                            disabled={fIdx === routeProps.forms.length}
                                                            required={form.action.exit.routeLocations.length === 0}/>
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
                                    <select name='exitType' value={exit.type} onChange={this.handleRouteExit(idx)}>
                                        {
                                            exitTypes.map((type, i) => (
                                                <option key={`exittype_exit_${idx}_${i}`} value={type}>{ type }</option>
                                            ))
                                        }
                                    </select>
                                </label>
                                <label className='route-prop'>
                                    Link Text:
                                    <input type='text' name='visibleText' value={exit.visibleText} 
                                        onChange={this.handleRouteExit(idx)}
                                        required={exit.route.length > 0}/>
                                </label>
                                <label className='route-prop'>
                                    Route:
                                    <input type='text' name='route' value={exit.route} 
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
                                                    <input type='checkbox' name='prototype'
                                                        value={loc}
                                                        checked={exit.routeLocations.indexOf(loc) > -1}
                                                        onChange={this.handleRouteExit(idx)}
                                                        disabled={idx === routeProps.exits.length}/>
                                                    {loc}
                                                </label>
                                            </span>
                                        );
                                    })
                                }
                            </div>
                            ))
                        }
                        <button type='button' onClick={this.handleCancel}>Cancel</button>
                        <button type='submit'>Save Changes</button>
                    </form>
                }
                {
                    typeof currentFormIndex !== 'undefined' && formProps && <form onSubmit={this.saveFormChanges}>
                        <h1>Current url: { currentURL }</h1>
                        <div>
                            <label className='form-prop'>
                                Action Name:
                                <input type='text' name='name' value={formProps.action.name} required onChange={this.handleFormAction}/>
                            </label>
                        </div>
                        <div>
                            <label htmlFor='description'>Description: </label><br/>
                            <textarea id='description' name='description' value={formProps.action.description}
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
                                <input type='text' name='button' value={formProps.action.button.label}
                                    onChange={this.handleFormAction}/>
                            </label>
                        </div>
                        <div>
                            <label className='form-prop'>
                                Redirect to:
                                <input type='text' name='exit' value={formProps.action.exit.route || ''}
                                    onChange={this.handleFormAction}/>
                            </label>
                        </div>
                        <h3>Form Inputs</h3>
                        {
                            formInputs.map((input, ff) => (<div className='input-props' key={`ff_${ff}`}>
                                <label className='input-prop'>
                                    Input type:
                                    <select name='type' value={input.type} onChange={this.handleFormInput(ff)}>
                                        {
                                            inputTypes.map((type, i) => (
                                                <option key={`type_${ff}_${i}`} value={type}>{ type }</option>
                                            ))
                                        }
                                        
                                    </select>
                                </label>
                                <label className='input-prop'>
                                    Label Text:
                                    <input type='text' name='label' value={input.label}
                                        onChange={this.handleFormInput(ff)}
                                        required={ff < formInputs.length - 1}/>
                                </label>
                                <label className='input-prop'>
                                    Value:
                                    <input type='text' name='value' value={input.value}
                                        onChange={this.handleFormInput(ff)}/>
                                </label>
                                <label className='input-prop'>
                                    Attributes:
                                    <input type='text' name='attributes' value={input.attributes}
                                        onChange={this.handleFormInput(ff)}/>
                                </label>
                            </div>))
                        }

                        <button type='button' onClick={this.handleCancel}>Cancel</button>
                        <button type='submit'>Save Changes</button>
                    </form>
                }
            </section>
        );
    }

    static remapExitTypes(routeProps) {
        const {formForms, formLinks, formGlobals} = routeProps.forms.reduce(RouteEditor.remapRouteForms, {formForms: [], formLinks: [], formGlobals: []});
        const {linkForms, linkLinks, linkGlobals} = routeProps.exits.reduce(RouteEditor.remapRouteExits, {linkForms: [], linkLinks: [], linkGlobals: []});
        return {
            forms: [...formForms, ...linkForms],
            exits: [...formLinks, ...linkLinks],
            globals: [...formGlobals, ...linkGlobals]
        };
    }

    static remapRouteForms(collector, form) {
        form.type = form.type || 'form';
        if (form.type === 'form') {
            delete form.type;
            collector.formForms.push(form);
            return collector;
        }
        const exit = {
            ...form.action.exit,
            visibleText: form.action.button.label
        };
        if (exit.route === null) {
            exit.route = '/';
        }
        const collection = (form.type === 'global') ? 'formGlobals' : 'formLinks';
        collector[collection].push(exit);
        return collector;
    }

    static remapRouteExits(collector, exit) {
        exit.type = exit.type || 'exit';
        if (exit.type === 'form') {
            delete exit.type;
            const form = {
                ...RouteEditor.emptyForm
            };
            form.action.button.label = exit.visibleText;
            form.action.exit = {
                ...exit
            };
            collector.linkForms.push(form);
            return collector;
        }
        const collection = (exit.type === 'global') ? 'linkGlobals' : 'linkLinks';
        delete exit.type;
        collector[collection].push(exit);
        return collector;
    }

    static fixFormLocations(form) {
        if (typeof form.action.exit === 'undefined') {
            form.action.exit = {
                ...RouteEditor.emptyExit,
                route: null
            };
        }
        if (JSON.stringify(form.action.exit.routeLocations) === '[""]') {
            form.action.exit.routeLocations = ['general'];
        }
        return form;
    }

    static fixExitLocations(exit) {
        if (JSON.stringify(exit.routeLocations) === '[""]') {
            exit.routeLocations = ['general'];
        }
        return exit;
    }
}

const ProppedRouteEditor = (props) => {
    const {state, dispatch} = useContextRRP();
    const propsForComponent = {
        ...props,
        
        currentRoute: state.currentRoute,
        linkLocations: state.linkLocations,
        currentFormIndex: state.currentFormIndex,

        dispatchToggleIsEditing: (isEditing) => dispatch(toggleIsEditing(isEditing)),
        dispatchSaveRoute: (routeProps, globalExits = []) => dispatch(saveRoute(routeProps, globalExits)),
    };

    return <RouteEditor {...propsForComponent} />;
}

export default ProppedRouteEditor;