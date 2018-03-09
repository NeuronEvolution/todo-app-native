import * as React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { loginParams, smsCodeParams, smsLoginParams, smsSignupParams } from '../api/account-private/gen';
import { commonStyles } from '../commonStyles';
import { apiAccountLogin, apiAccountSmsCode, apiAccountSmsLogin, apiAccountSmsSignup } from '../redux_login';
import ToastView, { onGlobalToast } from '../ToastView';

export interface Props extends NavigationScreenProps<void> {
    onGlobalToast: (text: string) => Dispatchable;
    apiAccountLogin: (p: loginParams) => Dispatchable;
    apiAccountSmsCode: (p: smsCodeParams) => Dispatchable;
    apiAccountSmsLogin: (p: smsLoginParams) => Dispatchable;
    apiAccountSmsSignup: (p: smsSignupParams) => Dispatchable;
}

interface State {
    tabIndex: number;
    loginName: string;
    loginPassword: string;
    loginPhone: string;
    loginSmsCode: string;
}

const initialState = {
    tabIndex: 0,
    loginName: '',
    loginPassword: '',
    loginPhone: '',
    loginSmsCode: '',
};

class LoginScreen extends React.Component<Props, State> {
    private static renderTitle(): JSX.Element {
        return (<Text style={[commonStyles.text, styles.title]}>登录火星</Text>);
    }

    public componentWillMount() {
        this.onLoginPressed = this.onLoginPressed.bind(this);
        this.onResetPasswordPressed = this.onResetPasswordPressed.bind(this);
        this.onSignupPressed = this.onSignupPressed.bind(this);
        this.onLoginNameChanged = this.onLoginNameChanged.bind(this);
        this.onLoginPasswordChanged = this.onLoginPasswordChanged.bind(this);
        this.onPressTabAccountLogin = this.onPressTabAccountLogin.bind(this);
        this.onPressTabSmsLogin = this.onPressTabSmsLogin.bind(this);
        this.onPhoneChanged = this.onPhoneChanged.bind(this);
        this.onSmsCodeChanged = this.onSmsCodeChanged.bind(this);
        this.onGetSmsCodePressed = this.onGetSmsCodePressed.bind(this);

        this.setState(initialState);
    }

    public render() {
        const {tabIndex} = this.state;

        return <View style={[commonStyles.screenCentered]}>
            {LoginScreen.renderTitle()}
            {this.renderTabHeader()}
            <View style={[commonStyles.line, commonStyles.contentWidth]}/>
            {tabIndex === 0 ? this.renderAccountLogin() : null}
            {tabIndex === 1 ? this.renderSmsLogin() : null}
            {this.renderLoginButton()}
            {this.renderLinks()}
            <ToastView/>
        </View>;
    }

    private renderLoginButton(): JSX.Element {
        return (
            <TouchableOpacity
                style={[commonStyles.button, commonStyles.contentWidth, {marginTop: 8}]}
                onPress={this.onLoginPressed}>
                <Text style={[commonStyles.buttonText]}>登录</Text>
            </TouchableOpacity>
        );
    }

    private renderLinks(): JSX.Element {
        return (
            <View style={[styles.links]}>
                <Text
                    style={[commonStyles.text]}
                    onPress={this.onResetPasswordPressed}>
                    &nbsp;&nbsp;&nbsp;&nbsp;忘记密码？
                </Text>
                <Text
                    style={[commonStyles.text]}
                    onPress={this.onSignupPressed}>
                    新用户注册&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
            </View>
        );
    }

    private renderTabHeader() {
        const accountColor = this.state.tabIndex === 0 ? {backgroundColor: '#eee'} : {backgroundColor: '#fff'};
        const smsColor = this.state.tabIndex === 1 ? {backgroundColor: '#eee'} : {backgroundColor: '#fff'};

        return (
            <View style={[commonStyles.flexRowCentered]}>
                <TouchableOpacity
                    style={[commonStyles.button, styles.loginMethodTabButton, accountColor]}
                    onPress={this.onPressTabAccountLogin}>
                    <Text style={[commonStyles.text]}>帐号密码登录</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[commonStyles.button, styles.loginMethodTabButton, smsColor]}
                    onPress={this.onPressTabSmsLogin}>
                    <Text style={[commonStyles.text]}>短信验证码登录</Text>
                </TouchableOpacity>
            </View>
        );
    }

    private onPressTabAccountLogin() {
        this.setState({tabIndex: 0});
    }

    private onPressTabSmsLogin() {
        this.setState({tabIndex: 1});
    }

    private renderAccountLogin() {
        return (
            <View style={[commonStyles.flexColumnCentered]}>
                <View style={[commonStyles.flexRowCentered]}>
                    <Text style={[commonStyles.text, {width: 60}]}>帐号</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[commonStyles.textInput, {width: 200}]}
                        onChangeText={this.onLoginNameChanged}
                        value={this.state.loginName}
                        placeholder={'请输入手机号码'}
                    />
                </View>
                <View style={[commonStyles.flexRowCentered]}>
                    <Text style={[commonStyles.text, {width: 60}]}>密码</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[commonStyles.textInput, {width: 200}]}
                        onChangeText={this.onLoginPasswordChanged}
                        value={this.state.loginPassword}
                        placeholder={'请输入密码'}
                    />
                </View>
            </View>
        );
    }

    private onLoginNameChanged(text: string) {
        this.setState({loginName: text});
    }

    private onLoginPasswordChanged(text: string) {
        this.setState({loginPassword: text});
    }

    private renderSmsLogin() {
        return (
            <View style={[commonStyles.flexColumnCentered]}>
                <View style={[commonStyles.flexRowCentered]}>
                    <Text style={[commonStyles.text, {width: 80}]}>手机号</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[commonStyles.textInput, {width: 220}]}
                        onChangeText={this.onPhoneChanged}
                        value={this.state.loginPhone}
                        placeholder={'请输入手机号码'}/>
                </View>
                <View style={[commonStyles.flexRowCentered]}>
                    <Text style={[commonStyles.text, {width: 80}]}>验证码</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[commonStyles.textInput, {width: 60}]}
                        onChangeText={this.onSmsCodeChanged}
                        value={this.state.loginSmsCode}/>
                    <TouchableOpacity
                        style={[commonStyles.button, {width: 160, backgroundColor: '#fff'}]}
                        onPress={this.onGetSmsCodePressed}>
                        <Text style={[commonStyles.buttonColorText]}>获取验证码</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    private onPhoneChanged(text: string) {
        this.setState({loginPhone: text});
    }

    private onSmsCodeChanged(text: string) {
        this.setState({loginSmsCode: text});
    }

    private onGetSmsCodePressed() {
        const phone = this.state.loginPhone;
        if (phone === '') {
            return this.props.onGlobalToast('请输入手机号');
        }

        this.props.apiAccountSmsCode({scene: 'SMS_LOGIN', phone});
    }

    private onLoginPressed() {
        if (this.state.tabIndex === 0) {
            const {loginName, loginPassword} = this.state;
            if (loginName === '') {
                return this.props.onGlobalToast('请输入帐号');
            }
            if (loginPassword === '') {
                return this.props.onGlobalToast('请输入密码');
            }

            this.props.apiAccountLogin({name: loginName, password: loginPassword});
        } else {
            const {loginPhone, loginSmsCode} = this.state;
            if (loginPhone === '') {
                return this.props.onGlobalToast('请输入手机号');
            }
            if (loginSmsCode === '') {
                return this.props.onGlobalToast('请输入验证码');
            }

            this.props.apiAccountSmsLogin({phone: loginPhone, smsCode: loginSmsCode});
        }
    }

    private onSignupPressed() {
        this.props.navigation.navigate('Signup');
    }

    private onResetPasswordPressed() {
        this.props.navigation.navigate('ResetPassword');
    }
}

export default connect(null, {
    onGlobalToast,
    apiAccountLogin,
    apiAccountSmsCode,
    apiAccountSmsLogin,
    apiAccountSmsSignup,
})(LoginScreen);

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        marginTop: 48,
        marginBottom: 12
    },
    loginMethodTabButton: {
        minWidth: 140,
        height: 36,
        marginRight: 4,
    },
    links: {
        marginTop: 12,
        width: 300,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});