import * as React from 'react';
import { Button, Dimensions, Text, TextInput, View } from 'react-native';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { loginParams, smsCodeParams, smsLoginParams, smsSignupParams } from '../api/account-private/gen';
import {
    apiAccountLogin, apiAccountSmsCode, apiAccountSmsLogin, apiAccountSmsSignup, onGlobalToast,
    RootState
} from '../redux';

export interface Props {
    rootState: RootState;

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

class LoginView extends React.Component<Props, State> {
    public render() {
        return <View style={{
            flexDirection: 'column',
            backgroundColor: '#fff',
            maxWidth: 300,
        }}>
            <Text style={{
                textAlign: 'center',
                fontSize: 32,
                marginBottom: 32,
            }}>登录火星家园</Text>
            {this.renderTabHeader()}
            <View style={{
                width: Dimensions.get('window').width,
                maxWidth: 300,
                height: 2,
                backgroundColor: '#EEE',
            }}/>
            {this.state.tabIndex === 0 ? this.renderAccountLogin() : null}
            {this.state.tabIndex === 1 ? this.renderSmsLogin() : null}
            <View style={{backgroundColor: 'gold', height: 48, justifyContent: 'center'}}>
                <Button
                    title={'登录'}
                    onPress={() => {
                        this.onLoginPressed();
                    }}
                />
            </View>
            <View style={{
                marginTop: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}>
                <Text>忘记密码？</Text>
                <Text>新注册用户</Text>
            </View>
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
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
            }}>
                <View style={{
                    minWidth: 140,
                }}>
                    <Button
                        title={'帐号密码登录'}
                        onPress={() => {
                            this.setState({tabIndex: 0});
                        }}
                    />
                </View>
                <View style={{
                    minWidth: 140,
                }}>
                    <Button
                        title={'短信验证码登录'}
                        onPress={() => {
                            this.setState({tabIndex: 1});
                        }}
                    />
                </View>
            </View>
        );
    }

    private renderAccountLogin() {
        return (
            <View style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{fontSize: 20, width: 60}}>帐号</Text>
                    <TextInput
                        style={{
                            width: 200,
                            fontSize: 20,
                            height: 48,
                        }}
                        onChangeText={(text) => {
                            this.setState({loginName: text});
                        }}
                        value={this.state.loginName}
                        placeholder={'请输入手机号码'}
                    />
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{fontSize: 20, width: 60}}>密码</Text>
                    <TextInput
                        style={{
                            width: 200,
                            fontSize: 20,
                            height: 48,
                        }}
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
            <View style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Text style={{fontSize: 20, width: 72}}>手机号</Text>
                    <TextInput
                        style={{
                            width: 180,
                            fontSize: 20,
                            height: 48,
                        }}
                        onChangeText={(text) => {
                            this.setState({loginPhone: text});
                        }}
                        value={this.state.loginPhone}
                        placeholder={'请输入手机号'}
                    />
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Text style={{fontSize: 20, width: 72}}>验证码</Text>
                    <TextInput
                        style={{
                            width: 60,
                            fontSize: 20,
                            height: 48,
                        }}
                        onChangeText={(text) => {
                            this.setState({loginSmsCode: text});
                        }}
                        value={this.state.loginSmsCode}
                    />
                    <View style={{width: 120}}>
                        <Button
                            title={'获取验证码'}
                            onPress={() => {
                                this.onSmsLoginGetSmsCodePressed();
                            }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    private onSmsLoginGetSmsCodePressed(): any {
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

            this.props.apiAccountLogin({
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

            this.props.apiAccountSmsLogin({
                phone: this.state.loginPhone,
                smsCode: this.state.loginSmsCode
            });
        }
    }
}

export default connect((state: RootState) => ({rootState: state}), {
    onGlobalToast,
    apiAccountLogin,
    apiAccountSmsCode,
    apiAccountSmsLogin,
    apiAccountSmsSignup,
})(LoginView);