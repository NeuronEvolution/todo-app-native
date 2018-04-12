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
    apiAccountSendLoginSmsCode, apiAccountSmsLogin,
    MAX_PHONE_LENGTH, MAX_SMS_CODE_LENGTH
} from '../redux_login';
import ToastView, { onGlobalToast, TOAST_SLOW } from '../ToastView';

export interface Props extends NavigationScreenProps<void> {
    onGlobalToast: (text: string, intervalMsec: number) => Dispatchable;
    apiAccountSendLoginSmsCode: (p: sendLoginSmsCodeParams) => Dispatchable;
    apiAccountSmsLogin: (p: smsLoginParams) => Dispatchable;
}

interface State {
    loginPhone: string;
    loginSmsCode: string;
    smsCodeCountdown: number;
}

const initialState = {
    loginPhone: '',
    loginSmsCode: '',
    smsCodeCountdown: 0
};

class LoginScreen extends React.Component<Props, State> {
    public componentWillMount() {
        this.onLoginPressed = this.onLoginPressed.bind(this);
        this.onPhoneChanged = this.onPhoneChanged.bind(this);
        this.onSmsCodeChanged = this.onSmsCodeChanged.bind(this);
        this.onGetSmsCodePressed = this.onGetSmsCodePressed.bind(this);

        this.setState(initialState);
    }

    public render() {
        return <View style={[commonStyles.screenCentered]}>
            {this.renderSmsLogin()}
            <ToastView/>
        </View>;
    }

    private renderSmsLogin() {
        const {smsCodeCountdown} = this.state;
        const disabled = smsCodeCountdown > 0;
        const color = disabled ? '#888' : '#008888';

        return (
            <View style={[commonStyles.flexColumnCentered, {marginTop: 96}]}>
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
                <TouchableOpacity
                    style={[commonStyles.button, commonStyles.contentWidth, {marginTop: 12}]}
                    onPress={this.onLoginPressed}>
                    <Text style={[commonStyles.buttonText]}>登录火星</Text>
                </TouchableOpacity>
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
    }
});