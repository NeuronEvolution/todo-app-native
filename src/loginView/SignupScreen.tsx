import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { smsCodeParams, smsSignupParams } from '../api/account-private/gen';
import { commonStyles } from '../commonStyles';
import {
    apiAccountSmsCode, apiAccountSmsSignup, onGlobalToast,
    RootState
} from '../redux';
import ToastView from '../ToastView';

export interface Props {
    rootState: RootState;

    onGlobalToast: (text: string) => Dispatchable;
    apiAccountSmsSignup: (p: smsSignupParams) => Dispatchable;
    apiAccountSmsCode: (p: smsCodeParams) => Dispatchable;
}

interface State {
    signupPhone: string;
    signupSmsCode: string;
    signupPassword: string;
}

class SignupScreen extends React.Component<Props, State> {
    public componentWillMount() {
        this.setState({
            signupPhone: '',
            signupSmsCode: '',
            signupPassword: '',
        });
    }

    public render() {
        return (
            <View style={[commonStyles.screenCentered]}>
                <Text style={[commonStyles.text, {fontSize: 32, marginTop: 80, marginBottom: 32}]}>
                    注册火星帐号
                </Text>
                <View style={[commonStyles.flexRowCentered]}>
                    <Text style={[commonStyles.text, {width: 72}]}>手机号</Text>
                    <TextInput
                        style={[commonStyles.textInput, {width: 180}]}
                        onChangeText={(text) => {
                            this.setState({signupPhone: text});
                        }}
                        value={this.state.signupPhone}
                        placeholder={'请输入手机号'}
                    />
                </View>
                <View style={[commonStyles.flexRowCentered]}>
                    <Text style={[commonStyles.text, {width: 72}]}>验证码</Text>
                    <TextInput
                        style={[commonStyles.textInput, {width: 60}]}
                        onChangeText={(text) => {
                            this.setState({signupSmsCode: text});
                        }}
                        value={this.state.signupSmsCode}
                    />
                    <TouchableOpacity
                        style={[commonStyles.button, {width: 120, backgroundColor: '#fff'}]}
                        onPress={() => {
                            this.onGetSmsCodePressed();
                        }}
                    >
                        <Text style={[commonStyles.buttonText]}>
                            获取验证码
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[commonStyles.flexRowCentered]}>
                    <Text style={[commonStyles.text, {width: 72}]}>密码</Text>
                    <TextInput
                        style={[commonStyles.textInput, {width: 180}]}
                        onChangeText={(text) => {
                            this.setState({signupPassword: text});
                        }}
                        value={this.state.signupPassword}
                        placeholder={'请输入登录密码'}
                    />
                </View>
                <TouchableOpacity
                    style={[commonStyles.button, {width: 300}]}
                    onPress={() => {
                        this.onSignupPressed();
                    }}
                >
                    <Text style={[commonStyles.buttonText]}>
                        注册并登录
                    </Text>
                </TouchableOpacity>
                <ToastView/>
            </View>
        );
    }

    private onGetSmsCodePressed() {
        if (this.state.signupPhone === '') {
            return this.props.onGlobalToast('请输入手机号');
        }

        this.props.apiAccountSmsCode({
            scene: 'SMS_SIGNUP',
            phone: this.state.signupPhone
        });
    }

    private onSignupPressed() {
        if (this.state.signupPhone === '') {
            return this.props.onGlobalToast('请输入手机号');
        }

        if (this.state.signupSmsCode === '') {
            return this.props.onGlobalToast('请输入验证码');
        }

        if (this.state.signupPassword === '') {
            return this.props.onGlobalToast('请输入登录密码');
        }

        this.props.apiAccountSmsSignup({
            phone: this.state.signupPhone,
            smsCode: this.state.signupSmsCode,
            password: this.state.signupPassword
        });
    }
}

export default connect((rootState: RootState) => ({rootState}), {
    onGlobalToast,
    apiAccountSmsSignup,
    apiAccountSmsCode,
})(SignupScreen);