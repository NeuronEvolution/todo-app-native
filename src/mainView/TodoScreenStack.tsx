import * as React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import { NavigationScreenProps, StackNavigator } from 'react-navigation';
import { commonStyles } from '../commonStyles';
import AddTodoScreen from './AddTodoScreen';
import TodoScreen from './TodoSceen';
const mainTabIconTodo = require('../../resource/main_todo_tab_icon.png');

export const TodoScreenStack = StackNavigator({
    Todo: {
        screen: TodoScreen,
        navigationOptions: ({navigation}: NavigationScreenProps<any>) => ({
            tabBarLabel: '我的计划',
            tabBarIcon: () => (
                <Image source={mainTabIconTodo}/>
            ),
            headerStyle: [commonStyles.stackHeader],
            headerLeft: (
                <Text style={[commonStyles.stackHeaderText, {marginLeft: 8}]}>我的计划</Text>
            ),
            headerRight: (
                <TouchableOpacity
                    style={[commonStyles.button, {marginRight: 8, width: 100, height: 32}]}
                    onPress={() => {
                        navigation.navigate('AddTodo');
                    }}>
                    <Text style={[commonStyles.buttonText]}>新增计划</Text>
                </TouchableOpacity>
            ),
        })
    },
    AddTodo: {
        screen: AddTodoScreen,
        navigationOptions: () => ({
            headerTitle: '新增计划',
            headerTitleStyle: [commonStyles.stackHeaderText],
            tabBarVisible: false,
            headerStyle: [commonStyles.stackHeader],
        })
    }
});