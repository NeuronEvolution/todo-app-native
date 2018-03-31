import * as React from 'react';
import { FlatList, ListRenderItemInfo, Text, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { fastClick } from '../_common/fastClick';
import { FriendInfo, getFriendsListParams, TodoVisibility } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import { apiTodoGetFriendsList, FriendsListWithPage, RootState } from '../redux';
import ToastView, { onGlobalToast, TOAST_SLOW } from '../ToastView';
import { getTodoVisibilityName } from '../utils';

export interface Props extends NavigationScreenProps<void> {
    userID: string;
    friendList: FriendsListWithPage;
    onGlobalToast: (text: string, intervalMsec: number) => Dispatchable;
    apiTodoGetFriendsList: (p: getFriendsListParams) => Dispatchable;
}

class FriendListScreen extends React.Component<Props> {
    private static getItemKey(item: FriendInfo, index: number): string {
        return item.userID ? item.userID : index.toString();
    }

    private static renderSeparatorLine() {
        return (<View style={[commonStyles.line]}/>);
    }

    private static renderTodoSummery(friendInfo: FriendInfo) {
        const {todoCount, todoVisibility} = friendInfo;

        return (
            <View style={[{width: 120}]}>
                <View style={[commonStyles.flexRowSpaceBetween, {height: 24}]}>
                    <Text style={[{fontSize: 12, color: '#888'}]}>总计划数：</Text>
                    <Text style={[{fontSize: 12, color: '#FF8800'}]}>{todoCount}</Text>
                </View>
                <View style={[commonStyles.flexRowSpaceBetween, {height: 24}]}>
                    <Text style={[{fontSize: 12, color: '#888'}]}>是否公开：</Text>
                    <Text style={[{fontSize: 12, color: '#FF8800'}]}>
                        {getTodoVisibilityName(todoVisibility)}
                    </Text>
                </View>
            </View>
        );
    }

    public componentWillMount() {
        this.renderFriendInfo = this.renderFriendInfo.bind(this);
        this.props.apiTodoGetFriendsList({pageToken: '', pageSize: 40});
    }

    public render() {
        const data = this.props.friendList.items;

        return (
            <View style={[commonStyles.screen]}>
                <FlatList
                    keyboardShouldPersistTaps={'always'}
                    data={data}
                    renderItem={this.renderFriendInfo}
                    keyExtractor={FriendListScreen.getItemKey}
                    ItemSeparatorComponent={FriendListScreen.renderSeparatorLine}/>
                <ToastView/>
            </View>
        );
    }

    private renderFriendInfo(info: ListRenderItemInfo<FriendInfo>) {
        const friendInfo = info.item;

        return (
            <TouchableOpacity
                style={[commonStyles.flexRowSpaceBetween, {paddingHorizontal: 8}]}
                onPress={() => {
                    this.onFriendInfoItemPress(friendInfo);
                }}>
                {this.renderUserName(friendInfo)}
                {FriendListScreen.renderTodoSummery(friendInfo)}
            </TouchableOpacity>
        );
    }

    private renderUserName(friendInfo: FriendInfo): JSX.Element {
        const {userName, userID} = friendInfo;
        const self = userID === this.props.userID ? '(你自己)' : '';

        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[{fontSize: 14, color: '#008888'}]}>{userName}</Text>
                <Text style={[{color: '#FF8800', fontSize: 10, marginLeft: 4}]}>{self}</Text>
            </View>
        );
    }

    private onFriendInfoItemPress(friendInfo: FriendInfo) {
        const {userID, todoVisibility} = friendInfo;

        if (userID === this.props.userID) {
            if (fastClick()) {
                return;
            }

            return this.props.navigation.navigate('Todo');
        }

        if (todoVisibility !== TodoVisibility.Public) {
            return this.props.onGlobalToast('该用户的计划不可见', TOAST_SLOW);
        }

        if (fastClick()) {
            return;
        }

        this.props.navigation.navigate('FriendTodoList', {friendInfo});
    }
}

const selectProps = (rootState: RootState) => ({
    userID: rootState.userID,
    friendList: rootState.friendsList
});

export default connect(selectProps, {
    onGlobalToast,
    apiTodoGetFriendsList
})(FriendListScreen);