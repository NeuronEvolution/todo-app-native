import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity , View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import DropdownList, { Item } from '../_react_native_common/DropdownList';
import { TodoVisibility, UserProfile } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import { apiTodoUserProfileUpdateTodoVisibility, RootState } from '../redux';
import ToastView from '../ToastView';

export interface Props extends NavigationScreenProps<void> {
    userProfile: UserProfile;
    apiTodoUserProfileUpdateTodoVisibility: (visibility: TodoVisibility) => Dispatchable;
}

class SettingsScreen extends React.Component<Props> {
    public componentWillMount() {
        this.onTodoVisibilitySelected = this.onTodoVisibilitySelected.bind(this);
        this.onUserNamePressed = this.onUserNamePressed.bind(this);
        this.onAccountSettingsPressed = this.onAccountSettingsPressed.bind(this);
    }

    public render() {
        return (
            <View style={[{flex: 1, backgroundColor: '#eee'}]}>
                {this.renderAccountSettings()}
                <View style={[commonStyles.line]}/>
                {this.renderNameSetting()}
                {this.renderVisibilitySetting()}
                <ToastView/>
            </View>
        );
    }

    private renderAccountSettings() {
        return (
            <TouchableOpacity
                style={[commonStyles.flexRowLeft, {
                    backgroundColor: '#fff',
                    marginTop: 24,
                    paddingHorizontal: 8
                }]}
                onPressIn={this.onAccountSettingsPressed}
            >
                <Text style={[commonStyles.text]}>帐号</Text>
            </TouchableOpacity>
        );
    }

    private renderNameSetting() {
        const userName = this.props.userProfile.userName;

        return (
            <TouchableOpacity
                style={[commonStyles.flexRowSpaceBetween, {
                    backgroundColor: '#fff',
                    paddingHorizontal: 8
                }]}
                onPressIn={this.onUserNamePressed}>
                <Text style={[commonStyles.text]}>你的名字</Text>
                <Text style={[commonStyles.text]}>{userName}</Text>
            </TouchableOpacity>
        );
    }

    private renderVisibilitySetting() {
        return (
            <View style={[commonStyles.flexRowSpaceBetween, {
                backgroundColor: '#fff',
                marginTop: 24,
                paddingHorizontal: 8
            }]}>
                <Text style={[commonStyles.text]}>计划是否公开</Text>
                <DropdownList
                    items={[
                        {label: '公开的', value: TodoVisibility.Public},
                        {label: '仅朋友可见', value: TodoVisibility.Friend},
                        {label: '保密的', value: TodoVisibility.Private}
                    ]}
                    selectedIndex={0}
                    buttonStyle={[styles.visibilityDropDownButton]}
                    onSelect={this.onTodoVisibilitySelected}/>
            </View>
        );
    }

    private onAccountSettingsPressed() {
        this.props.navigation.navigate('AccountSettings');
    }

    private onTodoVisibilitySelected(item: Item): void {
        this.props.apiTodoUserProfileUpdateTodoVisibility(item.value);
    }

    private onUserNamePressed() {
        this.props.navigation.navigate('UserName');
    }
}

const selectProps = (rootState: RootState) => ({
    userProfile: rootState.userProfile
});

export default connect(selectProps, {
    apiTodoUserProfileUpdateTodoVisibility
})(SettingsScreen);

const styles = StyleSheet.create({
    logoutButton: {
        backgroundColor: 'red'
    },
    visibilityDropDownButton: {
        width: 120,
        borderBottomWidth: 0,
        alignItems: 'flex-end'
    }
});