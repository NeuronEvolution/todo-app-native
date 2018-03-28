import * as React from 'react';
import { combineReducers } from 'redux';
import { SERVER_IP } from '../ENV';
import { Dispatchable, StandardAction } from './_common/action';
import {
    CategoryInfo,
    DefaultApiFactory as TodoPrivateApi, FriendInfo,
    getFriendsListParams, getTodoListParams, TodoItem, TodoItemGroup,
    TodoVisibility, UserProfile
} from './api/todo-private/gen';
import { Token } from './api/user-private/gen';
import { apiCall, getAccessToken, token, userID } from './redux_login';
import { globalToast, onGlobalToast, ToastInfo } from './ToastView';

export const ACTION_TODO_GET_USER_PROFILE_SUCCESS = 'ACTION_TODO_GET_USER_PROFILE_SUCCESS';
export const ACTION_TODO_LIST_BY_CATEGORY_SUCCESS = 'ACTION_TODO_LIST_BY_CATEGORY_SUCCESS';
export const ACTION_TODO_LIST_BY_CATEGORY_FRIEND_SUCCESS = 'ACTION_TODO_LIST_BY_CATEGORY_FRIEND_SUCCESS';
export const ACTION_TODO_GET_FRIEND_LIST_SUCCESS = 'ACTION_TODO_GET_FRIEND_LIST_SUCCESS';
export const ACTION_TODO_GET_CATEGORY_NAME_LIST = 'ACTION_TODO_GET_CATEGORY_NAME_LIST';

const todoPrivateApi = TodoPrivateApi(
    {apiKey: getAccessToken},
    fetch, 'http://' + SERVER_IP + ':8080/api-private/v1/todo'
);

export interface RootState {
    globalToast: ToastInfo;
    userID: string;
    token: Token;
    userProfile: UserProfile;
    todoListByCategory: TodoItemGroup[];
    friendsList: FriendsListWithPage;
    friendTodoListByCategory: TodoItemGroup[];
    categoryNameList: CategoryInfo[];
}

export interface FriendsListWithPage {
    pageToken: string;
    items: FriendInfo[];
    nextPageToken: string;
}

export const apiTodoGetUserProfile = (): Dispatchable => (dispatch) => {
    return apiCall(() => {
        return todoPrivateApi.getUserProfile().then((data) => {
            dispatch({type: ACTION_TODO_GET_USER_PROFILE_SUCCESS, payload: data});
        });
    });
};

export const apiTodoUserProfileUpdateTodoVisibility = (visibility: TodoVisibility): Dispatchable => (dispatch) => {
    return apiCall(() => {
        return todoPrivateApi.updateUserProfileTodoVisibility(visibility).then(() => {
            dispatch(apiTodoGetUserProfile());
            dispatch(onGlobalToast('已保存'));
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
                dispatch({type: ACTION_TODO_LIST_BY_CATEGORY_FRIEND_SUCCESS, payload: result});
            } else {
                dispatch({type: ACTION_TODO_LIST_BY_CATEGORY_SUCCESS, payload: result});
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
            dispatch(apiTodoGetTodoListByCategory({}));
            onSuccess();
        });
    });
};

export const apiTodoGetFriendsList = (p: getFriendsListParams): Dispatchable => (dispatch) => {
    return apiCall(() => {
        return todoPrivateApi.getFriendsList(p.pageSize, p.pageToken).then((data) => {
            dispatch({
                type: ACTION_TODO_GET_FRIEND_LIST_SUCCESS,
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
                type: ACTION_TODO_GET_CATEGORY_NAME_LIST,
                payload: data
            });
        });
    });
};

const initUserProfile: UserProfile = {userName: '', todoVisibility: TodoVisibility.Public};
function userProfile(state: UserProfile= initUserProfile, action: StandardAction): UserProfile {
    switch (action.type) {
        case ACTION_TODO_GET_USER_PROFILE_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

function todoListByCategory(state: TodoItemGroup[]= [], action: StandardAction): TodoItemGroup[] {
    switch (action.type) {
        case ACTION_TODO_LIST_BY_CATEGORY_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

function friendTodoListByCategory(state: TodoItemGroup[]= [], action: StandardAction): TodoItemGroup[] {
    switch (action.type) {
        case ACTION_TODO_LIST_BY_CATEGORY_FRIEND_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

const initFriendsList = {pageToken: '', items: [], nextPageToken: ''};
function friendsList(state: FriendsListWithPage= initFriendsList, action: StandardAction): FriendsListWithPage {
    switch (action.type) {
        case ACTION_TODO_GET_FRIEND_LIST_SUCCESS:
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
        case ACTION_TODO_GET_CATEGORY_NAME_LIST:
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