import * as React from 'react';
import { connect } from 'react-redux';
import { Token } from './api/user-private/gen';
import { LoginViewStack } from './loginView/LoginViewStack';
import { MainTabs } from './MainTabs';
import { RootState } from './redux';

export interface Props {
    token: Token;
}

class RootView extends React.Component<Props> {
    public render() {
        const token = this.props.token;
        const logged = token && token.accessToken && token.accessToken !== '';

        return logged ? <MainTabs/> : <LoginViewStack/>;
    }
}

const selectProps = (rootState: RootState) => ({token: rootState.token});

export default connect(selectProps, {})(RootView);