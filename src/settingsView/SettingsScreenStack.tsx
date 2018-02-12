import * as React from 'react';
import { Image, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { commonStyles } from '../commonStyles';
import SettingsScreen from './SettingsScreen';

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
});