import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { TodoItem, TodoStatus } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import { apiTodoUpdate, onGlobalToast } from '../redux';
import ToastView from '../ToastView';

export interface Props extends NavigationScreenProps<{todoItem: TodoItem}> {
    apiTodoUpdate: (todoId: string, todoItem: TodoItem, onSuccess: () => void) => Dispatchable;
    onGlobalToast: (text: string) => Dispatchable;
}

interface State {
    todoItemParam: TodoItem;
    changed: boolean;
    originCategory: string;
    originTitle: string;
    originDesc: string;
    originStatus: TodoStatus;
    category: string;
    title: string;
    desc: string;
    status: TodoStatus;
}

class TodoDetailScreen extends React.Component<Props, State> {
    public componentWillMount() {
        const todoItem: TodoItem = this.props.navigation.state.params.todoItem;
        const category = todoItem.category ? todoItem.category : '';
        const title = todoItem.title ? todoItem.title : '';
        const desc = todoItem.desc ? todoItem.desc : '';
        const status = todoItem.status ? todoItem.status : TodoStatus.Ongoing;
        this.setState({
            todoItemParam: todoItem,
            category,
            title,
            desc,
            status,
            originCategory: category,
            originTitle: title,
            originDesc: desc,
            originStatus: status,
            changed: false
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
                            this.updateChanged(this.state.title, text, this.state.desc, this.state.status);
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
                            this.updateChanged(text, this.state.category, this.state.desc, this.state.status);
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
                            this.updateChanged(this.state.title, this.state.category, text, this.state.status);
                        }}
                        value={this.state.desc}
                    />
                </View>
                {this.renderSummitButton()}
                <ToastView/>
            </View>
        );
    }

    private renderSummitButton(): JSX.Element {
        return (
            <TouchableOpacity
                style={[
                    commonStyles.button,
                    {width: 300, marginTop: 12},
                    this.state.changed ? null : {backgroundColor: '#eee'}
                ]}
                disabled={!this.state.changed}
                onPress={() => {
                    this.onSummitPressed();
                }}>
                <Text style={[
                    commonStyles.buttonText,
                    this.state.changed ? null : {color: '#aaa'}
                ]}>提交修改</Text>
            </TouchableOpacity>
        );
    }

    private updateChanged(title: string, category: string, desc: string, status: TodoStatus) {
        const changed = title !== this.state.originTitle
            || category !== this.state.originCategory
            || desc !== this.state.originDesc
            || status !== this.state.status;

        this.setState({changed});
    }

    private onSummitPressed() {
        const todoId = this.state.todoItemParam.todoId;
        if (!todoId) {
            return this.props.onGlobalToast('todoId为空');
        }

        this.props.apiTodoUpdate(
            todoId,
            {
                category: this.state.category,
                title: this.state.title,
                desc: this.state.desc,
                status: this.state.status
            },
            () => {
                this.props.navigation.navigate('TodoList');
            });
    }
}

export default connect(null, {
    apiTodoUpdate,
    onGlobalToast
})(TodoDetailScreen);