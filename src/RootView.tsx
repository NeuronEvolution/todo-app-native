import * as React from 'react';
import { connect } from 'react-redux';
import { LoginViewStack } from './loginView/LoginViewStack';
import { MainTabs } from './MainTabs';
import { RootState } from './redux';

export interface Props {
    token: string;
}

class RootView extends React.Component<Props> {
    public render() {
        if (this.props.token == null) {
            return (<LoginViewStack/>);
        } else {
            return <MainTabs/>;
        }
    }
}

export default connect((rootState: RootState) => ({token: rootState.oauthJumpResponse.token}), {

})(RootView);