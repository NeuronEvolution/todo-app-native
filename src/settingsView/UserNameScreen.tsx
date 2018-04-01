import * as React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { fastClick } from '../_common/fastClick';
import { commonStyles } from '../commonStyles';
import { MAX_USER_NAME_LENGTH } from '../GlobalConstants';
import { apiTodoUserProfileUpdateUserName, RootState } from '../redux';
import ToastView, { onGlobalToast, TOAST_SLOW } from '../ToastView';

export interface Props extends NavigationScreenProps<void> {
    userName: string;
    onGlobalToast: (text: string, intervalMsec: number) => Dispatchable;
    apiTodoUserProfileUpdateUserName: (userName: string, onSuccess: () => void) => Dispatchable;
}

interface State {
    userName: string;
}

class UserNameScreen extends React.Component<Props, State> {
    public componentWillMount() {
        this.onSave = this.onSave.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onSaveSuccess = this.onSaveSuccess.bind(this);

        this.setState({
            userName: this.props.userName
        });
    }

    public render() {
        return (
            <View style={[commonStyles.screen, {paddingHorizontal: 16, paddingTop: 24}]}>
                {this.renderName()}
                <Text style={[styles.nameTip]}>
                    好名字可以让大家更容易记住你。
                </Text>
                {this.renderSaveButton()}
                <ToastView/>
            </View>
        );
    }

    private renderName(): JSX.Element {
        return (
            <TextInput
                underlineColorAndroid={'transparent'}
                autoFocus={true}
                style={[commonStyles.textInput]}
                value={this.state.userName}
                onChangeText={this.onChangeText}
                placeholder={'最多' + MAX_USER_NAME_LENGTH + '个字符'}
                maxLength={MAX_USER_NAME_LENGTH}
            />
        );
    }

    private renderSaveButton(): JSX.Element {
        const changed = this.state.userName !== this.props.userName;
        const buttonBackgroundColor = !changed ? {backgroundColor: '#eee'} : null;

        return (
            <View style={[commonStyles.flexRowCentered, {marginTop: 32}]}>
                <TouchableOpacity
                    disabled={!changed}
                    style={[commonStyles.windowButton, buttonBackgroundColor]}
                    onPress={this.onSave}>
                    <Text style={[commonStyles.buttonText]}>保存</Text>
                </TouchableOpacity>
            </View>
        );
    }

    private onChangeText(text: string): void {
        this.setState({userName: text});
    }

    private onSaveSuccess() {
        fastClick(); // todo 避免在此之前再点击

        this.props.navigation.goBack();
    }

    private onSave() {
        if (fastClick()) {
            return;
        }

        const userName = this.state.userName;
        if (userName === '') {
            return this.props.onGlobalToast('名字不能为空', TOAST_SLOW);
        }

        this.props.apiTodoUserProfileUpdateUserName(userName, this.onSaveSuccess);
    }
}

const selectProps = (rootState: RootState) => ({
    userName: rootState.userProfile ? rootState.userProfile.userName : ''
});

export default connect(selectProps, {
    onGlobalToast,
    apiTodoUserProfileUpdateUserName
})(UserNameScreen);

const styles = StyleSheet.create({
    nameTip: {
        color: '#888',
        fontSize: 12,
        textAlign: 'left',
        marginTop: 12
    }
});