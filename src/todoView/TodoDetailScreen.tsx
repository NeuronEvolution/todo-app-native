import * as React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity , View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import AutoComplete from '../_react_native_common/AutoComplete';
import DropdownList, { Item } from '../_react_native_common/DropdownList';
import {getTodoListParams, TodoItem, TodoStatus} from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import * as GlobalConstants from '../GlobalConstants';
import {
    apiTodoGetCategoryNameList, apiTodoGetTodoListByCategory, apiTodoUpdate, onGlobalToast,
    RootState
} from '../redux';
import ToastView from '../ToastView';
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
        const todoItem: TodoItem = this.props.navigation.state.params.todoItem;
        this.setState({
            todoItem,
            todoItemMutate: {
                todoId: todoItem.todoId,
                category: todoItem.category,
                title: todoItem.title,
                desc: todoItem.desc,
                status: todoItem.status,
                priority: todoItem.priority
            },
            changed: false
        });

        this.onStatusSelected = this.onStatusSelected.bind(this);
        this.onCategoryChanged = this.onCategoryChanged.bind(this);
        this.onTitleChanged = this.onTitleChanged.bind(this);
        this.onDescChanged = this.onDescChanged.bind(this);
        this.onCategoryFocused = this.onCategoryFocused.bind(this);
    }

    public render() {
        return (
            <View style={[commonStyles.screenCentered, {paddingTop: 24, paddingHorizontal: 8}]}>
                <View style={{width: 300}}>
                    <View style={[commonStyles.flexRowLeft]}>
                        <Text style={[commonStyles.text, styles.nameText]}>分类</Text>
                        <AutoComplete
                            style={[commonStyles.textInput, {width: 240}]}
                            value={this.state.todoItemMutate.category}
                            placeholder={'最多' + GlobalConstants.MAX_CATEGORY_NAME_LENGTH + '个字符'}
                            onChangeText={this.onCategoryChanged}
                            items={this.props.categoryNameList}
                            onFocus={this.onCategoryFocused}
                        />
                    </View>
                    <View style={[commonStyles.flexRowLeft]}>
                        <Text style={[commonStyles.text, styles.nameText]}>标题</Text>
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            style={[commonStyles.textInput, {width: 240}]}
                            onChangeText={this.onTitleChanged}
                            value={this.state.todoItemMutate.title}
                            placeholder={'最多' + GlobalConstants.MAX_TITLE_NAME_LENGTH + '个字符'}
                        />
                    </View>
                    <View style={[commonStyles.flexRowLeft]}>
                        <Text style={[commonStyles.text, styles.nameText]}>描述</Text>
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            style={[commonStyles.textInput, {width: 240}]}
                            onChangeText={this.onDescChanged}
                            value={this.state.todoItemMutate.desc}
                            placeholder={'最多' + GlobalConstants.MAX_DESC_TEXT_LENGTH + '个字符'}
                        />
                    </View>
                    <View style={[commonStyles.flexRowLeft]}>
                        <Text style={[commonStyles.text, styles.nameText]}>状态</Text>
                        <DropdownList
                            buttonStyle={{width: 80, alignItems: 'flex-start'}}
                            buttonTextStyle={[
                                getTodoStatusTextColor(this.state.todoItemMutate.status)
                            ]}
                            items={[
                                {label: '进行中', value: TodoStatus.Ongoing},
                                {label: '已完成', value: TodoStatus.Completed},
                                {label: '已放弃', value: TodoStatus.Discard}
                            ]}
                            selectedValue={this.state.todoItemMutate.status}
                            onSelect={this.onStatusSelected}
                        />
                    </View>
                    <View style={[commonStyles.flexRowCentered]}>
                        {this.renderSummitButton()}
                    </View>
                </View>
                <ToastView/>
            </View>
        );
    }

    private renderSummitButton(): JSX.Element {
        return (
            <TouchableOpacity
                style={[
                    commonStyles.button,
                    {width: 300, marginTop: 24},
                    this.state.changed ? null : {backgroundColor: '#eee'}
                ]}
                disabled={!this.state.changed}
                onPress={() => {
                    this.onSummitPressed();
                }}>
                <Text style={[
                    commonStyles.buttonText,
                    this.state.changed ? null : {color: '#aaa'}
                ]}>提交修改</Text>
            </TouchableOpacity>
        );
    }

    private updateChanged(todoItem: TodoItem) {
        const changed =
            todoItem.category !== this.state.todoItem.category
            || todoItem.title !== this.state.todoItem.title
            || todoItem.desc !== this.state.todoItem.desc
            || todoItem.status !== this.state.todoItem.status
            || todoItem.priority !== this.state.todoItem.priority;

        this.setState({changed});
    }

    private onStatusSelected(item: Item) {
        const todoItemMutate = this.state.todoItemMutate;
        todoItemMutate.status = item.value;
        this.setState({
            todoItemMutate
        });

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

    private onSummitPressed() {
        const todoId = this.state.todoItem.todoId;
        if (!todoId) {
            return this.props.onGlobalToast('todoId为空');
        }

        this.props.apiTodoUpdate(
            todoId,
            this.state.todoItemMutate,
            () => {
                this.props.apiTodoGetTodoListByCategory({});
                this.props.navigation.goBack();
            });
    }
}

const selectProps = (rootState: RootState) =>
    ({categoryNameList: rootState.categoryNameList});

export default connect(selectProps, {
    apiTodoUpdate,
    apiTodoGetCategoryNameList,
    onGlobalToast,
    apiTodoGetTodoListByCategory
})(TodoDetailScreen);

const styles = StyleSheet.create({
    nameText: {
        width: 48
    }
});