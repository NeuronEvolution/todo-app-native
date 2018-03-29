import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { fastClick } from '../_common/fastClick';
import { commonStyles } from '../commonStyles';
import { apiUserLogout } from '../redux_login';

export interface Props {
    apiUserLogout: () => Dispatchable;
}

class AccountSettingsScreen extends React.Component<Props> {
    public componentWillMount() {
        this.onLogoutPressed = this.onLogoutPressed.bind(this);
    }

    public render() {
        return (
            <View style={[commonStyles.screenCentered]}>
                {this.renderLogoutButton()}
            </View>
        );
    }

    private renderLogoutButton() {
        return (
            <TouchableOpacity
                style={[
                    commonStyles.windowButton,
                    styles.logoutButton,
                    {
                        marginTop: 48
                    }
                ]}
                onPress={this.onLogoutPressed}>
                <Text style={[commonStyles.buttonText]}>退出当前帐号</Text>
            </TouchableOpacity>
        );
    }

    private onLogoutPressed() {
        if (fastClick()) {
            return;
        }

        this.props.apiUserLogout();
    }
}

export default connect(null, {
    apiUserLogout,
})(AccountSettingsScreen);

const styles = StyleSheet.create({
    logoutButton: {
        backgroundColor: 'red'
    }
});