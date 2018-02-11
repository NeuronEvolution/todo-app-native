import * as React from 'react';
import {
    Alert, FlatList, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { TodoItem, TodoItemGroup } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';

export interface Props {
    editable: boolean;
    todoListByCategory: TodoItemGroup[];
    onRemoveItem?: (todoId: string) => void;
    onItemPress: (todoItem: TodoItem) => void;
}

export default class TodoListView extends React.Component<Props> {
    public static renderCategory(category?: string): JSX.Element {
        return (
            <View style={{height: 24, backgroundColor: '#eee'}}>
                <Text style={styles.categoryText}>
                    {(category && category !== '')
                        ? category : '未分类'}
                </Text>
            </View>
        );
    }

    public render() {
        return (
            <View>
                <FlatList
                    data={this.props.todoListByCategory}
                    renderItem={(info: ListRenderItemInfo<TodoItemGroup>) => {
                        return this.renderTodoItemGroup(info);
                    }}
                    keyExtractor={(item: TodoItemGroup, index: number) =>
                        item.category ? item.category : index.toString()}
                    ItemSeparatorComponent={() => <View style={[commonStyles.line]}/>}
                />
            </View>
        );
    }

    private renderTodoItemGroup(info: ListRenderItemInfo<TodoItemGroup>): JSX.Element {
        return (
            <View>
                {TodoListView.renderCategory(info.item.category)}
                {info.item.todoItemList ?
                    <FlatList
                        data={info.item.todoItemList}
                        renderItem={(itemInfo: ListRenderItemInfo<TodoItem>) => {
                            return this.renderTodoItem(itemInfo.item);
                        }}
                        keyExtractor={(item: TodoItem, index: number) =>
                            item.todoId ? item.todoId : index.toString()}
                        ItemSeparatorComponent={() => <View style={{
                            height: 1,
                            backgroundColor: '#eee'
                        }}/>}
                    /> : null}
            </View>
        );
    }

    private renderTodoItem(todoItem: TodoItem): JSX.Element {
        return (
            <TouchableOpacity
                style={[{height: 48}]}
                onPress={() => {
                    this.props.onItemPress(todoItem);
                }}
                onLongPress={() => {
                    this.onLongPress(todoItem);
                }}
            >
                <Text style={[{marginLeft: 8, marginRight: 8, marginTop: 16, fontSize: 16, color: '#333'}]}
                >
                    {todoItem.title}
                </Text>
            </TouchableOpacity>
        );
    }

    private onLongPress(todoItem: TodoItem) {
        if (!this.props.editable) {
            return;
        }

        Alert.alert('删除计划？', todoItem.title, [
            {
                text: '确定',
                onPress: () => {
                    if (todoItem.todoId && this.props.onRemoveItem) {
                        this.props.onRemoveItem(todoItem.todoId);
                    }
                }
            },
            {
                text: '取消'
            }
        ]);
    }
}

const styles = StyleSheet.create({
    categoryText: {
        marginTop: 6,
        marginLeft: 8,
        marginRight: 8,
        fontSize: 12,
        color: '#555'
    }
});