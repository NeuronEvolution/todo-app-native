import * as React from 'react';
import { Image, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { commonStyles } from '../commonStyles';
import FriendsScreen from './FriendsScreen';
const mainTabIconFriends = require('../../resource/main_friends_tab_icon.png');

export const FriendsScreenStack = StackNavigator({
    Friends: {
        screen: FriendsScreen,
        navigationOptions: {
            tabBarLabel: '朋友的计划',
            tabBarIcon: () => (
                <Image source={mainTabIconFriends}/>
            ),
            headerStyle: [commonStyles.stackHeader],
            headerLeft: (
                <Text style={[commonStyles.stackHeaderText, {marginLeft: 8 }]}>朋友的计划</Text>
            )
        }
    }
});