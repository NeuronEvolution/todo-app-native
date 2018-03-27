import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { TodoVisibility, UserProfile } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import VisibilitySelectionModal from '../component/VisibilitySelectionModal';
import { apiTodoUserProfileUpdateTodoVisibility, RootState } from '../redux';
import ToastView from '../ToastView';
import { getTodoVisibilityName } from '../utils';

export interface Props extends NavigationScreenProps<void> {
    userProfile: UserProfile;
    apiTodoUserProfileUpdateTodoVisibility: (visibility: TodoVisibility) => Dispatchable;
}

interface State {
    showVisibilitySelectionPanel: boolean;
}

class SettingsScreen extends React.Component<Props, State> {
    public componentWillMount() {
        this.onTodoVisibilitySelected = this.onTodoVisibilitySelected.bind(this);
        this.onUserNamePressed = this.onUserNamePressed.bind(this);
        this.onAccountSettingsPressed = this.onAccountSettingsPressed.bind(this);
        this.showVisibilitySelectionPanel = this.showVisibilitySelectionPanel.bind(this);
        this.closeVisibilitySelectionPanel = this.closeVisibilitySelectionPanel.bind(this);

        const initialState: State = {
            showVisibilitySelectionPanel: false
        };
        this.setState(initialState);
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
            <TouchableOpacity
                style={[commonStyles.flexRowSpaceBetween, {
                    backgroundColor: '#fff',
                    marginTop: 24,
                    paddingHorizontal: 8
                }]}
                onPress={this.showVisibilitySelectionPanel}
            >
                <Text style={[commonStyles.text]}>计划是否公开</Text>
                <Text style={[commonStyles.text]}>{getTodoVisibilityName(this.props.userProfile.todoVisibility)}</Text>
                <VisibilitySelectionModal
                    visible={this.state.showVisibilitySelectionPanel}
                    onClose={this.closeVisibilitySelectionPanel}
                    onSelect={this.onTodoVisibilitySelected}
                />
            </TouchableOpacity>
        );
    }

    private showVisibilitySelectionPanel() {
        this.setState({showVisibilitySelectionPanel: true});
    }

    private closeVisibilitySelectionPanel() {
        this.setState({showVisibilitySelectionPanel: false});
    }

    private onTodoVisibilitySelected(todoVisibility: TodoVisibility): void {
        this.props.apiTodoUserProfileUpdateTodoVisibility(todoVisibility);
    }

    private onAccountSettingsPressed() {
        this.props.navigation.navigate('AccountSettings');
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