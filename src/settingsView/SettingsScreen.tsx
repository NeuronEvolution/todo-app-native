import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity , View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import DropdownList, { Item } from '../_react_native_common/DropdownList';
import { TodoVisibility, UserProfile } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import { apiTodoUserProfileUpdateTodoVisibility, RootState } from '../redux';
import { apiUserLogout } from '../redux_login';
import ToastView from '../ToastView';

export interface Props extends NavigationScreenProps<void> {
    userProfile: UserProfile;
    apiUserLogout: () => Dispatchable;
    apiTodoUserProfileUpdateTodoVisibility: (visibility: TodoVisibility) => Dispatchable;
}

class SettingsScreen extends React.Component<Props> {
    public componentWillMount() {
        this.onLogoutPressed = this.onLogoutPressed.bind(this);
        this.onTodoVisibilitySelected = this.onTodoVisibilitySelected.bind(this);
        this.onUserNamePressed = this.onUserNamePressed.bind(this);
    }

    public render() {
        return (
            <View style={[commonStyles.screen, {paddingHorizontal: 16, paddingTop: 48}]}>
                {this.renderNameSetting()}
                <View style={[commonStyles.line]}/>
                {this.renderVisibilitySetting()}
                <View style={[commonStyles.line]}/>
                <View style={[commonStyles.flexRowCentered, {marginTop: 240}]}>
                    {this.renderLogoutButton()}
                </View>
                <ToastView/>
            </View>
        );
    }

    private renderNameSetting(): JSX.Element {
        const userName = this.props.userProfile.userName;

        return (
            <TouchableOpacity
                style={[commonStyles.flexRowSpaceBetween]}
                onPressIn={this.onUserNamePressed}>
                <Text style={[commonStyles.text]}>你的名字</Text>
                <Text style={[commonStyles.text]}>{userName}</Text>
            </TouchableOpacity>
        );
    }

    private renderVisibilitySetting(): JSX.Element {
        return (
            <View style={[commonStyles.flexRowSpaceBetween]}>
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

    private onTodoVisibilitySelected(item: Item): void {
        this.props.apiTodoUserProfileUpdateTodoVisibility(item.value);
    }

    private renderLogoutButton(): JSX.Element {
        return (
            <TouchableOpacity
                style={[commonStyles.windowButton, styles.logoutButton]}
                onPress={this.onLogoutPressed}>
                <Text style={[commonStyles.buttonText]}>退出当前帐号</Text>
            </TouchableOpacity>
        );
    }

    private onLogoutPressed() {
        this.props.apiUserLogout();
    }

    private onUserNamePressed() {
        this.props.navigation.navigate('UserName');
    }
}

const selectProps = (rootState: RootState) => ({
    userProfile: rootState.userProfile
});

export default connect(selectProps, {
    apiUserLogout,
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