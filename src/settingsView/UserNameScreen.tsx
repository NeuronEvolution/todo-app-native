import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { commonStyles } from '../commonStyles';
import { apiTodoUserProfileUpdateUserName, onGlobalToast, RootState } from '../redux';
import ToastView from '../ToastView';

export interface Props extends NavigationScreenProps<void> {
    userName: string;
    onGlobalToast: (text: string) => Dispatchable;
    apiTodoUserProfileUpdateUserName: (userName: string, onSuccess: () => void) => Dispatchable;
}

interface State {
    userName: string;
}

class UserNameScreen extends React.Component<Props, State> {
    public componentWillMount() {
        this.setState({
            userName: this.props.userName
        });

        this.onSave = this.onSave.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    public render() {
        const changed = this.state.userName !== this.props.userName;

        return (
            <View style={[commonStyles.screen, {paddingHorizontal: 16, paddingTop: 24}]}>
                <TextInput
                    autoFocus={true}
                    style={[commonStyles.textInput]}
                    value={this.state.userName}
                    onChangeText={this.onChangeText}
                />
                <Text style={[{fontSize: 12, textAlign: 'left', color: '#888', marginTop: 12}]}>
                    好名字可以让大家更容易记住你。
                </Text>
                <View style={[commonStyles.flexRowCentered, {marginTop: 32}]}>
                    <TouchableOpacity
                        disabled={!changed}
                        style={[commonStyles.button, {width: 300}, !changed ? {backgroundColor: '#eee'} : null]}
                        onPress={this.onSave}>
                        <Text style={[commonStyles.buttonText]}>保存</Text>
                    </TouchableOpacity>
                </View>
                <ToastView/>
            </View>
        );
    }

    private onSave() {
        const userName = this.state.userName;
        if (userName === '') {
            return this.props.onGlobalToast('名字不能为空');
        }

        this.props.apiTodoUserProfileUpdateUserName(userName, () => {
            this.props.navigation.navigate('Settings');
        });
    }

    private onChangeText(text: string): void {
        this.setState({
            userName: text
        });
    }
}

const selectProps = (rootState: RootState) => {
    return {userName: rootState.userProfile ? rootState.userProfile.userName : ''};
};

export default connect(selectProps, {
    onGlobalToast,
    apiTodoUserProfileUpdateUserName
})(UserNameScreen);