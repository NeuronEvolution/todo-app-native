import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import {TodoItem, TodoStatus} from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import { apiTodoAddTodo } from '../redux';
import ToastView from '../ToastView';

export interface Props extends NavigationScreenProps<void> {
    apiTodoAddTodo: (p: TodoItem, onSuccess: () => void) => Dispatchable;
}

interface State {
    category: string;
    title: string;
    desc: string;
}

class TodoAddScreen extends React.Component<Props, State> {
    public componentWillMount() {
        this.setState({
            category: '',
            title: ''
        });
    }

    public render() {
        return (
            <View style={[commonStyles.screenCentered, {paddingTop: 48}]}>
                <View style={[commonStyles.flexRowLeft]}>
                    <Text style={[commonStyles.text]}>分类</Text>
                    <TextInput
                        style={[commonStyles.textInput, {width: 240, marginLeft: 16}]}
                        onChangeText={(text) => {
                            this.setState({category: text});
                        }}
                        value={this.state.category}
                    />
                </View>
                <View style={[commonStyles.flexRowLeft]}>
                    <Text style={[commonStyles.text]}>标题</Text>
                    <TextInput
                        style={[commonStyles.textInput, {width: 240, marginLeft: 16}]}
                        onChangeText={(text) => {
                            this.setState({title: text});
                        }}
                        value={this.state.title}
                    />
                </View>
                <View style={[commonStyles.flexRowLeft]}>
                    <Text style={[commonStyles.text]}>描述</Text>
                    <TextInput
                        style={[commonStyles.textInput, {width: 240, marginLeft: 16}]}
                        onChangeText={(text) => {
                            this.setState({desc: text});
                        }}
                        value={this.state.desc}
                    />
                </View>
                <TouchableOpacity
                    style={[commonStyles.button, {width: 300, marginTop: 12}]}
                    onPress={() => {
                        this.onAddPressed();
                    }}>
                    <Text style={[commonStyles.buttonText]}>确定</Text>
                </TouchableOpacity>
                <ToastView/>
            </View>
        );
    }

    private onAddPressed() {
        this.props.apiTodoAddTodo(
            {
                category: this.state.category,
                title: this.state.title,
                desc: this.state.desc,
                status: TodoStatus.Ongoing
            },
            () => {
                this.props.navigation.navigate('TodoList');
            });
    }
}

export default connect(null, {
    apiTodoAddTodo
})(TodoAddScreen);