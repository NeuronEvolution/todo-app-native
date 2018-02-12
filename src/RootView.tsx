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
        const logged = this.props.token && this.props.token.accessToken && this.props.token.accessToken !== '';

        return logged ? <MainTabs/> : <LoginViewStack/>;
    }
}

export default connect((rootState: RootState) => ({token: rootState.token}), {

})(RootView);