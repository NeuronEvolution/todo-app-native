import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { rootReducer } from './src/redux';
import RootView from './src/RootView';

const store = createStore(rootReducer, {}, applyMiddleware(thunk, logger));

export default class App extends Component<{}> {
    public render() {
        return (
            <Provider store={store}>
                <RootView/>
            </Provider>
        );
    }
}