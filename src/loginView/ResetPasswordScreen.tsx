import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { resetPasswordParams, smsCodeParams } from '../api/account-private/gen';
import { commonStyles } from '../commonStyles';
import { apiAccountResetPassword, apiAccountSmsCode } from '../redux_login';
import ToastView, { onGlobalToast } from '../ToastView';

export interface Props extends NavigationScreenProps<any> {
    onGlobalToast: (text: string) => Dispatchable;
    apiAccountSmsCode: (p: smsCodeParams) => Dispatchable;
    apiAccountResetPassword: (p: resetPasswordParams, onSuccess: () => void) => Dispatchable;
}

interface State {
    inputPhone: string;
    inputSmsCode: string;
    inputNewPassword: string;
}
const initialState = {
    inputPhone: '',
    inputSmsCode: '',
    inputNewPassword: ''
};

class ResetPasswordScreen extends React.Component<Props, State> {
    public componentWillMount() {
        this.onPhoneChanged = this.onPhoneChanged.bind(this);
        this.onSmsCodeChanged = this.onSmsCodeChanged.bind(this);
        this.onGetSmsCodePressed = this.onGetSmsCodePressed.bind(this);
        this.onPasswordChanged = this.onPasswordChanged.bind(this);
        this.onResetPasswordPressed = this.onResetPasswordPressed.bind(this);
        this.onResetSuccess = this.onResetSuccess.bind(this);

        this.setState(initialState);
    }

    public render() {
        return (
            <View style={[commonStyles.screenCentered]}>
                {this.renderPhone()}
                {this.renderSmsCode()}
                {this.renderPassword()}
                {this.renderResetButton()}
                <ToastView/>
            </View>
        );
    }

    private renderPhone(): JSX.Element {
        return (
            <View style={[commonStyles.flexRowCentered, {marginTop: 80}]}>
                <Text style={[commonStyles.text, {width: 80}]}>手机号</Text>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    style={[commonStyles.textInput, {width: 180}]}
                    onChangeText={this.onPhoneChanged}
                    value={this.state.inputPhone}
                    placeholder={'请输入手机号'}/>
            </View>
        );
    }

    private renderSmsCode(): JSX.Element {
        return (
            <View style={[commonStyles.flexRowCentered]}>
                <Text style={[commonStyles.text, {width: 80}]}>验证码</Text>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    style={[commonStyles.textInput, {width: 60}]}
                    onChangeText={this.onSmsCodeChanged}
                    value={this.state.inputSmsCode}/>
                <TouchableOpacity
                    style={[commonStyles.button, {width: 120, backgroundColor: '#fff'}]}
                    onPress={this.onGetSmsCodePressed}>
                    <Text style={[commonStyles.buttonColorText]}>获取验证码</Text>
                </TouchableOpacity>
            </View>
        );
    }

    private renderPassword(): JSX.Element {
        return (
            <View style={[commonStyles.flexRowCentered]}>
                <Text style={[commonStyles.text, {width: 80}]}>新密码</Text>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    style={[commonStyles.textInput, {width: 180}]}
                    onChangeText={this.onPasswordChanged}
                    value={this.state.inputNewPassword}
                    placeholder={'请输入新密码'}/>
            </View>
        );
    }

    private renderResetButton(): JSX.Element {
        return (
            <TouchableOpacity
                style={[commonStyles.windowButton, {marginTop: 8}]}
                onPress={this.onResetPasswordPressed}>
                <Text style={[commonStyles.buttonText]}>重置密码</Text>
            </TouchableOpacity>
        );
    }

    private onPhoneChanged(text: string) {
        this.setState({inputPhone: text});
    }

    private onSmsCodeChanged(text: string) {
        this.setState({inputSmsCode: text});
    }

    private onPasswordChanged(text: string) {
        this.setState({inputNewPassword: text});
    }

    private onGetSmsCodePressed() {
        const phone = this.state.inputPhone;
        if (phone === '') {
            return this.props.onGlobalToast('请输入手机号');
        }

        this.props.apiAccountSmsCode({scene: 'RESET_PASSWORD', phone});
    }

    private onResetSuccess() {
        this.props.navigation.goBack();
    }

    private onResetPasswordPressed() {
        const {inputPhone, inputSmsCode, inputNewPassword} = this.state;

        if (inputPhone === '') {
            return this.props.onGlobalToast('请输入手机号');
        }

        if (inputSmsCode === '') {
            return this.props.onGlobalToast('请输入短信验证码');
        }

        if (inputNewPassword === '') {
            return this.props.onGlobalToast('请输入新密码');
        }

        this.props.apiAccountResetPassword(
            {
                phone: inputPhone,
                smsCode: inputSmsCode,
                newPassword: inputNewPassword,
            },
            this.onResetSuccess);
    }
}

export default connect(null, {
    onGlobalToast,
    apiAccountSmsCode,
    apiAccountResetPassword
})(ResetPasswordScreen);