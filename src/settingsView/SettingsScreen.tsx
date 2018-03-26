import * as React from 'react';
import { Modal, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { TodoVisibility, UserProfile } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
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
                {this.renderVisibilitySelectionPanel()}
            </TouchableOpacity>
        );
    }

    private renderVisibilitySelectionPanel() {
        return (
            <Modal onRequestClose={this.closeVisibilitySelectionPanel}
                   visible={this.state.showVisibilitySelectionPanel}
                   transparent={true}>
                <TouchableOpacity
                    style={[{
                        backgroundColor: '#00000050',
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }]}
                    onPress={this.closeVisibilitySelectionPanel}
                >
                    <TouchableHighlight
                        underlayColor={'#eee'}
                        style={styles.visibilityButton}
                        onPress={() => {
                            this.onTodoVisibilitySelected(TodoVisibility.Public);
                        }}
                    >
                        <Text>公开的</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={'#eee'}
                        style={styles.visibilityButton}
                        onPress={() => {
                            this.onTodoVisibilitySelected(TodoVisibility.Friend);
                        }}
                    >
                        <Text>仅朋友可见</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={'#eee'}
                        style={styles.visibilityButton}
                        onPress={() => {
                            this.onTodoVisibilitySelected(TodoVisibility.Private);
                        }}
                    >
                        <Text>保密的</Text>
                    </TouchableHighlight>
                </TouchableOpacity>
            </Modal>
        );
    }

    private showVisibilitySelectionPanel() {
        this.setState({showVisibilitySelectionPanel: true});
    }

    private closeVisibilitySelectionPanel() {
        this.setState({showVisibilitySelectionPanel: false});
    }

    private onAccountSettingsPressed() {
        this.props.navigation.navigate('AccountSettings');
    }

    private onTodoVisibilitySelected(todoVisibility: TodoVisibility): void {
        this.closeVisibilitySelectionPanel();
        this.props.apiTodoUserProfileUpdateTodoVisibility(todoVisibility);
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
    visibilityButton: {
        width: 180,
        height: 48,
        backgroundColor: '#FFFFFFFF',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});