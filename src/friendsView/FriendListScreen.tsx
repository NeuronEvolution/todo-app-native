import * as React from 'react';
import { FlatList, ListRenderItemInfo, Text, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { FriendInfo, TodoVisibility } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import { FriendsListWithPage, RootState } from '../redux';
import ToastView, { onGlobalToast } from '../ToastView';
import { getTodoVisibilityName } from '../utils';

export interface Props extends NavigationScreenProps<void> {
    userID: string;
    friendList: FriendsListWithPage;
    onGlobalToast: (text: string) => Dispatchable;
}

class FriendListScreen extends React.Component<Props> {
    private static getItemKey(item: FriendInfo, index: number): string {
        return item.userID ? item.userID : index.toString();
    }

    private static renderSeparatorLine(): JSX.Element {
        return (<View style={[commonStyles.line]}/>);
    }

    private static renderTodoSummery(friendInfo: FriendInfo): JSX.Element {
        const {todoCount, todoVisibility} = friendInfo;

        return (
            <View style={[{width: 120}]}>
                <View style={[commonStyles.flexRowSpaceBetween, {height: 24}]}>
                    <Text style={[{fontSize: 12, color: '#888'}]}>总计划数：</Text>
                    <Text style={[{fontSize: 12, color: '#888'}]}>{todoCount}</Text>
                </View>
                <View style={[commonStyles.flexRowSpaceBetween, {height: 24}]}>
                    <Text style={[{fontSize: 12, color: '#888'}]}>是否公开：</Text>
                    <Text style={[{fontSize: 12, color: '#888'}]}>
                        {getTodoVisibilityName(todoVisibility)}
                    </Text>
                </View>
            </View>
        );
    }

    public componentWillMount() {
        this.renderFriendInfo = this.renderFriendInfo.bind(this);
    }

    public render() {
        const data = this.props.friendList.items;

        return (
            <View style={[commonStyles.screen]}>
                <FlatList
                    data={data}
                    renderItem={this.renderFriendInfo}
                    keyExtractor={FriendListScreen.getItemKey}
                    ItemSeparatorComponent={FriendListScreen.renderSeparatorLine}/>
                <ToastView/>
            </View>
        );
    }

    private renderFriendInfo(info: ListRenderItemInfo<FriendInfo>): JSX.Element {
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
                <Text style={[commonStyles.text]}>{userName}</Text>
                <Text style={[{color: '#0088FF', fontSize: 10, marginLeft: 4}]}>{self}</Text>
            </View>
        );
    }

    private onFriendInfoItemPress(friendInfo: FriendInfo) {
        const {userID, todoVisibility} = friendInfo;

        if (userID === this.props.userID) {
            return this.props.navigation.navigate('Todo');
        }

        if (todoVisibility !== TodoVisibility.Public) {
            return this.props.onGlobalToast('该用户的计划不可见');
        }

        this.props.navigation.navigate('FriendTodoList', {friendInfo});
    }
}

const selectProps = (rootState: RootState) => ({
    userID: rootState.userID,
    friendList: rootState.friendsList
});

export default connect(selectProps, {
    onGlobalToast
})(FriendListScreen);