import * as React from 'react';
import { Image, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { commonStyles, defaultHeaderTintColor } from '../commonStyles';
import AboutScreen from './AboutScreen';
import AccountSettingsScreen from './AccountSettingsScreen';
import HelpScreen from './HelpScreen';
import SettingsScreen from './SettingsScreen';
import UserNameScreen from './UserNameScreen';

const mainTabIconSettings = require('../../resource/main_settings_tab_icon.png');

export const SettingsScreenStack = StackNavigator({
    Settings: {
        screen: SettingsScreen,
        navigationOptions: {
            tabBarLabel: '设置',
            tabBarIcon: () => (
                <Image source={mainTabIconSettings}/>
            ),
            headerStyle: [commonStyles.stackHeader],
            headerLeft: (
                <Text style={[commonStyles.stackHeaderText, {marginLeft: 8}]}>设置</Text>
            )
        }
    },
    AccountSettings: {
        screen: AccountSettingsScreen,
        navigationOptions: {
            headerTintColor: defaultHeaderTintColor,
            headerTitle: '帐号设置',
            headerTitleStyle: [commonStyles.stackHeaderText],
            headerStyle: [commonStyles.stackHeader],
            tabBarVisible: false,
            swipeEnabled: false
        }
    },
    UserName: {
        screen: UserNameScreen,
        navigationOptions: {
            headerTintColor: defaultHeaderTintColor,
            headerTitle: '更改名字',
            headerTitleStyle: [commonStyles.stackHeaderText],
            headerStyle: [commonStyles.stackHeader],
            tabBarVisible: false,
            swipeEnabled: false
        }
    },
    HelpScreen: {
        screen: HelpScreen,
        navigationOptions: {
            headerTintColor: defaultHeaderTintColor,
            headerTitle: '一个AI',
            headerTitleStyle: [commonStyles.stackHeaderText],
            headerStyle: [commonStyles.stackHeader],
            tabBarVisible: false,
            swipeEnabled: false
        }
    },
    AboutScreen: {
        screen: AboutScreen,
        navigationOptions: {
            headerTintColor: defaultHeaderTintColor,
            headerTitle: '关于火星计划',
            headerTitleStyle: [commonStyles.stackHeaderText],
            headerStyle: [commonStyles.stackHeader],
            tabBarVisible: false,
            swipeEnabled: false
        }
    }
});