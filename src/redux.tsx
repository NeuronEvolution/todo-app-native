import * as React from 'react';
import { combineReducers } from 'redux';
import { Dispatchable, StandardAction } from './_common/action';
import * as actions from './actions';
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
    DefaultApiFactory as TodoPrivateApi, FriendInfo,
    getFriendsListParams, getTodoListParams, TodoItem, TodoItemGroup,
    UserProfile
} from './api/todo-private/gen';
import {
    DefaultApiFactory as UserPrivateApi,
    OauthJumpResponse,
} from './api/user-private/gen';

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
    userProfile: UserProfile;
    todoListByCategory: TodoItemGroup[];
    friendsList: FriendsListWithPage;
    friendTodoListByCategory: TodoItemGroup[];
}

export interface FriendsListWithPage {
    pageToken: string;
    items: FriendInfo[];
    nextPageToken: string;
}

export const onGlobalToast = (text: string): Dispatchable => (dispatch) => {
    dispatch({
        type: GLOBAL_TOAST_ACTION,
        payload: {
            text,
            timestamp: new Date()
        }
    });
};

const onApiError = (apiName: string, err: any): Dispatchable => (dispatch) => {
    console.info('onApiError', apiName, err);
    const text = err.toString() === 'TypeError: Network request failed'
        ? '网络连接失败' : err.message;
    dispatch(onGlobalToast(text));
};

const  onAccountLoginSuccess = (jwt: string): Dispatchable => (dispatch) => {
    return userPrivateApi.oauthState('fromApp')
        .then((state: string) => {
            return oauthPrivateApi.authorize(jwt, 'code', '100002', 'fromApp', 'BASIC', state)
                .then((authorizationCode: AuthorizationCode) => {
                    if (authorizationCode.code === undefined) {
                        return dispatch(onApiError('oauthPrivateApi.authorize', 'code is null'));
                    }
                    return userPrivateApi.oauthJump('fromApp', authorizationCode.code, state)
                        .then((oauthJumpResponseData: OauthJumpResponse) => {
                            tokenString = oauthJumpResponseData.token ? oauthJumpResponseData.token : '';
                            dispatch(onGlobalToast('登录成功'));
                            dispatch({type: actions.ACTION_OAUTH_JUMP_SUCCESS, payload: oauthJumpResponseData});
                            dispatch(apiTodoGetUserProfile());
                        }).catch((err) => {
                            dispatch(onApiError('userPrivateApi.oauthJump', err));
                        });
                }).catch((err) => {
                    dispatch(onApiError('oauthPrivateApi.authorize', err));
                });
        }).catch((err) => {
            dispatch(onApiError('userPrivateApi.oauthState', err));
        });
};

export const apiAccountSmsCode = (p: smsCodeParams): Dispatchable => (dispatch) => {
    return accountApi.smsCode(p.scene, p.phone, p.captchaId, p.captchaCode)
        .then(() => {
            dispatch(onGlobalToast('已发送,验证码1234'));
        }).catch((err) => {
            dispatch(onApiError('accountApi.smsCode', err));
        });
};

export const apiAccountSmsLogin = (p: smsLoginParams): Dispatchable => (dispatch) => {
    return accountApi.smsLogin(p.phone, p.smsCode)
        .then((jwt: string) => {
            dispatch(onAccountLoginSuccess(jwt));
        }).catch((err) => {
            dispatch(onApiError('accountApi.smsLogin', err));
        });
};

export const apiAccountLogin = (p: loginParams): Dispatchable => (dispatch) => {
    return accountApi.login(p.name, p.password)
        .then((jwt: string) => {
            dispatch(onAccountLoginSuccess(jwt));
        }).catch((err) => {
            dispatch(onApiError('accountApi.login', err));
        });
};

export const apiAccountSmsSignup = (p: smsSignupParams): Dispatchable => (dispatch) => {
    return accountApi.smsSignup(p.phone, p.smsCode, p.password)
        .then((jwt: string) => {
            dispatch(onAccountLoginSuccess(jwt));
        })
        .catch((err) => {
            dispatch(onApiError('accountApi.smsSignup', err));
        });
};

export const apiAccountResetPassword = (p: resetPasswordParams, onSuccess: () => void): Dispatchable => (dispatch) => {
    return accountApi.resetPassword(p.phone, p.smsCode, p.newPassword)
        .then(() => {
            dispatch(onGlobalToast('密码重置成功'));
            onSuccess();
        }).catch((err) => {
            dispatch(onApiError('accountApi.resetPassword', err));
        });
};

export const apiTodoGetUserProfile = (): Dispatchable => (dispatch) => {
    return todoPrivateApi.getUserProfile().then((data) => {
        dispatch({type: actions.ACTION_TODO_GET_USER_PROFILE_SUCCESS, payload: data});
    }).catch((err) => {
        dispatch(onApiError('todoPrivateApi.getUserProfile', err));
    });
};

export const apiTodoGetTodoListByCategory = (p: getTodoListParams): Dispatchable => (dispatch) => {
    return todoPrivateApi.getTodoListByCategory(p.friendID)
        .then((result: TodoItemGroup[]) => {
            if (p.friendID) {
                dispatch({type: actions.ACTION_TODO_LIST_BY_CATEGORY_FRIEND_SUCCESS, payload: result});
            } else {
                dispatch({type: actions.ACTION_TODO_LIST_BY_CATEGORY_SUCCESS, payload: result});
            }
        }).catch((err) => {
            dispatch(onApiError('todoPrivateApi.getTodoListByCategory', err));
        });
};

export const apiTodoAddTodo = (p: TodoItem, onSuccess: () => void): Dispatchable => (dispatch) => {
    return todoPrivateApi.addTodo(p)
        .then(() => {
            dispatch(onGlobalToast('已添加'));
            onSuccess();
        }).catch((err) => {
            dispatch(onApiError('todoPrivateApi.addTodo', err));
        });
};

export const apiTodoRemove = (todoId: string): Dispatchable => (dispatch) => {
    return todoPrivateApi.removeTodo(todoId)
        .then(() => {
            dispatch(onGlobalToast('已删除'));
            dispatch(apiTodoGetTodoListByCategory({})); // refresh
        }).catch((err) => {
            dispatch(onApiError('todoPrivateApi.removeTodo', err));
        });
};

export const apiTodoUpdate = (todoId: string,
                              todoItem: TodoItem,
                              onSuccess: () => void): Dispatchable => (dispatch) => {
    return todoPrivateApi.updateTodo(todoId, todoItem)
        .then(() => {
            dispatch(onGlobalToast('已更新'));
            onSuccess();
        })
        .catch((err) => {
            dispatch(onApiError('todoPrivateApi.updateTodo', err));
        });
};

export const apiTodoGetFriendsList = (p: getFriendsListParams): Dispatchable => (dispatch) => {
    return todoPrivateApi.getFriendsList(p.pageSize, p.pageToken)
        .then((data) => {
            dispatch({
                type: actions.ACTION_TODO_GET_FRIEND_LIST_SUCCESS,
                payload: {
                    pageToken: p.pageToken,
                    data
                }
            });
        }).catch((err) => {
            dispatch(onApiError('todoPrivateApi.getFriendsList', err));
        });
};

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

function oauthJumpResponse(state: OauthJumpResponse= {}, action: StandardAction): OauthJumpResponse {
    switch (action.type) {
        case actions.ACTION_OAUTH_JUMP_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

function userProfile(state: UserProfile= {}, action: StandardAction): UserProfile {
    switch (action.type) {
        case actions.ACTION_TODO_GET_USER_PROFILE_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

function todoListByCategory(state: TodoItemGroup[]= [], action: StandardAction): TodoItemGroup[] {
    switch (action.type) {
        case actions.ACTION_TODO_LIST_BY_CATEGORY_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

function friendTodoListByCategory(state: TodoItemGroup[]= [], action: StandardAction): TodoItemGroup[] {
    switch (action.type) {
        case actions.ACTION_TODO_LIST_BY_CATEGORY_FRIEND_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

function friendsList(state: FriendsListWithPage, action: StandardAction): FriendsListWithPage {
    if (state === undefined) {
        return {pageToken: '', items: [], nextPageToken: ''};
    }

    switch (action.type) {
        case actions.ACTION_TODO_GET_FRIEND_LIST_SUCCESS:
            const oldItems = state.items;
            state = {
                pageToken: action.payload.pageToken,
                nextPageToken: action.payload.data.nextPageToken,
                items: []
            };

            action.payload.pageToken && action.payload.pageToken !== ''
                ? state.items = [...oldItems, ...action.payload.data.items]
                : state.items = action.payload.data.items;

            return state;
        default:
            return state;
    }
}

export const rootReducer = combineReducers<RootState>({
    globalToast,
    oauthJumpResponse,
    userProfile,
    todoListByCategory,
    friendsList,
    friendTodoListByCategory
});