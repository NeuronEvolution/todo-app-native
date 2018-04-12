import * as React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { checkPhone } from '../_common/common';
import { countdown } from '../_common/countdown';
import { fastClick } from '../_common/fastClick';
import { sendLoginSmsCodeParams, smsLoginParams } from '../api/account/gen';
import { commonStyles } from '../commonStyles';
import {
    apiAccountSendLoginSmsCode, apiAccountSmsLogin, MAX_LOGIN_NAME_LENGTH,
    MAX_PASSWORD_LENGTH,
    MAX_PHONE_LENGTH, MAX_SMS_CODE_LENGTH
} from '../redux_login';
import ToastView, { onGlobalToast, TOAST_SLOW } from '../ToastView';

export interface Props extends NavigationScreenProps<void> {
    onGlobalToast: (text: string, intervalMsec: number) => Dispatchable;
    apiAccountSendLoginSmsCode: (p: sendLoginSmsCodeParams) => Dispatchable;
    apiAccountSmsLogin: (p: smsLoginParams) => Dispatchable;
}

interface State {
    tabIndex: number;
    loginName: string;
    loginPassword: string;
    loginPhone: string;
    loginSmsCode: string;
    smsCodeCountdown: number;
}

const initialState = {
    tabIndex: 0,
    loginName: '',
    loginPassword: '',
    loginPhone: '',
    loginSmsCode: '',
    smsCodeCountdown: 0
};

class LoginScreen extends React.Component<Props, State> {
    private static renderTitle(): JSX.Element {
        return (<Text style={[styles.title]}>登录火星</Text>);
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

    private renderLoginButton() {
        return (
            <TouchableOpacity
                style={[commonStyles.button, commonStyles.contentWidth, {marginTop: 12}]}
                onPress={this.onLoginPressed}>
                <Text style={[commonStyles.buttonText]}>登录</Text>
            </TouchableOpacity>
        );
    }

    private renderLinks() {
        return (
            <View style={[styles.links]}>
                <Text
                    style={[styles.linkText]}
                    onPress={this.onResetPasswordPressed}>
                    &nbsp;&nbsp;&nbsp;&nbsp;忘记密码？
                </Text>
                <Text
                    style={[styles.linkText]}
                    onPress={this.onSignupPressed}>
                    新用户注册&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
            </View>
        );
    }

    private renderTabHeader() {
        const accountColor = this.state.tabIndex === 0 ? {backgroundColor: '#f4f4f4'} : {backgroundColor: '#fff'};
        const smsColor = this.state.tabIndex === 1 ? {backgroundColor: '#f4f4f4'} : {backgroundColor: '#fff'};

        return (
            <View style={[commonStyles.flexRowCentered]}>
                <TouchableOpacity
                    style={[commonStyles.button, styles.loginMethodTabButton, accountColor]}
                    onPress={this.onPressTabAccountLogin}>
                    <Text style={[styles.tabHeaderText]}>帐号密码登录</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[commonStyles.button, styles.loginMethodTabButton, smsColor]}
                    onPress={this.onPressTabSmsLogin}>
                    <Text style={[styles.tabHeaderText]}>短信验证码登录</Text>
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
                        maxLength={MAX_LOGIN_NAME_LENGTH}
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
                        maxLength={MAX_PASSWORD_LENGTH}
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
        const {smsCodeCountdown} = this.state;
        const disabled = smsCodeCountdown > 0;
        const color = disabled ? '#888' : '#008888';

        return (
            <View style={[commonStyles.flexColumnCentered]}>
                <View style={[commonStyles.flexRowCentered]}>
                    <Text style={[commonStyles.text, {width: 80}]}>手机号</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[commonStyles.textInput, {width: 220}]}
                        onChangeText={this.onPhoneChanged}
                        value={this.state.loginPhone}
                        placeholder={'请输入手机号码'}
                        maxLength={MAX_PHONE_LENGTH}
                    />
                </View>
                <View style={[commonStyles.flexRowCentered]}>
                    <Text style={[commonStyles.text, {width: 80}]}>验证码</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[commonStyles.textInput, {width: 60}]}
                        onChangeText={this.onSmsCodeChanged}
                        value={this.state.loginSmsCode}
                        maxLength={MAX_SMS_CODE_LENGTH}
                    />
                    <TouchableOpacity
                        disabled={disabled}
                        style={[commonStyles.button, {width: 160, backgroundColor: '#fff'}]}
                        onPress={this.onGetSmsCodePressed}>
                        <Text style={[commonStyles.text, {color}]}>
                            {disabled ? smsCodeCountdown + '秒后重新发送' : '发送短信验证码'}
                        </Text>
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
            return this.props.onGlobalToast('请输入手机号', TOAST_SLOW);
        }

        if (!checkPhone(phone)) {
            return this.props.onGlobalToast('手机号格式不正确', TOAST_SLOW);
        }

        if (fastClick()) {
            return;
        }

        const COUNT_DOWN_SECONDS = 60;
        countdown(COUNT_DOWN_SECONDS, (n: number) => {
            this.setState({smsCodeCountdown: n});
        });

        this.props.apiAccountSendLoginSmsCode({
            phone,
            captchaId: '1',
            captchaCode: '2',
        });
    }

    private onLoginPressed() {
        const {loginPhone, loginSmsCode} = this.state;
        if (loginPhone === '') {
            return this.props.onGlobalToast('请输入手机号', TOAST_SLOW);
        }
        if (loginSmsCode === '') {
            return this.props.onGlobalToast('请输入验证码', TOAST_SLOW);
        }

        if (fastClick()) {
            return;
        }
        this.props.apiAccountSmsLogin({phone: loginPhone, smsCode: loginSmsCode});
    }

    private onSignupPressed() {
        if (fastClick()) {
            return;
        }
        this.props.navigation.navigate('Signup');
    }

    private onResetPasswordPressed() {
        if (fastClick()) {
            return;
        }
        this.props.navigation.navigate('ResetPassword');
    }
}

export default connect(null, {
    onGlobalToast,
    apiAccountSmsLogin,
    apiAccountSendLoginSmsCode
})(LoginScreen);

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        marginTop: 48,
        marginBottom: 12,
        color: '#FF8800'
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
    },
    tabHeaderText: {
        fontSize: 14,
        color: '#008888'
    },
    linkText: {
        fontSize: 14,
        color: '#008888'
    }
});