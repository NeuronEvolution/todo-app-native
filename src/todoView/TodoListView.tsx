import * as React from 'react';
import {
    Alert, FlatList, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View
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
    todoTotalCount: number;
    todoOngoingCount: number;
    todoCompletedCount: number;
    todoDiscardedCount: number;
    todoProgressRatio: string;
}
const initialState: State = {
    todoTotalCount: 0,
    todoOngoingCount: 0,
    todoCompletedCount: 0,
    todoDiscardedCount: 0,
    todoProgressRatio: '0'
};

export default class TodoListView extends React.Component<Props, State> {
    private static renderCategory(category?: string) {
        return (
            <View style={[styles.category]}>
                <Text style={styles.categoryText}>{category}</Text>
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
        return (
            <View>
                {this.renderSummary()}
                <FlatList
                    data={this.props.todoListByCategory}
                    renderItem={this.renderTodoItemGroup}
                    keyExtractor={TodoListView.getItemGroupKey}
                    ItemSeparatorComponent={TodoListView.renderSeparatorLine}/>
            </View>
        );
    }

    private updateSummary(todoListByCategory: TodoItemGroup[]) {
        if (!todoListByCategory) {
            return this.setState({
                todoTotalCount: 0,
                todoOngoingCount: 0,
                todoCompletedCount: 0,
                todoDiscardedCount: 0,
                todoProgressRatio: '0'
            });
        }

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
        const todoProgressRatio = ((todoTotalCount - todoOngoingCount) * 100 / todoTotalCount).toFixed(2);

        this.setState({
            todoTotalCount,
            todoOngoingCount,
            todoCompletedCount,
            todoDiscardedCount,
            todoProgressRatio
        });
    }

    private renderSummary() {
        const {
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
                        <Text style={styles.summaryText}>共</Text>
                        <Text style={styles.summaryValueText}>{todoTotalCount}</Text>
                        <Text style={styles.summaryText}>个计划，完成进度：</Text>
                        <Text style={styles.summaryValueText}>{todoProgressRatio}%</Text>
                    </View>
                    <View style={[{flexDirection: 'row', height: 24, justifyContent: 'center', alignItems: 'center'}]}>
                        <Text style={styles.summaryValueText}>{todoOngoingCount}</Text>
                        <Text style={styles.summaryText}>个进行中，</Text>
                        <Text style={styles.summaryValueText}>{todoCompletedCount}</Text>
                        <Text style={styles.summaryText}>个已完成，</Text>
                        <Text style={styles.summaryValueText}>{todoDiscardedCount}</Text>
                        <Text style={styles.summaryText}>个已放弃</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.summaryText}>筛选</Text>
                </View>
            </View>
        );
    }

    private renderTodoItemGroup(info: ListRenderItemInfo<TodoItemGroup>) {
        const data = info.item.todoItemList;

        return (
            <View>
                {TodoListView.renderCategory(info.item.category)}
                {data ?
                    <FlatList
                        data={data}
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
        height: 24,
        paddingHorizontal: 8,
        backgroundColor: '#eee',
        justifyContent: 'center'
    },
    categoryText: {
        fontSize: 12,
        color: '#555'
    },
    summary: {
        paddingHorizontal: 8,
        backgroundColor: '#884400',
    },
    summaryText: {
        color: '#ffffff',
        fontSize: 12
    },
    summaryValueText: {
        color: '#FF8800',
        fontSize: 12
    }
});