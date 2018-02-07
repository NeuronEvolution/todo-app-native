import * as React from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
import { TodoItem, TodoItemGroup } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';

export interface Props {
    todoListByCategory: TodoItemGroup[];
}

export default class TodoListView extends React.Component<Props> {
    public static renderTodoItemGroup(info: ListRenderItemInfo<TodoItemGroup>): JSX.Element {
        return (
            <View style={{}}>
                <View style={{height: 24, backgroundColor: '#ddd'}}>
                    <Text style={styles.categoryText}>
                        {(info.item.category !== undefined && info.item.category !== '')
                            ? info.item.category : '未分类'}
                    </Text>
                </View>
                {info.item.todoItemList ?
                    <FlatList
                        data={info.item.todoItemList}
                        renderItem={(itemInfo: ListRenderItemInfo<TodoItem>) => {
                            return (
                                <View style={{
                                    height: 48
                                }}>
                                    <Text style={{
                                        marginLeft: 8,
                                        marginRight: 8,
                                        marginTop: 12,
                                        fontSize: 24,
                                        alignItems: 'center',
                                        color: '#333'
                                    }}
                                    >
                                        {itemInfo.item.title}
                                    </Text>
                                </View>
                            );
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

    public render() {
        return (
            <FlatList
                data={this.props.todoListByCategory}
                renderItem={(info: ListRenderItemInfo<TodoItemGroup>) => {
                    return TodoListView.renderTodoItemGroup(info);
                }}
                keyExtractor={(item: TodoItemGroup, index: number) =>
                    item.category ? item.category : index.toString()}
                ItemSeparatorComponent={() => <View style={[commonStyles.line]}/>}
            />);
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