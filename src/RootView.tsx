import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatchable } from './_common/action';
import { Token } from './api/user-private/gen';
import { LoginViewStack } from './loginView/LoginViewStack';
import { MainTabs } from './MainTabs';
import { RootState } from './redux';
import { autoLogin } from './redux_login';

export interface Props {
    token: Token;
    autoLogin: () => Dispatchable;
}

class RootView extends React.Component<Props> {
    public componentWillMount() {
        this.props.autoLogin();
    }

    public render() {
        const token = this.props.token;
        const logged = token && token.accessToken && token.accessToken !== '';

        return logged ? <MainTabs/> : <LoginViewStack/>;
    }
}

const selectProps = (rootState: RootState) => ({token: rootState.token});

export default connect(selectProps, {
    autoLogin
})(RootView);