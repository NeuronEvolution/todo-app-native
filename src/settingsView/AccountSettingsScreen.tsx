import React from 'react';
import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { fastClick } from '../_common/fastClick';
import { commonStyles } from '../commonStyles';
import { RootState } from '../redux';
import { apiAccountLogout } from '../redux_login';
import ToastView from '../ToastView';

export interface Props extends NavigationScreenProps<void> {
    userName: string;
    apiAccountLogout: () => Dispatchable;
}

class AccountSettingsScreen extends React.Component<Props> {
    public componentWillMount() {
        this.onUserNamePressed = this.onUserNamePressed.bind(this);
        this.onLogoutPressed = this.onLogoutPressed.bind(this);
    }

    public render() {
        return (
            <View style={[styles.screen]}>
                {this.renderNameSetting()}
                <View style={[commonStyles.flexRowCentered]}>
                    {this.renderLogoutButton()}
                </View>
                <ToastView/>
            </View>
        );
    }

    private renderNameSetting() {
        const userName = this.props.userName;

        return (
            <TouchableHighlight
                underlayColor={underlayColor}
                style={[styles.settingItem, {marginTop: 24}]}
                onPress={this.onUserNamePressed}
            >
                <View style={[commonStyles.flexRowSpaceBetween]}>
                    <Text style={[commonStyles.text]}>你的名字</Text>
                    <Text style={[{fontSize: 14, color: '#FF8800'}]}>{userName}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    private renderLogoutButton() {
        return (
            <TouchableOpacity
                style={[
                    commonStyles.windowButton,
                    styles.logoutButton,
                    {
                        marginTop: 360
                    }
                ]}
                onPress={this.onLogoutPressed}>
                <Text style={[commonStyles.buttonText]}>退出当前帐号</Text>
            </TouchableOpacity>
        );
    }

    private onUserNamePressed() {
        if (fastClick()) {
            return;
        }

        this.props.navigation.navigate('UserName');
    }

    private onLogoutPressed() {
        if (fastClick()) {
            return;
        }

        this.props.apiAccountLogout();
    }
}

const selectProps = (rootState: RootState) => ({
    userName: rootState.userInfo.userName
});

export default connect(selectProps, {
    apiAccountLogout,
})(AccountSettingsScreen);

const underlayColor = '#bbb';
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#eee'
    },
    logoutButton: {
        backgroundColor: 'red'
    },
    settingItem: {
        backgroundColor: '#fff',
        paddingHorizontal: 8
    }
});