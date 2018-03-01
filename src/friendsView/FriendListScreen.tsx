import * as React from 'react';
import { FlatList, ListRenderItemInfo, Text, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { FriendInfo, TodoVisibility } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import { FriendsListWithPage, onGlobalToast, RootState } from '../redux';
import ToastView from '../ToastView';
import { getTodoVisibilityName } from '../utils';

export interface Props extends NavigationScreenProps<void> {
    userID: string;
    friendList: FriendsListWithPage;
    onGlobalToast: (text: string) => Dispatchable;
}

class FriendListScreen extends React.Component<Props> {
    public render() {
        return (
            <View style={[commonStyles.screen]}>
                <FlatList
                    data={this.props.friendList.items}
                    renderItem={(info: ListRenderItemInfo<FriendInfo>) => {
                        return this.renderFriendInfo(info.item);
                    }}
                    keyExtractor={(item: FriendInfo, index: number) =>
                        item.userID ? item.userID : index.toString()}
                    ItemSeparatorComponent={() => <View style={[commonStyles.line]}/>}
                />
                <ToastView/>
            </View>
        );
    }

    private renderFriendInfo(friendInfo: FriendInfo): JSX.Element {
        return (
            <TouchableOpacity
                style={[commonStyles.flexRowSpaceBetween, {paddingHorizontal: 8}]}
                onPress={() => {
                    this.onFriendInfoItemPress(friendInfo);
                }}
            >
                <View style={[commonStyles.flexRowLeft]}>
                    <Text style={[commonStyles.text]}>
                        {friendInfo.userName}
                    </Text>
                    <Text style={[{color: '#0088FF', fontSize: 10, marginLeft: 4}]}>
                        {friendInfo.userID === this.props.userID ? '(你自己)' : ''}
                    </Text>
                </View>
                <View style={[{width: 120}]}>
                    <View style={[commonStyles.flexRowSpaceBetween, {height: 24}]}>
                        <Text style={[commonStyles.text, {fontSize: 12}]}>
                            总计划数：
                        </Text>
                        <Text style={[commonStyles.text, {fontSize: 12}]}>
                            {friendInfo.todoCount}
                        </Text>
                    </View>
                    <View style={[commonStyles.flexRowSpaceBetween, {height: 24}]}>
                        <Text style={[commonStyles.text, {fontSize: 12}]}>
                            是否公开：
                        </Text>
                        <Text style={[commonStyles.text, {fontSize: 12}]}>
                            {getTodoVisibilityName(friendInfo.todoVisibility)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    private onFriendInfoItemPress(friendInfo: FriendInfo) {
        if (friendInfo.userID === this.props.userID) {
            return this.props.navigation.navigate('Todo');
        }

        if (friendInfo.todoVisibility !== TodoVisibility.Public) {
            return this.props.onGlobalToast('该用户的计划不可见');
        }

        this.props.navigation.navigate('FriendTodoList', {friendInfo});
    }
}

const selectProps = (rootState: RootState) => {
    return {
        userID: rootState.userID,
        friendList: rootState.friendsList
    };
};

export default connect(selectProps, {
    onGlobalToast
})(FriendListScreen);