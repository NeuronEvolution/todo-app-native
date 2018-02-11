import * as React from 'react';
import { Text, TextInput, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { TodoItem } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import ToastView from '../ToastView';

export default class FriendTodoDetailScreen extends React.Component<NavigationScreenProps<{todoItem: TodoItem}>> {
    public render() {
        const todoItem: TodoItem = this.props.navigation.state.params.todoItem;

        return (
            <View style={[commonStyles.screenCentered, {paddingTop: 48}]}>
                <View style={[commonStyles.flexRowLeft]}>
                    <Text style={[commonStyles.text]}>分类</Text>
                    <TextInput
                        style={[commonStyles.textInput, {width: 240, marginLeft: 16}]}
                        value={todoItem.category}
                        editable={false}
                    />
                </View>
                <View style={[commonStyles.flexRowLeft]}>
                    <Text style={[commonStyles.text]}>标题</Text>
                    <TextInput
                        style={[commonStyles.textInput, {width: 240, marginLeft: 16}]}
                        value={todoItem.title}
                        editable={false}
                    />
                </View>
                <View style={[commonStyles.flexRowLeft]}>
                    <Text style={[commonStyles.text]}>描述</Text>
                    <TextInput
                        style={[commonStyles.textInput, {width: 240, marginLeft: 16}]}
                        value={todoItem.desc}
                        editable={false}
                    />
                </View>
                <ToastView/>
            </View>
        );
    }
}