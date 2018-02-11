import * as React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import { NavigationScreenProps, StackNavigator } from 'react-navigation';
import { commonStyles } from '../commonStyles';
import TodoAddScreen from './TodoAddScreen';
import TodoDetailScreen from './TodoDetailScreen';
import TodoListScreen from './TodoListScreen';
const mainTabIconTodo = require('../../resource/main_todo_tab_icon.png');

export const TodoScreenStack = StackNavigator({
    TodoList: {
        screen: TodoListScreen,
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
                    style={[commonStyles.button, {marginRight: 8, width: 80, height: 32}]}
                    onPress={() => {
                        navigation.navigate('TodoAdd');
                    }}>
                    <Text style={[commonStyles.buttonText]}>新计划</Text>
                </TouchableOpacity>
            ),
        })
    },
    TodoAdd: {
        screen: TodoAddScreen,
        navigationOptions: () => ({
            headerTitle: '新计划',
            headerTitleStyle: [commonStyles.stackHeaderText],
            tabBarVisible: false,
            headerStyle: [commonStyles.stackHeader],
        }),
    },
    TodoDetail: {
        screen: TodoDetailScreen,
        navigationOptions: () => ({
            headerTitle: '计划详情',
            headerTitleStyle: [commonStyles.stackHeaderText],
            tabBarVisible: false,
            headerStyle: [commonStyles.stackHeader],
        })
    }
});