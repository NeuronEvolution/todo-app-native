import * as React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity , View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import SelectionModal, { SelectionItem } from '../_react_native_common/SelectionModal';
import { getTodoListParams, TodoItem, TodoStatus } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import * as GlobalConstants from '../GlobalConstants';
import {
    apiTodoGetCategoryNameList, apiTodoGetTodoListByCategory, apiTodoUpdate,
    RootState
} from '../redux';
import ToastView, { onGlobalToast } from '../ToastView';
import { getTodoStatusName } from '../utils';
import { TodoEditCategoryScreenNavigationParams } from './TodoEditCategoryScreen';

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
    showStatusSelection: boolean;
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
        this.showStatusSelection = this.showStatusSelection.bind(this);
        this.closeStatusSelection = this.closeStatusSelection.bind(this);
        this.onStatusSelected = this.onStatusSelected.bind(this);
        this.onCategoryPress = this.onCategoryPress.bind(this);

        const todoItem: TodoItem = this.props.navigation.state.params.todoItem;
        const {todoId, category, title, desc, status, priority} = todoItem;
        const initialState: State = {
            todoItem,
            todoItemMutate: {todoId, category, title, desc, status, priority},
            changed: false,
            showStatusSelection: false
        };
        this.setState(initialState);
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

    private renderCategory() {
        const {category} = this.state.todoItemMutate;
        const text = category === ''
            ? '点击设置该计划的分类' : category;
        const color = category === '' ? '#ccc' : '#444';

        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[styles.nameText]}>分类</Text>
                <TouchableOpacity
                    style={[styles.contentButton]}
                    onPress={this.onCategoryPress}
                >
                    <Text style={[commonStyles.text, {color}]}>
                        {text}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    private renderTitle() {
        const title = this.state.todoItemMutate.title;

        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[styles.nameText]}>标题</Text>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    style={[commonStyles.textInput, styles.contentWidth]}
                    onChangeText={this.onTitleChanged}
                    value={title}
                    placeholder={'最多' + GlobalConstants.MAX_TITLE_NAME_LENGTH + '个字符'}/>
            </View>
        );
    }

    private renderDesc() {
        const desc = this.state.todoItemMutate.desc;

        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[styles.nameText]}>描述</Text>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    style={[commonStyles.textInput, styles.contentWidth]}
                    onChangeText={this.onDescChanged}
                    value={desc}
                    placeholder={'最多' + GlobalConstants.MAX_DESC_TEXT_LENGTH + '个字符'}/>
            </View>
        );
    }

    private renderStatus() {
        const status = this.state.todoItemMutate.status;

        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[styles.nameText]}>状态</Text>
                <TouchableOpacity
                    style={[styles.contentButton]}
                    onPress={this.showStatusSelection}
                >
                    <Text style={[commonStyles.text]}>{getTodoStatusName(status)}</Text>
                </TouchableOpacity>
                <SelectionModal
                    title={'选择计划状态'}
                    items={[
                        {label: getTodoStatusName(TodoStatus.Ongoing), value: TodoStatus.Ongoing},
                        {label: getTodoStatusName(TodoStatus.Completed), value: TodoStatus.Completed},
                        {label: getTodoStatusName(TodoStatus.Discard), value: TodoStatus.Discard}
                    ]}
                    visible={this.state.showStatusSelection}
                    onClose={this.closeStatusSelection}
                    onSelect={this.onStatusSelected}/>
            </View>
        );
    }

    private renderSummitButton() {
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

    private onCategoryPress() {
        const {category} = this.state.todoItemMutate;
        const params: TodoEditCategoryScreenNavigationParams = {
            category,
            onBack: this.onCategoryChanged
        };
        this.props.navigation.navigate('TodoEditCategory', params);
    }

    private showStatusSelection() {
        this.setState({showStatusSelection: true});
    }

    private closeStatusSelection() {
        this.setState({showStatusSelection: false});
    }

    private onStatusSelected(item: SelectionItem): void {
        const todoItemMutate = this.state.todoItemMutate;
        todoItemMutate.status = item.value;
        this.setState({todoItemMutate});
        this.updateChanged(todoItemMutate);
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

        const {category, title, status} = this.state.todoItemMutate;
        if (!category || category === '') {
            return this.props.onGlobalToast('分类不能为空');
        }
        if (!title || title === '') {
            return this.props.onGlobalToast('标题不能为空');
        }
        if (!status) {
            return this.props.onGlobalToast('状态不能为空');
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
        color: '#888',
        textAlign: 'center',
        fontSize: 14,
        width: 48
    },
    contentWidth: {
        width: 240
    },
    contentButton: {
        width: 240,
        alignItems: 'flex-start',
        height: 48,
        flex: 1,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    summitButton: {
        marginTop: 24
    }
});