import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { connect } from 'react-redux';
import TimedComponent from './_react_native_common/TimedComponent';
import LoginView from './loginView/LoginView';
import MainView from './mainView/MainView';
import { RootState } from './redux';

export interface Props {
    rootState: RootState;
}

interface State {
    s: string;
}

class RootView extends React.Component<Props, State> {
    public render() {
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
            }}>
                {this.props.rootState.oauthJumpResponse === undefined
                || this.props.rootState.oauthJumpResponse.token === undefined
                    ? <LoginView/> : <MainView/>}
                {this.renderToast()}
            </View>
        );
    }

    private renderToast() {
        return (
            <View style={{
                position: 'absolute',
                top: Dimensions.get('window').height * 0.9,
            }}>
                <TimedComponent
                    timestamp={this.props.rootState.globalToast.timestamp}
                    contentElement={<Text>{this.props.rootState.globalToast.text}</Text>}
                    intervalMillSec={1000}
                />
            </View>
        );
    }
}

export default connect((rootState: RootState) => ({rootState }), {

})(RootView);