import * as React from 'react';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import LoginView from './loginView/LoginView';
import ResetPasswordView from './loginView/ResetPasswordView';
import SignupView from './loginView/SignupView';
import MainView from './mainView/MainView';
import { RootState } from './redux';

export interface Props {
    rootState: RootState;
}

interface State {
    s: string;
}

const LoginViewStack = StackNavigator({
    Login: {screen: LoginView},
    Signup: {screen: SignupView},
    ResetPassword: {screen: ResetPasswordView}
});

class RootView extends React.Component<Props, State> {
    public render() {
        if (this.props.rootState.oauthJumpResponse.token == null) {
            return (<LoginViewStack/>);
        } else {
            return <MainView/>;
        }
    }
}

export default connect((rootState: RootState) => ({rootState}), {

})(RootView);