import * as React from 'react';
import { View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { getTodoListParams, TodoItem, TodoItemGroup } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import { apiTodoGetTodoListByCategory, apiTodoRemove, RootState } from '../redux';
import ToastView from '../ToastView';
import TodoListView from './TodoListView';

export interface Props extends NavigationScreenProps<void> {
    todoListByCategory: TodoItemGroup[];
    apiTodoRemove: (todoId: string) => Dispatchable;
    apiTodoGetTodoListByCategory: (p: getTodoListParams) => Dispatchable;
}

class TodoListScreen extends React.Component<Props> {
    public componentWillMount() {
        this.props.apiTodoGetTodoListByCategory({});
    }

    public render() {
        return (
            <View style={[commonStyles.screen]}>
                <TodoListView
                    editable={true}
                    todoListByCategory={this.props.todoListByCategory}
                    onItemPress={(todoItem: TodoItem) => {
                        this.props.navigation.navigate('TodoDetail', {todoItem});
                    }}
                    onRemoveItem={(todoId: string) => {
                        this.props.apiTodoRemove(todoId);
                    }}
                />
                <ToastView/>
            </View>);
    }
}

export default connect((rootState: RootState) => ({todoListByCategory: rootState.todoListByCategory}), {
    apiTodoRemove,
    apiTodoGetTodoListByCategory
})(TodoListScreen);