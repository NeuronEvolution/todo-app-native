import * as React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Dispatch } from 'react-redux';
import { combineReducers } from 'redux';
import { Dispatchable, StandardAction } from './_common/action';
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
    addTodoParams,
    DefaultApiFactory as TodoPrivateApi, getTodoListParams, TodoItem, TodoItemGroup,
} from './api/todo-private/gen';
import {
    DefaultApiFactory as UserPrivateApi,
    OauthJumpResponse,
} from './api/user-private/gen';
import {TodoScreenStack} from './mainView/TodoScreenStack';

let tokenString = '';

const accountApi = AccountApi(undefined, fetch, 'http://127.0.0.1:8083/api-private/v1/accounts');
const oauthPrivateApi = OauthPrivateApi(undefined, fetch, 'http://127.0.0.1:8085/api-private/v1/oauth');
const userPrivateApi = UserPrivateApi(undefined, fetch, 'http://127.0.0.1:8086/api-private/v1/users');
const todoPrivateApi = TodoPrivateApi(
    {
        apiKey: () => tokenString
    },
    fetch, 'http://127.0.0.1:9001/api-private/v1/todo');

export interface ToastInfo {
    text: string;
    timestamp: Date;
}

const GLOBAL_TOAST_ACTION = 'GLOBAL_TOAST_ACTION';

export interface RootState {
    globalToast: ToastInfo;
    oauthJumpResponse: OauthJumpResponse;
    todoListByCategory: TodoItemGroup[];
    otherTodoListByCategory: Map<string, TodoItemGroup[]>;
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

function onApiError(err: any): Dispatchable {
    return (dispatch: Dispatch<StandardAction>) => {
        const text = err.toString() === 'TypeError: Network request failed'
            ? '网络连接失败' : err.message;
        dispatch(onGlobalToast(text));
    };
}

const ACTION_OAUTH_JUMP_SUCCESS = 'ACTION_OAUTH_JUMP_SUCCESS';

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
                                tokenString = oauthJumpResponseData.token ? oauthJumpResponseData.token : '';
                                dispatch(onGlobalToast('登录成功'));
                                dispatch({type: ACTION_OAUTH_JUMP_SUCCESS, payload: oauthJumpResponseData});
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
                dispatch(onGlobalToast('已发送,验证码1234'));
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

const ACTION_TODO_LIST_BY_CATEGORY = 'ACTION_TODO_LIST_BY_CATEGORY';
const ACTION_TODO_LIST_OTHERS_BY_CATEGORY = 'ACTION_TODO_LIST_OTHERS_BY_CATEGORY';

export function apiTodoGetTodoListByCategory(p: getTodoListParams): Dispatchable {
    return (dispatch: Dispatch<StandardAction>) => {
        return todoPrivateApi.getTodoListByCategory(p.otherUserId)
            .then((result: TodoItemGroup[]) => {
                if (p.otherUserId === undefined) {
                    dispatch({type: ACTION_TODO_LIST_BY_CATEGORY, payload: result});
                } else {
                    dispatch({type: ACTION_TODO_LIST_OTHERS_BY_CATEGORY, payload: result});
                }
            }).catch((err) => {
                dispatch(onApiError(err));
            });
    };
}

export function apiTodoAddTodo(p: TodoItem, navigation: NavigationScreenProps<any>): Dispatchable {
    return (dispatch: Dispatch<StandardAction>) => {
        return todoPrivateApi.addTodo(p)
            .then(() => {
                navigation.navigation.navigate('Todo');
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
        case ACTION_OAUTH_JUMP_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

function todoListByCategory(state: TodoItemGroup[], action: StandardAction): TodoItemGroup[] {
    if (state === undefined) {
        return [];
    }

    switch (action.type) {
        case ACTION_TODO_LIST_BY_CATEGORY:
            return action.payload;
        default:
            return state;
    }
}

function otherTodoListByCategory(state: Map<string, TodoItemGroup[]>, action: StandardAction)
: Map<string, TodoItemGroup[]> {
    if (state === undefined) {
        return new Map<string, TodoItemGroup[]>();
    }

    switch (action.type) {
        case ACTION_TODO_LIST_OTHERS_BY_CATEGORY:
            const newMap = new Map<string, TodoItemGroup[]>();
            state.forEach((value: TodoItemGroup[], key: string) => {
                newMap.set(key, value);
            });
            newMap.set(action.payload[0].UserId, action.payload);
            return newMap;
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    globalToast,
    oauthJumpResponse,
    todoListByCategory,
    otherTodoListByCategory
});