import * as React from 'react';
import { TabBarBottom, TabNavigator, TabScene } from 'react-navigation';
import { REDUX_STORE } from '../App';
import { FriendsScreenStack } from './friendsView/FriendsScreenStack';
import * as GlobalConstants from './GlobalConstants';
import { apiTodoGetFriendsList, apiTodoGetTodoListByCategory, apiTodoGetUserProfile } from './redux';
import { SettingsScreenStack } from './settingsView/SettingsScreenStack';
import { TodoScreenStack } from './todoView/TodoScreenStack';

export const MainTabs = TabNavigator(
    {
        Todo: {
            screen: TodoScreenStack,
            navigationOptions: {
                tabBarOnPress: ({scene, jumpToIndex}: {
                    scene: TabScene,
                    jumpToIndex: (index: number) => void
                }) => {
                    REDUX_STORE.dispatch(apiTodoGetTodoListByCategory({}));
                    jumpToIndex(scene.index);
                }
            }
        },
        Friends: {
            screen: FriendsScreenStack,
            navigationOptions: {
                tabBarOnPress: ({scene, jumpToIndex}: {
                    scene: TabScene,
                    jumpToIndex: (index: number) => void
                }) => {
                    REDUX_STORE.dispatch(apiTodoGetFriendsList({
                        pageToken: '',
                        pageSize: GlobalConstants.FRIEND_LIST_PAGE_SIZE
                    }));
                    jumpToIndex(scene.index);
                }
            }
        },
        Settings: {
            screen: SettingsScreenStack,
            navigationOptions: {
                tabBarOnPress: ({scene, jumpToIndex}: {
                    scene: TabScene,
                    jumpToIndex: (index: number) => void
                }) => {
                    REDUX_STORE.dispatch(apiTodoGetUserProfile());
                    jumpToIndex(scene.index);
                }
            }
        }
    },
    {
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            style: {
                backgroundColor: '#fff',
            },
            activeTintColor: '#FF8800'
        },
    });