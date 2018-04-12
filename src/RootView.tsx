import * as React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Dispatchable } from './_common/action';
import { UserToken } from './api/account/gen';
import { commonStyles } from './commonStyles';
import { LoginViewStack } from './loginView/LoginViewStack';
import { MainTabs } from './MainTabs';
import { RootState } from './redux';
import { autoLogin } from './redux_login';

export interface Props {
    userToken: UserToken;
    autoLogin: () => Dispatchable;
}

interface State {
    loading: boolean;
}

class RootView extends React.Component<Props, State> {
    private static renderLoading() {
        return (
            <View style={[commonStyles.screenCentered, {justifyContent: 'center'}]}>
                <Text style={{fontSize: 36, color: '#FF8800'}}>
                    火 星 计 划
                </Text>
                <Text style={{fontSize: 14, color: '#008888', marginTop: 12, paddingBottom: 96}}>
                    创建并分享你的梦想
                </Text>
            </View>
        );
    }

    public componentWillMount() {
        this.setState({loading: true});
    }

    public componentDidMount() {
        window.setInterval(
            () => {
                this.setState({loading: false});
            },
            2000);

        const userToken = this.props.userToken;
        const logged = userToken && userToken.accessToken && userToken.accessToken !== '';
        if (!logged) {
            this.props.autoLogin();
        }
    }

    public render() {
        const userToken = this.props.userToken;
        const logged = userToken && userToken.accessToken && userToken.accessToken !== '';

        if (!logged && this.state.loading) {
            return RootView.renderLoading();
        }

        return logged ? <MainTabs/> : <LoginViewStack/>;
    }
}

const selectProps = (rootState: RootState) => ({userToken: rootState.userToken});

export default connect(selectProps, {
    autoLogin
})(RootView);