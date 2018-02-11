import * as React from 'react';
import { FlatList, ListRenderItemInfo, Text, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { FriendInfo } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import { FriendsListWithPage, RootState } from '../redux';
import ToastView from '../ToastView';

export interface Props extends NavigationScreenProps<void> {
    friendList: FriendsListWithPage;
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
                <View>
                    <Text style={[commonStyles.text]}>{friendInfo.userName}</Text>
                </View>
                <View>
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
                            {friendInfo.todoPublicVisible ? '公开' : '保密'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    private onFriendInfoItemPress(friendInfo: FriendInfo) {
        this.props.navigation.navigate('FriendTodoList', {friendInfo});
    }
}

export default connect((rootState: RootState) => ({friendList: rootState.friendsList}), {
})(FriendListScreen);