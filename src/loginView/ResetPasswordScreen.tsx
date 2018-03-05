import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { resetPasswordParams, smsCodeParams } from '../api/account-private/gen';
import { commonStyles } from '../commonStyles';
import { onGlobalToast } from '../redux';
import { apiAccountResetPassword, apiAccountSmsCode } from '../redux_login';
import ToastView from '../ToastView';

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

class ResetPasswordScreen extends React.Component<Props, State> {
    public componentWillMount() {
        this.setState({
            inputPhone: '',
            inputSmsCode: '',
            inputNewPassword: ''
        });
    }

    public render() {
        return (
            <View style={[commonStyles.screenCentered]}>
                <View style={[commonStyles.flexRowCentered, {marginTop: 80}]}>
                    <Text style={[commonStyles.text, {width: 80}]}>手机号</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[commonStyles.textInput, {width: 180}]}
                        onChangeText={(text) => {
                            this.setState({inputPhone: text});
                        }}
                        value={this.state.inputPhone}
                        placeholder={'请输入手机号'}
                    />
                </View>
                <View style={[commonStyles.flexRowCentered]}>
                    <Text style={[commonStyles.text, {width: 80}]}>验证码</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[commonStyles.textInput, {width: 60}]}
                        onChangeText={(text) => {
                            this.setState({inputSmsCode: text});
                        }}
                        value={this.state.inputSmsCode}
                    />
                    <TouchableOpacity
                        style={[commonStyles.button, {width: 120, backgroundColor: '#fff'}]}
                        onPress={() => {
                            this.onGetSmsCodePressed();
                        }}>
                        <Text style={[commonStyles.buttonColorText]}>获取验证码</Text>
                    </TouchableOpacity>
                </View>
                <View style={[commonStyles.flexRowCentered]}>
                    <Text style={[commonStyles.text, {width: 80}]}>新密码</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[commonStyles.textInput, {width: 180}]}
                        onChangeText={(text) => {
                            this.setState({inputNewPassword: text});
                        }}
                        value={this.state.inputNewPassword}
                        placeholder={'请输入新密码'}
                    />
                </View>
                <TouchableOpacity
                    style={[commonStyles.button, {width: 300}]}
                    onPress={() => {
                        this.onResetPasswordPressed();
                    }}
                >
                    <Text style={[commonStyles.buttonText]}>重置密码</Text>
                </TouchableOpacity>
                <ToastView/>
            </View>
        );
    }

    private onGetSmsCodePressed() {
        if (this.state.inputPhone === '') {
            return this.props.onGlobalToast('请输入手机号');
        }

        this.props.apiAccountSmsCode({
            scene: 'RESET_PASSWORD',
            phone: this.state.inputPhone
        });
    }

    private onResetPasswordPressed() {
        if (this.state.inputPhone === '') {
            return this.props.onGlobalToast('请输入手机号');
        }

        if (this.state.inputSmsCode === '') {
            return this.props.onGlobalToast('请输入短信验证码');
        }

        if (this.state.inputNewPassword === '') {
            return this.props.onGlobalToast('请输入新密码');
        }

        this.props.apiAccountResetPassword(
            {
                phone: this.state.inputPhone,
                smsCode: this.state.inputSmsCode,
                newPassword: this.state.inputNewPassword,
            },
            () => {
                this.props.navigation.navigate('Login');
            });
    }
}

export default connect(null, {
    onGlobalToast,
    apiAccountSmsCode,
    apiAccountResetPassword
})(ResetPasswordScreen);