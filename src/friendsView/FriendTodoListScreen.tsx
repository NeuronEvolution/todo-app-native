import * as React from 'react';
import { View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { FriendInfo, getTodoListParams, TodoItem, TodoItemGroup } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import { apiTodoGetTodoListByCategory, RootState } from '../redux';
import ToastView from '../ToastView';
import TodoListView from '../todoView/TodoListView';

export interface Props extends NavigationScreenProps<{friendInfo: FriendInfo}> {
    friendTodoListByCategory: TodoItemGroup[];
    apiTodoGetTodoListByCategory: (p: getTodoListParams) => Dispatchable;
}

class FriendTodoListScreen extends React.Component<Props> {
    public componentWillMount() {
        const friendID = this.props.navigation.state.params.friendInfo.userID;
        this.props.apiTodoGetTodoListByCategory({friendID});
    }

    public render() {
        return (
            <View style={[commonStyles.screen]}>
                <TodoListView
                    editable={false}
                    todoListByCategory={this.props.friendTodoListByCategory}
                    onItemPress={(todoItem: TodoItem) => {
                        this.props.navigation.navigate('FriendTodoDetail', {todoItem});
                    }}
                />
                <ToastView/>
            </View>);
    }
}

export default connect((rootState: RootState) => ({friendTodoListByCategory: rootState.friendTodoListByCategory}), {
    apiTodoGetTodoListByCategory
})(FriendTodoListScreen);