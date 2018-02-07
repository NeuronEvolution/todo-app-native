import * as React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { getTodoListParams } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import { apiTodoGetTodoListByCategory, RootState } from '../redux';
import ToastView from '../ToastView';
import TodoListView from './TodoListView';

export interface Props {
    rootState: RootState;
    apiTodoGetTodoListByCategory: (p: getTodoListParams) => Dispatchable;
}

class TodoScreen extends React.Component<Props> {
    public componentWillMount() {
        this.setState({editing: false});

        this.props.apiTodoGetTodoListByCategory({});
    }

    public render() {
        return (
            <View style={[commonStyles.screen]}>
                <TodoListView todoListByCategory={this.props.rootState.todoListByCategory}/>
                <ToastView/>
            </View>);
    }
}

export default connect((rootState: RootState) => ({rootState}), {
    apiTodoGetTodoListByCategory
})(TodoScreen);