import * as React from 'react';
import { View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { getTodoListParams, TodoItem, TodoItemGroup } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import TodoListView from '../component/TodoListView';
import { apiTodoGetTodoListByCategory, apiTodoRemove, RootState } from '../redux';
import ToastView from '../ToastView';
import {fastClick} from "../_common/fastClick";

export interface Props extends NavigationScreenProps<void> {
    todoListByCategory: TodoItemGroup[];
    apiTodoRemove: (todoId: string) => Dispatchable;
    apiTodoGetTodoListByCategory: (p: getTodoListParams) => Dispatchable;
}

class TodoListScreen extends React.Component<Props> {
    public componentWillMount() {
        this.onItemPress = this.onItemPress.bind(this);
        this.onRemoveItem = this.onRemoveItem.bind(this);

        this.props.apiTodoGetTodoListByCategory({});
    }

    public render() {
        return (
            <View style={[commonStyles.screen]}>
                <TodoListView
                    editable={true}
                    todoListByCategory={this.props.todoListByCategory}
                    onItemPress={this.onItemPress}
                    onRemoveItem={this.onRemoveItem}/>
                <ToastView/>
            </View>);
    }

    private onItemPress(todoItem: TodoItem) {
        if (fastClick()) {
            return;
        }

        this.props.navigation.navigate('TodoDetail', {todoItem});
    }

    private onRemoveItem(todoId: string) {
        if (fastClick()) {
            return;
        }

        this.props.apiTodoRemove(todoId);
    }
}

const selectProps = (rootState: RootState) => ({
    todoListByCategory: rootState.todoListByCategory
});

export default connect(selectProps, {
    apiTodoRemove,
    apiTodoGetTodoListByCategory
})(TodoListScreen);