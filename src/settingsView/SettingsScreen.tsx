import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
                <View
                    style={[commonStyles.flexRowSpaceBetween]}
                    onTouchStart={this.onUserNamePressed}
                >
                    <Text style={[commonStyles.text]}>你的名字</Text>
                    <Text style={[commonStyles.text]}>{this.props.userProfile.userName}</Text>
                </View>
                <View style={[commonStyles.line]}/>
                <View style={[commonStyles.flexRowSpaceBetween]}>
                    <Text style={[commonStyles.text]}>计划是否公开</Text>
                    <DropdownList
                        items={[
                            {label: '公开', value: TodoVisibility.Public},
                            {label: '仅朋友可见', value: TodoVisibility.Friend},
                            {label: '保密', value: TodoVisibility.Private}
                        ]}
                        selectedIndex={0}
                        buttonStyle={{width: 120, borderBottomWidth: 0, alignItems: 'flex-end'}}
                        onSelect={this.onTodoVisibilitySelected}
                    />
                </View>
                <View style={[commonStyles.line]}/>
                <View style={[commonStyles.flexRowCentered, {marginTop: 48}]}>
                    {this.renderLogoutButton()}
                </View>
                <ToastView/>
            </View>
        );
    }

    private onTodoVisibilitySelected(item: Item): void {
        this.props.apiTodoUserProfileUpdateTodoVisibility(item.value);
    }

    private renderLogoutButton(): JSX.Element {
        return (
            <TouchableOpacity
                style={[
                    commonStyles.button,
                    {width: 300, backgroundColor: 'red'}
                ]}
                onPress={this.onLogoutPressed}>
                <Text style={[
                    commonStyles.buttonText,
                    {color: '#fff'}
                ]}>退出当前帐号</Text>
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

const selectProps = (rootState: RootState) => {
    return {userProfile: rootState.userProfile};
};

export default connect(selectProps, {
    apiUserLogout,
    apiTodoUserProfileUpdateTodoVisibility
})(SettingsScreen);