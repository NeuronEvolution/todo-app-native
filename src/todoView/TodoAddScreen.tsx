import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { TodoItem, TodoStatus } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import * as GlobalConstants from '../GlobalConstants';
import { apiTodoAddTodo, onGlobalToast } from '../redux';
import ToastView from '../ToastView';

export interface Props extends NavigationScreenProps<void> {
    onGlobalToast: (text: string) => Dispatchable;
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
                        placeholder={'最多' + GlobalConstants.MAX_CATEGORY_NAME_LENGTH + '个字符'}
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
                        placeholder={'最多' + GlobalConstants.MAX_TITLE_NAME_LENGTH + '个字符'}
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
                        placeholder={'最多' + GlobalConstants.MAX_DESC_TEXT_LENGTH + '个字符'}
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
        if (this.state.category === '未分类') {
            return this.props.onGlobalToast('请使用别的分类名称');
        }

        this.props.apiTodoAddTodo(
            {
                todoId: '',
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
    onGlobalToast,
    apiTodoAddTodo
})(TodoAddScreen);