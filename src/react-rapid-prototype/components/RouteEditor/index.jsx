import React from 'react';
import { connect } from 'react-redux';
import { toggleIsEditing } from '../../redux/actions';
import './styles.scss';

class RouteEditor extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            routeProps: {},
            routeForms: [],
            routeExits: [],
            formInputs: [],
        };
        this.setMinimumFields = this.setMinimumFields.bind(this);
    }

    componentDidMount() {
        const {currentRoute, location} = this.props;
        const currentURL = location.pathname;
        this.setState({
            routeProps: (typeof currentRoute === 'undefined')
                ? {
                    description: '',
                    exits: [],
                    forms: [],
                    route: currentURL
                } : currentRoute
        }, this.setMinimumFields)
    }

    setMinimumFields() {
        const routeForms = [...Array(this.state.routeProps.forms.length + 1).keys()]
            .map((index) => (this.state.routeProps.forms.length > index)
                ? this.state.routeProps.forms[index]
                : {
                    action: {
                        name: '',
                        description: '',
                        button: {
                            type: 'submit',
                            label: '',
                            attributes: ''
                        },
                        exit: null
                    },
                    inputs: []
                });
        
        const routeExits = [...Array(Math.max(5, this.state.routeProps.exits.length + 1)).keys()]
            .map((index) => (this.state.routeProps.exits.length > index)
                ? this.state.routeProps.exits[index]
                : {
                    route: '',
                    visibleText: '',
                    routeLocations: ['general']
                });

        this.setState({routeForms, routeExits});
    }

    render() {
        const {routeProps, routeForms, routeExits, formInputs} = this.state;
        const {location, linkLocations, dispatchToggleIsEditing, currentForm} = this.props;
        const currentURL = location.pathname;
        
        const handleDescription = (e) => {console.log(e)};
        
        const saveChanges = () => {};
        const saveFormChanges = () => {};
        const addFormProp = (index) => () => {};
        const addExitProp = (index) => () => {};
        const addInputProp = (index) => () => {};
        const exitTypes = ['form', 'link', 'global'];
        return (
            <section>
                {
                    typeof currentForm === 'undefined' && <form onSubmit={saveChanges}>
                        <h1>Current URL: {currentURL}</h1>
                        <div>
                            <textarea id='description' defaultValue={routeProps.description} onChange={handleDescription}></textarea>
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
                                        <select name='exitType'>
                                            {
                                                exitTypes.map((type, i) => {
                                                    const props = (type === 'form') ? {selected: true} : null;
                                                    return (
                                                        <option {...props} key={`exittype_${fIdx}_${i}`} value={type}>{ type }</option>
                                                    );
                                                })
                                            }
                                        </select>
                                    </label>
                                    <label className='route-prop'>
                                        Button Text:
                                        <input type='text' name='visibleText' defaultValue={form.action.button.label}
                                            onKeyUp={addFormProp}/>
                                    </label>
                                    <label className='route-prop'>
                                        Action:
                                        <input type='text' name='action' defaultValue={form.action.name}/>
                                    </label>
                                    &nbsp; &nbsp;
                                    Prototype:
                                    {
                                        linkLocations.map((loc, lIdx) => {
                                            return (
                                                <span style={{marginRight: '1em'}} key={`formlocation_${fIdx}_${lIdx}`}>
                                                    <label className='prototype'>
                                                        <input type='checkbox' value={loc}/>
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
                                    <select name='exitType'>
                                        {
                                            exitTypes.map((type, i) => {
                                                const props = (type === 'link') ? {selected: true} : null;
                                                return (
                                                    <option {...props} key={`exittype_${idx}_${i}`} value={type}>{ type }</option>
                                                )
                                            })
                                        }
                                    </select>
                                </label>
                                <label className='route-prop'>
                                    Link Text:
                                    <input type='text' name='visibleText' defaultValue={exit.visibleText} onKeyUp={addExitProp(idx)}/>
                                </label>
                                <label className='route-prop'>
                                    Route:
                                    <input type='text' name='action' defaultValue={exit.route}/>
                                </label>
                                &nbsp; &nbsp;
                                Prototype:
                                {
                                    linkLocations.map((loc, lIdx) => {
                                        return (
                                            <span key={`loc_${idx}_${lIdx}`} style={{marginRight: '1em'}}>
                                                <label className='prototype'>
                                                    <input type='checkbox' value={loc}/>
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
                    typeof currentForm !== 'undefined' && <form onSubmit={saveFormChanges}>
                        <h1>Current url: { currentURL }</h1>
                        <div>
                            <label className='form-prop'>
                                Action Name:
                                <input type='text' name='name' defaultValue={currentForm.name}/>
                            </label>
                        </div>
                        <div>
                            <label for='description'>Description: </label><br/>
                            <textarea id='description' name='description' defaultValue={currentForm.description}></textarea>
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
                                <input type='text' name='button' defaultValue={currentForm.action.button.label}/>
                            </label>
                        </div>
                        <div>
                            <label className='form-prop'>
                                Redirect to:
                                <input type='text' name='exit' defaultValue={currentForm.action.exit.route}/>
                            </label>
                        </div>
                        <h3>Form Inputs</h3>
                        {
                            formInputs.map((input, ff) => (<div key={`ff_${ff}`}>
                                <label className='input-prop'>
                                    Input type:
                                    <select name='type'>
                                        {
                                            exitTypes.map((type, i) => {

                                                return (
                                                    <option key={`type_${ff}_${i}`} value={type}>{ type }</option>
                                                );
                                            })
                                        }
                                        
                                    </select>
                                </label>
                                <label className='input-prop'>
                                    Label Text:
                                    <input type='text' name='label' defaultValue={input.label} onKeyUp={addInputProp(ff)}/>
                                </label>
                                <label className='input-prop'>
                                    Value:
                                    <input type='text' name='value' defaultValue={input.value}/>
                                </label>
                                <label className='input-prop'>
                                    Attributes:
                                    <input type='text' name='attributes' defaultValue={input.attributes}/>
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
        dispatchToggleIsEditing: () => dispatch(toggleIsEditing()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RouteEditor);