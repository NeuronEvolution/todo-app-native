import * as React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { FriendInfo, TodoItem, TodoStatus } from '../api/todo-private/gen';
import { commonStyles, defaultHeaderTintColor } from '../commonStyles';
import ToastView from '../ToastView';
import { getTodoStatusName } from '../utils';

const navigationOptionsFunc
    = ({navigation}: NavigationScreenProps<{friendInfo: FriendInfo, todoItem: TodoItem}>) => {
    const userName = navigation.state.params.friendInfo.userName;
    return {
        headerBackTitle: '返回',
        headerTintColor: defaultHeaderTintColor,
        headerTitle: userName + '的计划',
        headerTitleStyle: [commonStyles.stackHeaderText],
        tabBarVisible: false,
        headerStyle: [commonStyles.stackHeader],
        swipeEnabled: false
    };
};

export default class FriendTodoDetailScreen
    extends React.Component<NavigationScreenProps<{friendInfo: FriendInfo, todoItem: TodoItem}>> {
    public static navigationOptions = navigationOptionsFunc;

    private static renderCategory(category: string): JSX.Element {
        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[styles.nameText]}>分类</Text>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    style={[commonStyles.textInput, styles.contentRight]}
                    value={category}
                    editable={false}
                    placeholder={'未分类'}/>
            </View>
        );
    }

    private static renderTitle(title: string): JSX.Element {
        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[styles.nameText]}>标题</Text>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    style={[commonStyles.textInput, styles.contentRight]}
                    value={title}
                    editable={false}/>
            </View>
        );
    }

    private static renderDesc(desc: string): JSX.Element {
        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[styles.nameText]}>描述</Text>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    style={[commonStyles.textInput, styles.contentRight]}
                    value={desc}
                    editable={false}/>
            </View>
        );
    }

    private static renderStatus(status: TodoStatus): JSX.Element {
        const statusName = getTodoStatusName(status);

        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[styles.nameText]}>状态</Text>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    style={[commonStyles.textInput, styles.contentRight]}
                    value={statusName}
                    editable={false}/>
            </View>
        );
    }

    public render() {
        const todoItem: TodoItem = this.props.navigation.state.params.todoItem;
        const {category, title, desc, status} = todoItem;

        return (
            <View style={[commonStyles.screen, {paddingTop: 48, paddingHorizontal: 8}]}>
                {FriendTodoDetailScreen.renderCategory(category)}
                {FriendTodoDetailScreen.renderTitle(title)}
                {FriendTodoDetailScreen.renderDesc(desc ? desc : '')}
                {FriendTodoDetailScreen.renderStatus(status)}
                <ToastView/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    nameText: {
        color: '#888',
        textAlign: 'center',
        fontSize: 14,
        width: 60
    },
    contentRight: {
        width: 240
    }
});