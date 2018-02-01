import * as React from 'react';
import { Button, Dimensions, Text, TextInput, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { resetPasswordParams, smsCodeParams } from '../api/account-private/gen';
import { apiAccountResetPassword, apiAccountSmsCode, onGlobalToast, renderToast, RootState } from '../redux';

export interface Props extends NavigationScreenProps<any> {
    rootState: RootState;
    onGlobalToast: (text: string) => Dispatchable;
    apiAccountSmsCode: (p: smsCodeParams) => Dispatchable;
    apiAccountResetPassword: (p: resetPasswordParams, navigation: NavigationScreenProps<any>) => Dispatchable;
}

interface State {
    inputPhone: string;
    inputSmsCode: string;
    inputNewPassword: string;
}

class ResetPasswordView extends React.Component<Props, State> {
    public static navigationOptions = {
        title: '找回密码'
    };

    public componentWillMount() {
        this.setState({
            inputPhone: '',
            inputSmsCode: '',
            inputNewPassword: ''
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
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 80
                }}>
                    <Text style={{fontSize: 20, width: 72}}>手机号</Text>
                    <TextInput
                        style={{
                            width: 180,
                            fontSize: 20,
                            height: 48,
                        }}
                        onChangeText={(text) => {
                            this.setState({inputPhone: text});
                        }}
                        value={this.state.inputPhone}
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
                            this.setState({inputSmsCode: text});
                        }}
                        value={this.state.inputSmsCode}
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
                            this.setState({inputNewPassword: text});
                        }}
                        value={this.state.inputNewPassword}
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
                        title={'重置密码'}
                        onPress={() => {
                            this.onResetPasswordPressed();
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
                newPassword: this.state.inputNewPassword
            },
            this.props);
    }
}

export default connect((rootState: RootState) => ({rootState}), {
    onGlobalToast,
    apiAccountSmsCode,
    apiAccountResetPassword
})(ResetPasswordView);