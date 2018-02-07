import * as React from 'react';
import { connect } from 'react-redux';
import { LoginViewStack } from './loginView/LoginViewStack';
import { MainViewTabs } from './mainView/MainViewTabs';
import { RootState } from './redux';

export interface Props {
    token: string;
}

class RootView extends React.Component<Props> {
    public render() {
        if (this.props.token == null) {
            return (<LoginViewStack/>);
        } else {
            return <MainViewTabs/>;
        }
    }
}

export default connect((rootState: RootState) => ({token: rootState.oauthJumpResponse.token}), {

})(RootView);