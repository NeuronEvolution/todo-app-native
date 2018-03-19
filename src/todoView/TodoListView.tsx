import * as React from 'react';
import {
    Alert, FlatList, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { TodoItem, TodoItemGroup } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import { getTodoStatusName, getTodoStatusTextColor } from '../utils';

export interface Props {
    editable: boolean;
    todoListByCategory: TodoItemGroup[];
    onRemoveItem?: (todoId: string) => void;
    onItemPress: (todoItem: TodoItem) => void;
}

export default class TodoListView extends React.Component<Props> {
    private static renderCategory(category?: string): JSX.Element {
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

    private static renderSeparatorLine(): JSX.Element {
        return (
            <View style={[commonStyles.line]}/>
        );
    }

    public componentWillMount() {
        this.renderTodoItemGroup = this.renderTodoItemGroup.bind(this);
        this.renderTodoItem = this.renderTodoItem.bind(this);
        this.onLongPress = this.onLongPress.bind(this);
    }

    public render() {
        return (
            <View>
                <FlatList
                    data={this.props.todoListByCategory}
                    renderItem={this.renderTodoItemGroup}
                    keyExtractor={TodoListView.getItemGroupKey}
                    ItemSeparatorComponent={TodoListView.renderSeparatorLine}/>
            </View>
        );
    }

    private renderTodoItemGroup(info: ListRenderItemInfo<TodoItemGroup>): JSX.Element {
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

    private renderTodoItem(itemInfo: ListRenderItemInfo<TodoItem>): JSX.Element {
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
        backgroundColor: '#eee',
        justifyContent: 'center'
    },
    categoryText: {
        marginLeft: 8,
        marginRight: 8,
        fontSize: 12,
        color: '#555'
    }
});