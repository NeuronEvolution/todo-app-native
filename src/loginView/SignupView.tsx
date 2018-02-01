import * as React from 'react';
import { Button, Dimensions, Text, TextInput, View } from 'react-native';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { smsCodeParams, smsSignupParams } from '../api/account-private/gen';
import {
    apiAccountSmsCode, apiAccountSmsSignup, onGlobalToast, renderToast,
    RootState
} from '../redux';

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

class SignupView extends React.Component<Props, State> {
    public static navigationOptions = {
        title: '注册'
    };

    public componentWillMount() {
        this.setState({
            signupPhone: '',
            signupSmsCode: '',
            signupPassword: '',
        });
    }

    public render() {
        return (
            <View style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                backgroundColor: '#FFF',
                alignItems: 'center',
                flexDirection: 'column',
            }}>
                <Text style={{
                    textAlign: 'center',
                    fontSize: 32,
                    marginTop: 80,
                    marginBottom: 32,
                }}>注册火星帐号</Text>
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
                            this.setState({signupPhone: text});
                        }}
                        value={this.state.signupPhone}
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
                            this.setState({signupSmsCode: text});
                        }}
                        value={this.state.signupSmsCode}
                    />
                    <View style={{width: 120}}>
                        <Button
                            title={'获取验证码'}
                            onPress={() => {
                                this.onGetSmsCodePressed();
                            }}
                        />
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Text style={{fontSize: 20, width: 72}}>密码</Text>
                    <TextInput
                        style={{
                            width: 180,
                            fontSize: 20,
                            height: 48,
                        }}
                        onChangeText={(text) => {
                            this.setState({signupPassword: text});
                        }}
                        value={this.state.signupPassword}
                        placeholder={'请输入登录密码'}
                    />
                </View>
                <View style={{
                    backgroundColor: 'gold',
                    height: 48,
                    justifyContent: 'center',
                    width: Dimensions.get('window').width
                }}>
                    <Button
                        title={'注册并登录'}
                        onPress={() => {
                            this.onSignupPressed();
                        }}
                    />
                </View>
                {renderToast(
                    this.props.rootState.globalToast.text,
                    this.props.rootState.globalToast.timestamp)}
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
})(SignupView);