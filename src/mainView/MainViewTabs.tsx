import * as React from 'react';
import { Image } from 'react-native';
import { TabBarBottom, TabNavigator } from 'react-navigation';
import SettingsScreen from '../mainView/SettingsScreen';
import { FriendsScreenStack } from './FriendsScreenStack';
import { TodoScreenStack } from './TodoScreenStack';

const mainTabIconSettings = require('../../resource/main_settings_tab_icon.png');

export const MainViewTabs = TabNavigator(
    {
        Todo: {screen: TodoScreenStack},
        Friends: {screen: FriendsScreenStack},
        Settings: {
            screen: SettingsScreen,
            navigationOptions: {
                tabBarLabel: '设置',
                tabBarIcon: () => (
                    <Image source={mainTabIconSettings}/>
                ),
            }
        }
    },
    {
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        tabBarOptions: {}
    });