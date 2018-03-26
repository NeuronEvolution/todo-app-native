import * as React from 'react';
import {
    Alert, FlatList, ListRenderItemInfo, Modal, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View
} from 'react-native';
import { TodoItem, TodoItemGroup, TodoStatus } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import { getTodoStatusName, getTodoStatusTextColor } from '../utils';

export interface Props {
    editable: boolean;
    todoListByCategory: TodoItemGroup[];
    onRemoveItem?: (todoId: string) => void;
    onItemPress: (todoItem: TodoItem) => void;
}

interface State {
    filterTodoItemGroup: TodoItemGroup | null;
    showFilterPanel: boolean;
    todoCategoryCount: number;
    todoTotalCount: number;
    todoOngoingCount: number;
    todoCompletedCount: number;
    todoDiscardedCount: number;
    todoProgressRatio: string;
}

export default class TodoListView extends React.Component<Props, State> {
    private static renderCategory(todoItemList: TodoItem[], category?: string) {
        let ongoingCount = 0;
        let completeCount = 0;
        let discardCount = 0;
        if (todoItemList) {
            todoItemList.forEach((todoItem: TodoItem) => {
                switch (todoItem.status) {
                    case TodoStatus.Ongoing:
                        return ongoingCount++;
                    case TodoStatus.Completed:
                        return completeCount++;
                    case TodoStatus.Discard:
                        return discardCount++;
                    default:
                        return;
                }
            });
        }
        const todoCount = ongoingCount + completeCount + discardCount;

        return (
            <View style={[styles.category]}>
                <Text style={styles.categoryText}>{category}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={styles.categoryText}>
                        共
                        <Text style={styles.categoryValueText}>{todoCount}</Text>
                        个计划,
                        <Text style={styles.categoryValueText}>{ongoingCount}</Text>
                        进行中,
                        <Text style={styles.categoryValueText}>{completeCount}</Text>
                        已完成,
                        <Text style={styles.categoryValueText}>{discardCount}</Text>
                        已放弃
                    </Text>
                </View>
            </View>
        );
    }

    private static getItemGroupKey(item: TodoItemGroup, index: number): string {
        return item.category ? item.category : index.toString();
    }

    private static getItemKey(item: TodoItem, index: number) {
        return item.todoId ? item.todoId : index.toString();
    }

    private static renderSeparatorLine() {
        return (
            <View style={[commonStyles.line]}/>
        );
    }

    public componentWillMount() {
        this.renderTodoItemGroup = this.renderTodoItemGroup.bind(this);
        this.renderTodoItem = this.renderTodoItem.bind(this);
        this.onLongPress = this.onLongPress.bind(this);
        this.showFilterPanel = this.showFilterPanel.bind(this);
        this.closeFilterPanel = this.closeFilterPanel.bind(this);
        this.renderFilterCategory = this.renderFilterCategory.bind(this);

        const initialState: State = {
            filterTodoItemGroup: null,
            showFilterPanel: false,
            todoCategoryCount: 0,
            todoTotalCount: 0,
            todoOngoingCount: 0,
            todoCompletedCount: 0,
            todoDiscardedCount: 0,
            todoProgressRatio: '0'
        };
        this.setState(initialState);
    }

    public componentWillReceiveProps(nextProps: Props) {
        const todoListByCategoryOld = this.props.todoListByCategory;
        const todoListByCategoryNext = nextProps.todoListByCategory;
        if (todoListByCategoryNext !== todoListByCategoryOld) {
            this.updateSummary(todoListByCategoryNext);
        }
    }

    public render() {
        const {filterTodoItemGroup} = this.state;
        const items = filterTodoItemGroup ? [filterTodoItemGroup] : this.props.todoListByCategory;

        return (
            <View style={[commonStyles.screen]}>
                {this.renderSummary()}
                <FlatList
                    data={items}
                    renderItem={this.renderTodoItemGroup}
                    keyExtractor={TodoListView.getItemGroupKey}
                    ItemSeparatorComponent={TodoListView.renderSeparatorLine}/>
            </View>
        );
    }

    private updateSummary(todoListByCategory: TodoItemGroup[]) {
        if (!todoListByCategory) {
            return this.setState({
                todoCategoryCount: 0,
                todoTotalCount: 0,
                todoOngoingCount: 0,
                todoCompletedCount: 0,
                todoDiscardedCount: 0,
                todoProgressRatio: '0'
            });
        }

        const todoCategoryCount = todoListByCategory.length;
        let todoOngoingCount = 0;
        let todoCompletedCount = 0;
        let todoDiscardedCount = 0;
        todoListByCategory.forEach((todoItemGroup: TodoItemGroup) => {
            const {todoItemList} = todoItemGroup;
            if (todoItemList) {
                todoItemList.forEach((todoItem: TodoItem) => {
                    switch (todoItem.status) {
                        case TodoStatus.Ongoing:
                            return todoOngoingCount++;
                        case TodoStatus.Completed:
                            return todoCompletedCount++;
                        case TodoStatus.Discard:
                            return todoDiscardedCount++;
                        default:
                            return;
                    }
                });
            }
        });
        const todoTotalCount = todoOngoingCount + todoCompletedCount + todoDiscardedCount;
        const todoProgressRatio = todoTotalCount === 0
            ? '0' : ((todoTotalCount - todoOngoingCount) * 100 / todoTotalCount).toFixed(2);

        this.setState({
            todoCategoryCount,
            todoTotalCount,
            todoOngoingCount,
            todoCompletedCount,
            todoDiscardedCount,
            todoProgressRatio
        });
    }

    private renderSummary() {
        const {
            todoCategoryCount,
            todoTotalCount,
            todoOngoingCount,
            todoDiscardedCount,
            todoCompletedCount,
            todoProgressRatio
        } = this.state;

        return (
            <View style={[commonStyles.flexRowSpaceBetween, styles.summary]}>
                <View style={[{flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}]}>
                    <View style={[{flexDirection: 'row', height: 24, justifyContent: 'center', alignItems: 'center'}]}>
                        <Text style={styles.summaryText}>
                            <Text style={styles.summaryValueText}>{todoCategoryCount}</Text>
                            个分类共
                            <Text style={styles.summaryValueText}>{todoTotalCount}</Text>
                            个计划，完成进度：
                            <Text style={styles.summaryValueText}>{todoProgressRatio}%</Text>
                        </Text>
                    </View>
                    <View style={[{flexDirection: 'row', height: 24, justifyContent: 'center', alignItems: 'center'}]}>
                        <Text style={styles.summaryText}>
                            <Text style={styles.summaryValueText}>{todoOngoingCount}</Text>
                            个进行中，
                            <Text style={styles.summaryValueText}>{todoCompletedCount}</Text>
                            个已完成，
                            <Text style={styles.summaryValueText}>{todoDiscardedCount}</Text>
                            个已放弃
                        </Text>
                    </View>
                </View>
                {this.renderFilterButton()}
            </View>
        );
    }

    private renderFilterButton() {
        const color = this.state.filterTodoItemGroup ? '#ff8800' : '#fff';

        return (
            <TouchableOpacity
                style={{
                    width: 80,
                    height: 48,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                onPress={this.showFilterPanel}
            >
                <Text style={{fontSize: 14, color}}>筛选</Text>
                {this.renderFilterPanel()}
            </TouchableOpacity>
        );
    }

    private renderFilterPanel() {
        const {todoTotalCount} = this.state;

        return (
            <Modal
                onRequestClose={this.closeFilterPanel}
                visible={this.state.showFilterPanel}
                transparent={true}
            >
                <TouchableOpacity
                    style={[{
                        backgroundColor: '#00000050',
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }]}
                    onPress={this.closeFilterPanel}
                >
                    <TouchableHighlight
                        underlayColor={'#eee'}
                        style={[{marginTop: 96}]}
                        onPress={() => {
                            this.onFilterCategorySelect(null);
                        }}
                    >
                        <View style={styles.filterCategoryButton}>
                            <Text style={[commonStyles.text]}>所有分类</Text>
                            <Text style={[commonStyles.text]}>{todoTotalCount}个计划</Text>
                        </View>
                    </TouchableHighlight>
                    <View style={commonStyles.line}/>
                    <FlatList
                        data={this.props.todoListByCategory}
                        renderItem={this.renderFilterCategory}
                        keyExtractor={(todoItemGroup: TodoItemGroup) => todoItemGroup.category}
                        ItemSeparatorComponent={TodoListView.renderSeparatorLine}
                    />
                </TouchableOpacity>
            </Modal>
        );
    }

    private renderFilterCategory(info: ListRenderItemInfo<TodoItemGroup>) {
        const {category, todoItemList} = info.item;
        const todoCount = todoItemList ? todoItemList.length : 0;

        return (
            <TouchableHighlight
                underlayColor={'#eee'}
                onPress={() => {
                    this.onFilterCategorySelect(info.item);
                }}
            >
                <View style={styles.filterCategoryButton}>
                    <Text style={[commonStyles.text]}>{category}</Text>
                    <Text style={[commonStyles.text]}>{todoCount}个计划</Text>
                </View>
            </TouchableHighlight>
        );
    }

    private onFilterCategorySelect(todoItemGroup: TodoItemGroup| null) {
        this.closeFilterPanel();
        this.setState({filterTodoItemGroup: todoItemGroup});
    }

    private showFilterPanel() {
        this.setState({
            showFilterPanel: true
        });
    }

    private closeFilterPanel() {
        this.setState({
            showFilterPanel: false
        });
    }

    private renderTodoItemGroup(info: ListRenderItemInfo<TodoItemGroup>) {
        const {todoItemList, category} = info.item;

        return (
            <View>
                {TodoListView.renderCategory(todoItemList, category)}
                {todoItemList ?
                    <FlatList
                        data={todoItemList}
                        renderItem={this.renderTodoItem}
                        keyExtractor={TodoListView.getItemKey}
                        ItemSeparatorComponent={TodoListView.renderSeparatorLine}/>
                    : null}
            </View>
        );
    }

    private renderTodoItem(itemInfo: ListRenderItemInfo<TodoItem>) {
        const todoItem = itemInfo.item;

        return (
            <TouchableOpacity
                style={[commonStyles.flexRowSpaceBetween, {paddingHorizontal: 8}]}
                onPress={() => {
                    this.props.onItemPress(todoItem);
                }}
                onLongPress={() => {
                    this.onLongPress(todoItem);
                }}>
                <Text style={[commonStyles.text]}>{todoItem.title}</Text>
                <Text style={[{fontSize: 12}, getTodoStatusTextColor(todoItem.status)]}>
                    {getTodoStatusName(todoItem.status)}
                </Text>
            </TouchableOpacity>
        );
    }

    private onRemoveConfirm(todoId: string) {
        if (todoId && this.props.onRemoveItem) {
            this.props.onRemoveItem(todoId);
        }
    }

    private onLongPress(todoItem: TodoItem) {
        if (!this.props.editable) {
            return;
        }

        const {title, todoId} = todoItem;

        Alert.alert('删除计划？', title, [
            {
                text: '确定',
                onPress: () => {
                    this.onRemoveConfirm(todoId);
                }
            },
            {
                text: '取消'
            }
        ]);
    }
}

const styles = StyleSheet.create({
    category: {
        flexDirection: 'row',
        height: 24,
        paddingHorizontal: 8,
        backgroundColor: '#eee',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    categoryText: {
        fontSize: 12,
        color: '#555'
    },
    categoryValueText: {
        fontSize: 12,
        color: '#FF8800',
    },
    summary: {
        paddingHorizontal: 8,
        backgroundColor: '#332200',
    },
    summaryText: {
        color: '#ffffff',
        fontSize: 12
    },
    summaryValueText: {
        color: '#88FF00',
        fontSize: 12
    },
    filterCategoryButton: {
        height: 48,
        width: 280,
        backgroundColor: '#FFFFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16
    }
});