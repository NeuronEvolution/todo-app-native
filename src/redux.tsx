import * as React from 'react';
import { combineReducers } from 'redux';
import { REDUX_STORE } from '../App';
import { Dispatchable, StandardAction } from './_common/action';
import * as actions from './actions';
import {
    DefaultApiFactory as TodoPrivateApi, FriendInfo,
    getFriendsListParams, getTodoListParams, TodoItem, TodoItemGroup,
    TodoVisibility, UserProfile
} from './api/todo-private/gen';
import { Token } from './api/user-private/gen';
import { apiCall, token, userID } from './redux_login';

const todoPrivateApi = TodoPrivateApi(
    {
        apiKey: () => {
            const t = REDUX_STORE.getState().token;
            return t && t.accessToken ? t.accessToken : '';
        }
    },
    fetch, 'http://127.0.0.1:9001/api-private/v1/todo');

export interface ToastInfo {
    text: string;
    timestamp: Date;
}

const GLOBAL_TOAST_ACTION = 'GLOBAL_TOAST_ACTION';

export interface RootState {
    userID: string;
    globalToast: ToastInfo;
    token: Token;
    userProfile: UserProfile;
    todoListByCategory: TodoItemGroup[];
    friendsList: FriendsListWithPage;
    friendTodoListByCategory: TodoItemGroup[];
    categoryNameList: string[];
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

export const onApiError = (err: any): Dispatchable => (dispatch) => {
    const status = err && err.status ? err.status : 0;
    if (status === 401) {
        return; // skip Unauthorized error
    }

    const text = err.toString() === 'TypeError: Network request failed'
        ? '网络连接失败' : (err.message ? err.message : err.toString());
    dispatch(onGlobalToast(text));
};

export const apiTodoGetUserProfile = (): Dispatchable => (dispatch) => {
    return apiCall(() => {
        return todoPrivateApi.getUserProfile().then((data) => {
            dispatch({type: actions.ACTION_TODO_GET_USER_PROFILE_SUCCESS, payload: data});
        });
    });
};

export const apiTodoUserProfileUpdateTodoVisibility = (visibility: TodoVisibility): Dispatchable => (dispatch) => {
    return apiCall(() => {
        return todoPrivateApi.updateUserProfileTodoVisibility(visibility).then(() => {
            dispatch(apiTodoGetUserProfile());
        });
    });
};

export const apiTodoUserProfileUpdateUserName
    = (userName: string, onSuccess: () => void): Dispatchable => (dispatch) => {
    return apiCall(() => {
        return todoPrivateApi.updateUserProfileUserName(userName).then(() => {
            onSuccess();
            dispatch(apiTodoGetUserProfile());
        });
    });
};

export const apiTodoGetTodoListByCategory = (p: getTodoListParams): Dispatchable => (dispatch) => {
    return apiCall(() => {
        return todoPrivateApi.getTodoListByCategory(p.friendID).then((result: TodoItemGroup[]) => {
            if (p.friendID) {
                dispatch({type: actions.ACTION_TODO_LIST_BY_CATEGORY_FRIEND_SUCCESS, payload: result});
            } else {
                dispatch({type: actions.ACTION_TODO_LIST_BY_CATEGORY_SUCCESS, payload: result});
            }
        });
    });
};

export const apiTodoAddTodo = (p: TodoItem, onSuccess: () => void): Dispatchable => (dispatch) => {
    return apiCall(() => {
        return todoPrivateApi.addTodo(p).then(() => {
            dispatch(onGlobalToast('已添加'));
            onSuccess();
        });
    });
};

export const apiTodoRemove = (todoId: string): Dispatchable => (dispatch) => {
    return apiCall(() => {
        return todoPrivateApi.removeTodo(todoId).then(() => {
            dispatch(onGlobalToast('已删除'));
            dispatch(apiTodoGetTodoListByCategory({})); // refresh
        });
    });
};

export const apiTodoUpdate = (todoId: string, todoItem: TodoItem, onSuccess: () => void)
    : Dispatchable => (dispatch) => {
    return apiCall(() => {
        return todoPrivateApi.updateTodo(todoId, todoItem).then(() => {
            dispatch(onGlobalToast('已更新'));
            onSuccess();
        });
    });
};

export const apiTodoGetFriendsList = (p: getFriendsListParams): Dispatchable => (dispatch) => {
    return apiCall(() => {
        return todoPrivateApi.getFriendsList(p.pageSize, p.pageToken).then((data) => {
            dispatch({
                type: actions.ACTION_TODO_GET_FRIEND_LIST_SUCCESS,
                payload: {
                    pageToken: p.pageToken,
                    data
                }
            });
        });
    });
};

export const apiTodoGetCategoryNameList = (): Dispatchable => (dispatch) => {
    return apiCall(() => {
        return todoPrivateApi.getCategoryNameList().then((data) => {
            dispatch({
                type: actions.ACTION_TODO_GET_CATEGORY_NAME_LIST,
                payload: data
            });
        });
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

const initialUserProfile: UserProfile = {userName: '', todoVisibility: TodoVisibility.Public};
function userProfile(state: UserProfile= initialUserProfile, action: StandardAction): UserProfile {
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

function categoryNameList(state: string[]= [], action: StandardAction): string[] {
    switch (action.type) {
        case actions.ACTION_TODO_GET_CATEGORY_NAME_LIST:
            return action.payload;
        default:
            return state;
    }
}

export const rootReducer = combineReducers<RootState>({
    globalToast,
    token,
    userID,
    userProfile,
    todoListByCategory,
    friendsList,
    friendTodoListByCategory,
    categoryNameList
});