import * as React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { loginParams, smsCodeParams, smsLoginParams, smsSignupParams } from '../api/account-private/gen';
import { commonStyles } from '../commonStyles';
import { onGlobalToast } from '../redux';
import { apiAccountLogin, apiAccountSmsCode, apiAccountSmsLogin, apiAccountSmsSignup } from '../redux_login';
import ToastView from '../ToastView';

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

class LoginScreen extends React.Component<Props, State> {
    public render() {
        return <View style={[commonStyles.screenCentered]}>
            <Text style={[commonStyles.text, {fontSize: 32, marginTop: 48, marginBottom: 12}]}>登录火星</Text>
            {this.renderTabHeader()}
            <View style={[commonStyles.line, {width: 300}]}/>
            {this.state.tabIndex === 0 ? this.renderAccountLogin() : null}
            {this.state.tabIndex === 1 ? this.renderSmsLogin() : null}
            <TouchableOpacity
                style={[commonStyles.button, {width: 300, marginTop: 8}]}
                onPress={() => {
                    this.onLoginPressed();
                }}>
                <Text style={[commonStyles.buttonText]}>登录</Text>
            </TouchableOpacity>
            <View style={{marginTop: 12, width: 300, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                    style={[commonStyles.text, {fontSize: 14}]}
                    onPress={() => {
                        this.onResetPasswordPressed();
                    }}>
                    &nbsp;&nbsp;&nbsp;&nbsp;忘记密码？
                </Text>
                <Text
                    style={[commonStyles.text, {fontSize: 14}]}
                    onPress={() => {
                        this.onSignupPressed();
                    }}>
                    新用户注册&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
            </View>
            <ToastView/>
        </View>;
    }

    public componentWillMount() {
        this.setState({
            tabIndex: 0,
            loginName: '',
            loginPassword: '',
            loginPhone: '',
            loginSmsCode: '',
        });
    }

    private renderTabHeader() {
        return (
            <View style={[commonStyles.flexRowCentered]}>
                <TouchableOpacity
                    style={[
                        commonStyles.button,
                        styles.loginMethodTabButton,
                        this.state.tabIndex === 0 ? {backgroundColor: '#eee'} : {backgroundColor: '#fff'}
                    ]}
                    onPress={() => {
                        this.setState({tabIndex: 0});
                    }}>
                    <Text style={[commonStyles.text]}>帐号密码登录</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        commonStyles.button,
                        styles.loginMethodTabButton,
                        this.state.tabIndex === 1 ? {backgroundColor: '#eee'} : {backgroundColor: '#fff'}
                    ]}
                    onPress={() => {
                        this.setState({tabIndex: 1});
                    }}>
                    <Text style={[commonStyles.text]}>短信验证码登录</Text>
                </TouchableOpacity>
            </View>
        );
    }

    private renderAccountLogin() {
        return (
            <View style={[commonStyles.flexColumnCentered]}>
                <View style={[commonStyles.flexRowCentered]}>
                    <Text style={[commonStyles.text, {width: 60}]}>帐号</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[commonStyles.textInput, {width: 200}]}
                        onChangeText={(text) => {
                            this.setState({loginName: text});
                        }}
                        value={this.state.loginName}
                        placeholder={'请输入手机号码'}
                    />
                </View>
                <View style={[commonStyles.flexRowCentered]}>
                    <Text style={[commonStyles.text, {width: 60}]}>密码</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[commonStyles.textInput, {width: 200}]}
                        onChangeText={(text) => {
                            this.setState({loginPassword: text});
                        }}
                        value={this.state.loginPassword}
                        placeholder={'请输入密码'}
                    />
                </View>
            </View>
        );
    }

    private renderSmsLogin() {
        return (
            <View style={[commonStyles.flexColumnCentered]}>
                <View style={[commonStyles.flexRowCentered]}>
                    <Text style={[commonStyles.text, {width: 80}]}>手机号</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[commonStyles.textInput, {width: 220}]}
                        onChangeText={(text) => {
                            this.setState({loginPhone: text});
                        }}
                        value={this.state.loginPhone}
                        placeholder={'请输入手机号码'}
                    />
                </View>
                <View style={[commonStyles.flexRowCentered]}>
                    <Text style={[commonStyles.text, {width: 80}]}>验证码</Text>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        style={[commonStyles.textInput, {width: 60}]}
                        onChangeText={(text) => {
                            this.setState({loginSmsCode: text});
                        }}
                        value={this.state.loginSmsCode}
                    />
                    <TouchableOpacity
                        style={[commonStyles.button, {width: 160, backgroundColor: '#fff'}]}
                        onPress={() => {
                            this.onGetSmsCodePressed();
                        }}
                    >
                        <Text style={[commonStyles.buttonColorText]}>获取验证码</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    private onGetSmsCodePressed(): any {
        if (this.state.loginPhone === '') {
            return this.props.onGlobalToast('请输入手机号');
        }

        this.props.apiAccountSmsCode({
            scene: 'SMS_LOGIN',
            phone: this.state.loginPhone
        });
    }

    private onLoginPressed(): any {
        if (this.state.tabIndex === 0) {
            if (this.state.loginName === '') {
                return this.props.onGlobalToast('请输入帐号');
            }

            if (this.state.loginPassword === '') {
                return this.props.onGlobalToast('请输入密码');
            }

            this.props.apiAccountLogin(
                {
                    name: this.state.loginName,
                    password: this.state.loginPassword
                });
        } else {
            if (this.state.loginPhone === '') {
                return this.props.onGlobalToast('请输入手机号');
            }

            if (this.state.loginSmsCode === '') {
                return this.props.onGlobalToast('请输入验证码');
            }

            this.props.apiAccountSmsLogin(
                {
                    phone: this.state.loginPhone,
                    smsCode: this.state.loginSmsCode
                });
        }
    }

    private onSignupPressed(): any {
        this.props.navigation.navigate('Signup');
    }

    private onResetPasswordPressed(): any {
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
    loginMethodTabButton: {
        minWidth: 140,
        height: 36,
        marginRight: 4,
    }
});