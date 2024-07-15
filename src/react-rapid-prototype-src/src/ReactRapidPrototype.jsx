import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './styles.scss';
import { ProviderRRP } from './context/store';
import ContextRRP from './components/ContextRRP';

const ReactRapidPrototype = (props) => (
    <ProviderRRP>
        <BrowserRouter>
            <ContextRRP {...props}/>
        </BrowserRouter>
    </ProviderRRP>
);

export default ReactRapidPrototype;