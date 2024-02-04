import React from 'react';
import Logo from './Logo';
import './styles.scss';
import {useRouteViewerProps} from 'react-rapid-prototype'
import { Link, NavLink } from 'react-router-dom';

const AppTemplate = (props) => {
    const {
        currentRoute,
        currentURL,
        currentForm,
        currentFormExit,
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
    } = useRouteViewerProps(props);

    const topNavExits =  bucketedExits.topNav || [];

    const prototypedDescription = {
        '/': <div className='details'>
                <figure>
                <img src='/images/properties/12345.png' alt='Oxford Court (Strata XXX 333)' />
                <figcaption>
                    <strong>Oxford Court (Strata LMS 000)</strong>
                    123 Any Street, Someville BC
                </figcaption>
            </figure>
            <p>
                A 17-unit condominium located in the heart of Downtown Someville. Minutes away from walking trails, shopping,
                restaurants, and the future site of a Skytrain station.
            </p>
        </div>
    };

    const prototypedCard = (card, idx) => {
        if (card.inputs) {
            const form = card;
            return <section key={`cardform_${idx}`}>
                <h2>{form.action.button.label}</h2>
                <form data-content-form={form.action.name} onSubmit={handleFormButton(idx)}>
                    {formInputs(form.inputs, `card_${idx}`)}
                    <div className="buttons">
                        <button type='submit'>Continue</button>
                    </div>
                </form>
            </section>;
        }

        switch (card.visibleText) {
            case 'Show Full Contact List':
                return <section key={`cardlink_${idx}`}>
                    <h2>Strata Council Contacts</h2>
                    <nav>
                        <Link to={card.route} data-content-exit>{card.visibleText}</Link>
                    </nav>
                    <dl>
                        <dt>Danny McDonald, President</dt>
                        <dd>
                            <a href="mailto:someone@somewhere.com">someone@somewhere.com</a>
                            <br />
                            <a href="tel:604-555-5555">604-555-5555</a>
                        </dd>
                        <dt>Nancy Gordon, Secretary</dt>
                        <dd>
                            <a href="mailto:someone@somewhere.com">someone@somewhere.com</a>
                            <br />
                            <a href="tel:604-555-5555">604-555-5555</a>
                        </dd>
                        <dt>Matt Richards, Treasurer</dt>
                        <dd>
                            <a href="mailto:someone@somewhere.com">someone@somewhere.com</a>
                            <br />
                            <a href="tel:604-555-5555">604-555-5555</a>
                        </dd>
                        <dt>Stan Phelps</dt>
                        <dd>
                            <a href="mailto:someone@somewhere.com">someone@somewhere.com</a>
                            <br />
                            <a href="tel:604-555-5555">604-555-5555</a>
                        </dd>
                    </dl>
                </section>;

            default:
                return <section key={`cardlink_${idx}`}>
                    <h2>{card.visibleText}</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac lectus magna. Integer a auctor.
                    </p>
                    <div className="ctas">
                        <Link to={card.route} data-content-exit>Learn More</Link>
                    </div>
                </section>
        }
    };

    const formInputs = (inputs, prefix) => inputs.map((input, i) => (
        <div className='inputs' key={`input_${prefix}_${i}`}>
            {
                ['text', 'email', 'url', 'password', 'number', 'file', 'range'].indexOf(input.type) > -1 && <label>
                    <span className='label'>{input.label}:</span>
                    <input type={input.type} defaultValue={input.value}/>
                </label>
            }
            {
                ['radio', 'checkbox'].indexOf(input.type) > -1 && <span>
                    <span className='label'>{input.label}:</span>
                    {
                        input.value.split(',').map((value, k) => (<label key={`label_${prefix}_${i}_${k}`}>
                            <input key={`input_${prefix}_${i}_${k}`}
                                name={`input_${prefix}_${i}`}
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
                    <span className='label'>{input.label}:</span>
                    <textarea defaultValue={input.value}></textarea>
                </label>
            }
            {
                input.type === 'select' && <label>
                    <span className="label">{input.label}:</span>
                    <select>
                        {
                            input.value.split(',').map((value, k) => (
                                <option key={`option_${prefix}_${i}_${k}`} value={value}>{value}</option>
                            ))
                        }
                    </select>
                </label>
            }
        </div>
    ));

    const cards = [
        ...(bucketedExits.card || []),
        ...(bucketedForms.card || [])
    ];



    return (
        <div id='container'>
            <header>
                <div>
                    <h1>
                        <Logo width={20} fill='#4DB9B2'/>
                        My Strata Hub
                    </h1>
                    {
                        topNavExits.length > 0 && <nav id='topnav'>
                            <ul>
                                {
                                    topNavExits.map((exit, idx) => <li key={`topnav_${idx}`}>
                                        <NavLink data-content-exit exact={exit.route === '/'} to={exit.route} activeClassName='active'>{exit.visibleText}</NavLink>
                                    </li>)
                                }
                            </ul>
                        </nav>
                    }
                </div>
            </header>
            {
                isDevMode && !isPreviewing && (currentForm ? <DevModeFormControls/> : <DevModeRouteControls/>)
            }
            <main data-content-start>
            {
                ( currentForm && <div>
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
                </div>
              </div> ) || <div>
                {
                    ( prototypedDescription.hasOwnProperty(currentURL) && prototypedDescription[currentURL] ) || <div>
                        <h1>Current url: { currentURL }</h1>
                        <p>
                            { routeFound ? currentRoute.description : 'Route not defined' }
                        </p>
                    </div>
                }
                {
                    bucketedExits.hasOwnProperty('homecal') && <section id='home_cal'>
                        <h2>This Week's Events <aside>(Sunday, June 26 2022 - Saturday, July 2 2022)</aside></h2>
                        <nav>
                            {
                                bucketedExits.homecal.map((exit, idx) => <Link data-content-exit key={`homecal_${idx}`} to={exit.route}>{exit.visibleText}</Link>)
                            }
                        </nav>
                        <ul>
                            <li className='lastmonth'>
                                <strong>Sun, Jun 26</strong>
                            </li>
                            <li className='lastmonth'>
                                <strong>Mon, Jun 27</strong>
                            </li>
                            <li className='lastmonth'>
                                <strong>Tues, Jun 28</strong>
                                Emterra Pickup
                            </li>
                            <li className='lastmonth'>
                                <strong>Wed, Jun 29</strong>
                            </li>
                            <li className='lastmonth'>
                                <strong>Thur, Jun 30</strong>
                            </li>
                            <li>
                                <strong>Fri, Jul 1</strong>
                                July Strata fees due
                            </li>
                            <li>
                                <strong>Sat, Jul 2</strong>
                                Work Day 2pm - Signup sheet in lobby
                            </li>
                        </ul>
                    </section>
                }
                {
                    cards.length > 0 && <div className='cards'>
                        {
                            cards.map((card, idx) => prototypedCard(card, idx))
                        }
                    </div>
                }
                {
                    bucketedForms.hasOwnProperty('general') && bucketedForms.general.map((form, f) => <section key={`generalform_${f}`}>
                        <h2>{form.action.button.label}</h2>
                        <form data-content-form={form.action.name} onSubmit={handleFormButton(f)}>
                            {formInputs(form.inputs, f)}
                            <div className="buttons">
                                <button type='submit'>Continue</button>
                            </div>
                        </form>
                    </section>)
                }
                {
                    bucketedExits.hasOwnProperty('general') && <section>
                        <h2>Exits</h2>
                        <ul>
                            {
                                bucketedExits.general.map((exit, idx) => (
                                    <li key={`generalexit_${idx}`}>
                                        <Link data-content-exit to={exit.route}>{exit.visibleText}</Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </section>
                }
              </div>
            }
            </main>
            <footer>
                <div>
                    <h2>
                        <Logo width={20} fill='#fff'/>
                        My Strata Hub
                    </h2>
                    <ul>
                        <li>
                            <strong>Members areas</strong>
                            <ul>
                                {
                                    bucketedExits.hasOwnProperty('footer') && bucketedExits.footer.map((exit, idx) => (
                                        <li key={`footerlink_${idx}`}>
                                            <Link data-content-exit to={exit.route}>{exit.visibleText}</Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                        <li>
                            <strong>General Information</strong>
                            <ul>
                                <li>
                                    <a href="/#">About My Strata Hub</a>
                                </li>
                                <li>
                                    <a href="/#">Pricing</a>
                                </li>
                                <li>
                                    <a href="/#">Sign up your Strata</a>
                                </li>
                                <li>
                                    <a href="/#">Contact Us</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>Join us on the Socials</strong>
                            <ul>
                                <li>
                                    <a href="/#">Facebook</a>
                                </li>
                                <li>
                                    <a href="/#">Instagram</a>
                                </li>
                                <li>
                                    <a href="/#">Twitter</a>
                                </li>
                                <li>
                                    <a href="/#">Blog</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <div>Copyright 2022, All rights reserved</div>
                </div>
            </footer>
        </div>
    );
};

export default AppTemplate;