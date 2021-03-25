import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import ConnectedRRP from './components/ConnectedRRP';
import './styles.scss';

const ReduxRapidPrototype = (props) => (
    <Provider store={store}>
        <BrowserRouter>
            <ConnectedRRP {...props}/>
        </BrowserRouter>
    </Provider>
);

export default ReduxRapidPrototype;