import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Dispatch } from 'react-redux';
import { combineReducers } from 'redux';
import { Dispatchable, StandardAction } from './_common/action';
import TimedComponent from './_react_native_common/TimedComponent';
import {
    DefaultApiFactory as AccountApi,
    loginParams, resetPasswordParams,
    smsCodeParams,
    smsLoginParams,
    smsSignupParams
} from './api/account-private/gen/';
import {
    AuthorizationCode,
    DefaultApiFactory as OauthPrivateApi
} from './api/oauth-private/gen/';
import {
    DefaultApiFactory as UserPrivateApi,
    oauthJump_SUCCESS,
    OauthJumpResponse,
} from './api/user-private/gen';

const accountApi = AccountApi(undefined, fetch, 'http://127.0.0.1:8083/api-private/v1/accounts');
const oauthPrivateApi = OauthPrivateApi(undefined, fetch, 'http://127.0.0.1:8085/api-private/v1/oauth');
const userPrivateApi = UserPrivateApi(undefined, fetch, 'http://127.0.0.1:8086/api-private/v1/users');

export interface ToastInfo {
    text: string;
    timestamp: Date;
}

const GLOBAL_TOAST_ACTION = 'GLOBAL_TOAST_ACTION';

export interface RootState {
    globalToast: ToastInfo;
    oauthJumpResponse: OauthJumpResponse;
}

export function onGlobalToast(text: string): Dispatchable {
    return (dispatch: Dispatch<StandardAction>) => {
        dispatch({
            type: GLOBAL_TOAST_ACTION,
            payload: {
                text,
                timestamp: new Date()
            }
        });
    };
}

export function renderToast(text: string, timestamp: Date): JSX.Element {
    return (
        <View style={{
            position: 'absolute',
            top: Dimensions.get('window').height * 0.8,
        }}>
            <TimedComponent
                timestamp={timestamp}
                contentElement={
                    <Text style={{fontSize: 16}}>
                        {text}
                    </Text>
                }
                intervalMillSec={1000}
            />
        </View>
    );
}

function onApiError(err: any): Dispatchable {
    return (dispatch: Dispatch<StandardAction>) => {
        const text = err.toString() === 'TypeError: Network request failed'
            ? '网络连接失败' : err.message;
        dispatch(onGlobalToast(text));
    };
}

function  onAccountLoginSuccess(jwt: string): Dispatchable {
    return (dispatch: Dispatch<StandardAction>) => {
        return userPrivateApi.oauthState('fromApp')
            .then((state: string) => {
                return oauthPrivateApi.authorize(jwt, 'code', '100002', 'fromApp', 'BASIC', state)
                    .then((authorizationCode: AuthorizationCode) => {
                        if (authorizationCode.code === undefined) {
                            return dispatch(onApiError('code is null'));
                        }
                        userPrivateApi.oauthJump('fromApp', authorizationCode.code, state)
                            .then((oauthJumpResponseData: OauthJumpResponse) => {
                                dispatch({type: oauthJump_SUCCESS, payload: oauthJumpResponseData});
                                dispatch(onGlobalToast('登录成功'));
                            }).catch((err) => {
                            dispatch(onApiError(err));
                        });
                    }).catch((err) => {
                        dispatch(onApiError(err));
                    });
            }).catch((err) => {
                dispatch(onApiError(err));
            });
    };
}

export function apiAccountSmsCode(p: smsCodeParams): Dispatchable {
    return (dispatch: Dispatch<StandardAction>) => {
        return accountApi.smsCode(p.scene, p.phone, p.captchaId, p.captchaCode)
            .then(() => {
                dispatch(onGlobalToast('已发送'));
            }).catch((err) => {
                dispatch(onApiError(err));
            });
    };
}

export function apiAccountSmsLogin(p: smsLoginParams): Dispatchable {
    return (dispatch: Dispatch<StandardAction>) => {
        return accountApi.smsLogin(p.phone, p.smsCode)
            .then((jwt: string) => {
                dispatch(onAccountLoginSuccess(jwt));
            }).catch((err) => {
                dispatch(onApiError(err));
            });
    };
}

export function apiAccountLogin(p: loginParams): Dispatchable {
    return (dispatch: Dispatch<StandardAction>) => {
        return accountApi.login(p.name, p.password)
            .then((jwt: string) => {
                dispatch(onAccountLoginSuccess(jwt));
            }).catch((err) => {
                dispatch(onApiError(err));
            });
    };
}

export function apiAccountSmsSignup(p: smsSignupParams): Dispatchable {
    return (dispatch: Dispatch<StandardAction>) => {
        return accountApi.smsSignup(p.phone, p.smsCode, p.password)
            .then((jwt: string) => {
                dispatch(onAccountLoginSuccess(jwt));
            })
            .catch((err) => {
                dispatch(onApiError(err));
            });
    };
}

export function apiAccountResetPassword(p: resetPasswordParams, navigation: NavigationScreenProps<any>): Dispatchable {
    return (dispatch: Dispatch<StandardAction>) => {
        return accountApi.resetPassword(p.phone, p.smsCode, p.newPassword)
            .then(() => {
                dispatch(onGlobalToast('密码重置成功'));
                navigation.navigation.navigate('Login');
            }).catch((err) => {
                dispatch(onApiError(err));
            });
    };
}

function globalToast(state: ToastInfo, action: StandardAction): ToastInfo {
    if (state === undefined) {
        return {text: '', timestamp: new Date()};
    }

    switch (action.type) {
        case GLOBAL_TOAST_ACTION:
            return action.payload;
        default:
            return state;
    }
}

function oauthJumpResponse(state: OauthJumpResponse, action: StandardAction): OauthJumpResponse {
    if (state === undefined) {
        return {};
    }

    switch (action.type) {
        case oauthJump_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    globalToast,
    oauthJumpResponse
});