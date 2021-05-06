import React from 'react';
import './styles.scss';

const NotFound = ({location}) => (
    <section id='route_details'>
        <h1>{location.pathname}</h1>
        <p>This page is not defined. Please contact the developer for assistance.</p>
    </section>
);

export default NotFound;