import * as React from 'react';
import { View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { FriendInfo, getTodoListParams, TodoItem, TodoItemGroup } from '../api/todo-private/gen';
import { commonStyles, defaultHeaderTintColor } from '../commonStyles';
import { apiTodoGetTodoListByCategory, RootState } from '../redux';
import ToastView from '../ToastView';
import TodoListView from '../todoView/TodoListView';

export interface Props extends NavigationScreenProps<{friendInfo: FriendInfo}> {
    friendTodoListByCategory: TodoItemGroup[];
    apiTodoGetTodoListByCategory: (p: getTodoListParams) => Dispatchable;
}

interface State {
    friendInfo: FriendInfo;
}

const navigationOptionsFunc = ({navigation}: NavigationScreenProps<{friendInfo: FriendInfo}>) => {
    const userName = navigation.state.params.friendInfo.userName;
    return {
        headerTintColor: defaultHeaderTintColor,
        headerTitle: userName + '的计划',
        headerTitleStyle: [commonStyles.stackHeaderText],
        tabBarVisible: false,
        headerStyle: [commonStyles.stackHeader]
    };
};

class FriendTodoListScreen extends React.Component<Props, State> {
    public static navigationOptions = navigationOptionsFunc;

    public componentWillMount() {
        const friendInfo = this.props.navigation.state.params.friendInfo;
        const friendID = friendInfo.userID;

        this.onItemPress = this.onItemPress.bind(this);

        this.setState({friendInfo});
        this.props.apiTodoGetTodoListByCategory({friendID});
    }

    public render() {
        return (
            <View style={[commonStyles.screen]}>
                <TodoListView
                    editable={false}
                    todoListByCategory={this.props.friendTodoListByCategory}
                    onItemPress={this.onItemPress}/>
                <ToastView/>
            </View>);
    }

    private onItemPress(todoItem: TodoItem) {
        this.props.navigation.navigate(
            'FriendTodoDetail', {
                todoItem,
                friendInfo: this.state.friendInfo
            });
    }
}

const selectProps = (rootState: RootState) => ({
    friendTodoListByCategory: rootState.friendTodoListByCategory
});

export default connect(selectProps, {
    apiTodoGetTodoListByCategory
})(FriendTodoListScreen);