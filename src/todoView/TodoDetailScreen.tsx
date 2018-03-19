import * as React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity , View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import AutoComplete from '../_react_native_common/AutoComplete';
import DropdownList, { Item } from '../_react_native_common/DropdownList';
import { getTodoListParams, TodoItem, TodoStatus } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import * as GlobalConstants from '../GlobalConstants';
import {
    apiTodoGetCategoryNameList, apiTodoGetTodoListByCategory, apiTodoUpdate,
    RootState
} from '../redux';
import ToastView, { onGlobalToast } from '../ToastView';
import { getTodoStatusTextColor } from '../utils';

export interface Props extends NavigationScreenProps<{todoItem: TodoItem}> {
    apiTodoUpdate: (todoId: string, todoItemMutate: TodoItem, onSuccess: () => void) => Dispatchable;
    apiTodoGetCategoryNameList: () => Dispatchable;
    apiTodoGetTodoListByCategory: (p: getTodoListParams) => Dispatchable;
    onGlobalToast: (text: string) => Dispatchable;
    categoryNameList: string[];
}

interface State {
    todoItem: TodoItem;
    todoItemMutate: TodoItem;
    changed: boolean;
}

class TodoDetailScreen extends React.Component<Props, State> {
    public componentWillMount() {
        this.onStatusSelected = this.onStatusSelected.bind(this);
        this.onCategoryChanged = this.onCategoryChanged.bind(this);
        this.onTitleChanged = this.onTitleChanged.bind(this);
        this.onDescChanged = this.onDescChanged.bind(this);
        this.onCategoryFocused = this.onCategoryFocused.bind(this);
        this.onSummitPressed = this.onSummitPressed.bind(this);
        this.renderCategory = this.renderCategory.bind(this);
        this.renderTitle = this.renderTitle.bind(this);
        this.renderDesc = this.renderDesc.bind(this);
        this.renderStatus = this.renderStatus.bind(this);
        this.renderSummitButton = this.renderSummitButton.bind(this);
        this.onUpdateSuccess = this.onUpdateSuccess.bind(this);

        const todoItem: TodoItem = this.props.navigation.state.params.todoItem;
        const {todoId, category, title, desc, status, priority} = todoItem;
        this.setState({
            todoItem,
            todoItemMutate: {todoId, category, title, desc, status, priority},
            changed: false
        });
    }

    public render() {
        return (
            <View style={[commonStyles.screenCentered, {paddingTop: 24, paddingHorizontal: 8}]}>
                <View style={{width: 300}}>
                    {this.renderCategory()}
                    {this.renderTitle()}
                    {this.renderDesc()}
                    {this.renderStatus()}
                    {this.renderSummitButton()}
                </View>
                <ToastView/>
            </View>
        );
    }

    private renderCategory(): JSX.Element {
        const category = this.state.todoItemMutate.category;

        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[commonStyles.text, styles.nameText]}>分类</Text>
                <AutoComplete
                    style={[commonStyles.textInput, styles.contentRight]}
                    value={category}
                    placeholder={'最多' + GlobalConstants.MAX_CATEGORY_NAME_LENGTH + '个字符'}
                    onChangeText={this.onCategoryChanged}
                    items={this.props.categoryNameList}
                    onFocus={this.onCategoryFocused}/>
            </View>
        );
    }

    private renderTitle(): JSX.Element {
        const title = this.state.todoItemMutate.title;

        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[commonStyles.text, styles.nameText]}>标题</Text>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    style={[commonStyles.textInput, styles.contentRight]}
                    onChangeText={this.onTitleChanged}
                    value={title}
                    placeholder={'最多' + GlobalConstants.MAX_TITLE_NAME_LENGTH + '个字符'}/>
            </View>
        );
    }

    private renderDesc(): JSX.Element {
        const desc = this.state.todoItemMutate.desc;

        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[commonStyles.text, styles.nameText]}>描述</Text>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    style={[commonStyles.textInput, styles.contentRight]}
                    onChangeText={this.onDescChanged}
                    value={desc}
                    placeholder={'最多' + GlobalConstants.MAX_DESC_TEXT_LENGTH + '个字符'}/>
            </View>
        );
    }

    private renderStatus(): JSX.Element {
        const status = this.state.todoItemMutate.status;

        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[commonStyles.text, styles.nameText]}>状态</Text>
                <DropdownList
                    buttonStyle={{width: 80, alignItems: 'flex-start'}}
                    buttonTextStyle={[getTodoStatusTextColor(status)]}
                    items={[
                        {label: '进行中', value: TodoStatus.Ongoing},
                        {label: '已完成', value: TodoStatus.Completed},
                        {label: '已放弃', value: TodoStatus.Discard}
                    ]}
                    selectedValue={status}
                    onSelect={this.onStatusSelected}/>
            </View>
        );
    }

    private renderSummitButton(): JSX.Element {
        const backgroundColor = this.state.changed ? null : {backgroundColor: '#eee'};
        const color = this.state.changed ? null : {color: '#aaa'};

        return (
            <View style={[commonStyles.flexRowCentered]}>
                <TouchableOpacity
                    style={[commonStyles.windowButton, styles.summitButton, backgroundColor]}
                    disabled={!this.state.changed}
                    onPress={this.onSummitPressed}>
                    <Text style={[commonStyles.buttonText, color]}>提交修改</Text>
                </TouchableOpacity>
            </View>
        );
    }

    private updateChanged(todoItem: TodoItem) {
        const {category, title, desc, status, priority} = this.state.todoItem;

        const changed =
            todoItem.category !== category
            || todoItem.title !== title
            || todoItem.desc !== desc
            || todoItem.status !== status
            || todoItem.priority !== priority;

        this.setState({changed});
    }

    private onStatusSelected(item: Item) {
        const todoItemMutate = this.state.todoItemMutate;
        todoItemMutate.status = item.value;
        this.setState({todoItemMutate});
        this.updateChanged(todoItemMutate);
    }

    private onCategoryChanged(text: string) {
        const todoItemMutate = this.state.todoItemMutate;
        todoItemMutate.category = text;
        this.setState({todoItemMutate});
        this.updateChanged(todoItemMutate);
    }

    private onTitleChanged(text: string) {
        const todoItemMutate = this.state.todoItemMutate;
        todoItemMutate.title = text;
        this.setState({todoItemMutate});
        this.updateChanged(todoItemMutate);
    }

    private onDescChanged(text: string) {
        const todoItemMutate = this.state.todoItemMutate;
        todoItemMutate.desc = text;
        this.setState({todoItemMutate});
        this.updateChanged(todoItemMutate);
    }

    private onCategoryFocused() {
        this.props.apiTodoGetCategoryNameList();
    }

    private onUpdateSuccess() {
        this.props.apiTodoGetTodoListByCategory({});
        this.props.navigation.goBack();
    }

    private onSummitPressed() {
        const todoId = this.state.todoItem.todoId;
        if (!todoId) {
            return this.props.onGlobalToast('todoId为空');
        }

        this.props.apiTodoUpdate(todoId, this.state.todoItemMutate, this.onUpdateSuccess);
    }
}

const selectProps = (rootState: RootState) => ({
    categoryNameList: rootState.categoryNameList
});

export default connect(selectProps, {
    apiTodoUpdate,
    apiTodoGetCategoryNameList,
    onGlobalToast,
    apiTodoGetTodoListByCategory
})(TodoDetailScreen);

const styles = StyleSheet.create({
    nameText: {
        width: 48
    },
    contentRight: {
        width: 240
    },
    summitButton: {
        marginTop: 24
    }
});