import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { rootReducer, RootState } from './src/redux';
import RootView from './src/RootView';

export const REDUX_STORE = createStore<RootState>(rootReducer, applyMiddleware(thunk, logger));

export default class App extends Component<{}> {
    public render() {
        return (
            <Provider store={REDUX_STORE}>
                <RootView/>
            </Provider>
        );
    }
}