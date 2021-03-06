import * as React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import { NavigationScreenProps, StackNavigator } from 'react-navigation';
import { fastClick } from '../_common/fastClick';
import { commonStyles, defaultHeaderTintColor } from '../commonStyles';
import TodoAddScreen from './TodoAddScreen';
import TodoDetailScreen from './TodoDetailScreen';
import TodoEditCategoryScreen from './TodoEditCategoryScreen';
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
                    style={[{marginRight: 8, width: 64, height: 32,
                        backgroundColor: '#008888', borderRadius: 2,
                        justifyContent: 'center', alignItems: 'center'}]}
                    onPress={() => {
                        if (fastClick()) {
                            return;
                        }

                        navigation.navigate('TodoAdd');
                    }}>
                    <Text style={[{fontSize: 14, color: '#FFFFFF'}]}>新计划</Text>
                </TouchableOpacity>
            ),
        })
    },
    TodoAdd: {
        screen: TodoAddScreen,
        navigationOptions: () => ({
            headerTintColor: defaultHeaderTintColor,
            headerTitle: '新计划',
            headerTitleStyle: [commonStyles.stackHeaderText],
            headerStyle: [commonStyles.stackHeader],
            tabBarVisible: false,
            swipeEnabled: false
        }),
    },
    TodoDetail: {
        screen: TodoDetailScreen,
        navigationOptions: () => ({
            headerTintColor: defaultHeaderTintColor,
            headerTitle: '计划详情',
            headerTitleStyle: [commonStyles.stackHeaderText],
            headerStyle: [commonStyles.stackHeader],
            tabBarVisible: false,
            swipeEnabled: false
        })
    },
    TodoEditCategory: {
        screen: TodoEditCategoryScreen
    }
});