import * as React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { fastClick } from '../_common/fastClick';
import AutoComplete from '../_react_native_common/AutoComplete';
import { getTodoListParams, TodoItem, TodoStatus } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import * as GlobalConstants from '../GlobalConstants';
import {
    apiTodoAddTodo, apiTodoGetCategoryNameList, apiTodoGetTodoListByCategory,
    RootState
} from '../redux';
import ToastView, { onGlobalToast } from '../ToastView';

export interface Props extends NavigationScreenProps<void> {
    onGlobalToast: (text: string) => Dispatchable;
    apiTodoAddTodo: (p: TodoItem, onSuccess: () => void) => Dispatchable;
    apiTodoGetTodoListByCategory: (p: getTodoListParams) => Dispatchable;
    apiTodoGetCategoryNameList: () => Dispatchable;
    categoryNameList: string[];
}

interface State {
    category: string;
    title: string;
    desc: string;
}
const initialState = {category: '', title: '', desc: ''};

class TodoAddScreen extends React.Component<Props, State> {
    public componentWillMount() {
        this.onCategoryFocused = this.onCategoryFocused.bind(this);
        this.onCategoryChanged = this.onCategoryChanged.bind(this);
        this.onTitleChanged = this.onTitleChanged.bind(this);
        this.onDescChanged = this.onDescChanged.bind(this);
        this.onAddPressed = this.onAddPressed.bind(this);
        this.onAddSuccess = this.onAddSuccess.bind(this);

        this.setState(initialState);
    }

    public render() {
        return (
            <View style={[commonStyles.screenCentered, {paddingTop: 24, paddingHorizontal: 8}]}>
                <View style={{width: 300}}>
                    {this.renderCategory()}
                    {this.renderTitle()}
                    {this.renderDesc()}
                    {this.renderSummitButton()}
                </View>
                <ToastView/>
            </View>
        );
    }

    private renderCategory(): JSX.Element {
        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[styles.nameText]}>分类</Text>
                <AutoComplete
                    style={[commonStyles.textInput, styles.contentRight]}
                    value={this.state.category}
                    placeholder={'最多' + GlobalConstants.MAX_CATEGORY_NAME_LENGTH + '个字符'}
                    onChangeText={this.onCategoryChanged}
                    items={this.props.categoryNameList}
                    onFocus={this.onCategoryFocused}
                />
            </View>
        );
    }

    private renderTitle(): JSX.Element {
        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[styles.nameText]}>标题</Text>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    style={[commonStyles.textInput, styles.contentRight]}
                    onChangeText={this.onTitleChanged}
                    value={this.state.title}
                    placeholder={'最多' + GlobalConstants.MAX_TITLE_NAME_LENGTH + '个字符'}
                />
            </View>
        );
    }

    private renderDesc(): JSX.Element {
        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[styles.nameText]}>描述</Text>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    style={[commonStyles.textInput, styles.contentRight]}
                    onChangeText={this.onDescChanged}
                    value={this.state.desc}
                    placeholder={'最多' + GlobalConstants.MAX_DESC_TEXT_LENGTH + '个字符'}
                />
            </View>
        );
    }

    private renderSummitButton() {
        return (
            <View style={[commonStyles.flexRowCentered]}>
                <TouchableOpacity
                    style={[commonStyles.windowButton, styles.summitButton]}
                    onPress={this.onAddPressed}>
                    <Text style={[commonStyles.buttonText]}>确定</Text>
                </TouchableOpacity>
            </View>
        );
    }

    private onCategoryChanged(text: string) {
        this.setState({category: text});
    }

    private onTitleChanged(text: string) {
        this.setState({title: text});
    }

    private onDescChanged(text: string) {
        this.setState({desc: text});
    }

    private onCategoryFocused() {
        this.props.apiTodoGetCategoryNameList();
    }

    private onAddSuccess() {
        this.props.apiTodoGetTodoListByCategory({});
        this.props.navigation.goBack();
    }

    private onAddPressed() {
        if (fastClick()) {
            return;
        }

        const {category, title, desc} = this.state;

        this.props.apiTodoAddTodo(
            {
                todoId: '',
                category,
                title,
                desc,
                status: TodoStatus.Ongoing
            },
            this.onAddSuccess);
    }
}

const selectProps = (rootState: RootState) => ({
    categoryNameList: rootState.categoryNameList
});

export default connect(selectProps, {
    onGlobalToast,
    apiTodoAddTodo,
    apiTodoGetTodoListByCategory,
    apiTodoGetCategoryNameList
})(TodoAddScreen);

const styles = StyleSheet.create({
    nameText: {
        color: '#888',
        textAlign: 'center',
        fontSize: 14,
        width: 48
    },
    contentRight: {
        width: 240
    },
    summitButton: {
        marginTop: 24
    }
});