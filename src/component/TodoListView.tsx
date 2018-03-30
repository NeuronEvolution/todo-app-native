import * as React from 'react';
import {
    Alert, Dimensions, FlatList, ListRenderItemInfo, Modal, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View
} from 'react-native';
import { fastClick } from '../_common/fastClick';
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
    filterTodoItemGroupSelecting: TodoItemGroup | null;
    filterTodoStatusSelecting: TodoStatus | null;
    filterTodoItemGroup: TodoItemGroup | null;
    filterTodoStatus: TodoStatus | null;
    showFilterPanel: boolean;
    todoCategoryCount: number;
    todoTotalCount: number;
    todoOngoingCount: number;
    todoCompletedCount: number;
    todoDiscardedCount: number;
    todoProgressRatio: string;
}

export default class TodoListView extends React.Component<Props, State> {
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
        this.resetFilter = this.resetFilter.bind(this);
        this.confirmFilterPressed = this.confirmFilterPressed.bind(this);
        this.onFilterStatusSelect = this.onFilterStatusSelect.bind(this);
        this.onItemPress = this.onItemPress.bind(this);

        const initialState: State = {
            filterTodoItemGroupSelecting: null,
            filterTodoStatusSelecting: null,
            filterTodoItemGroup: null,
            filterTodoStatus: null,
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

            if (this.state.filterTodoItemGroup) {
                this.setState({filterTodoItemGroup: null});

                const {category} = this.state.filterTodoItemGroup;
                if (todoListByCategoryNext) {
                    for (const todoItemGroup of todoListByCategoryNext) {
                        if (todoItemGroup.category === category) {
                            this.setState({
                                filterTodoItemGroup: todoItemGroup,
                                filterTodoItemGroupSelecting: todoItemGroup
                            });
                            break;
                        }
                    }
                }
            }
        }
    }

    public render() {
        const {filterTodoItemGroup} = this.state;
        const items = filterTodoItemGroup ? [filterTodoItemGroup] : this.props.todoListByCategory;

        return (
            <View style={[commonStyles.screen]}>
                {this.renderSummary()}
                <FlatList
                    keyboardShouldPersistTaps={'always'}
                    data={items}
                    extraData={this.state.filterTodoStatus}
                    renderItem={this.renderTodoItemGroup}
                    keyExtractor={TodoListView.getItemGroupKey}
                />
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
        const color = this.state.filterTodoItemGroup || this.state.filterTodoStatus ? '#FF8800' : '#fff';

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
        const {filterTodoItemGroupSelecting, filterTodoStatusSelecting} = this.state;
        const currentCategory = filterTodoItemGroupSelecting && filterTodoItemGroupSelecting.category;
        const currentStatus = getTodoStatusName(filterTodoStatusSelecting);

        return (
            <Modal
                onRequestClose={this.closeFilterPanel}
                visible={this.state.showFilterPanel}
                transparent={true}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.filterModal]}
                    onPress={this.closeFilterPanel}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{
                            width: Dimensions.get('window').width - 48,
                            backgroundColor: '#fff'
                        }}
                    >
                        <View style={[styles.filterTitleContainer]}>
                            <Text style={[styles.filterTitleText]}>选择状态:</Text>
                            <Text style={[styles.filterTitleText]}>{currentStatus}</Text>
                        </View>
                        {this.renderFilterStatusContainer()}
                        <View style={commonStyles.line}/>
                        <View style={[styles.filterTitleContainer, {marginTop: 24}]}>
                            <Text style={[styles.filterTitleText]}>选择分类:</Text>
                            <Text style={[styles.filterTitleText]}>{currentCategory}</Text>
                        </View>
                        <View style={commonStyles.line}/>
                        <FlatList
                            keyboardShouldPersistTaps={'always'}
                            style={{height: 270}}
                            data={this.props.todoListByCategory}
                            extraData={{
                                filterTodoItemGroup:
                                this.state.filterTodoItemGroup
                            }}
                            renderItem={this.renderFilterCategory}
                            keyExtractor={(todoItemGroup: TodoItemGroup) => todoItemGroup.category}
                            ItemSeparatorComponent={TodoListView.renderSeparatorLine}
                        />
                        <View style={commonStyles.line}/>
                        {this.renderFilterBottom()}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        );
    }

    private renderFilterStatus(todoStatus: TodoStatus) {
        const status = this.state.filterTodoStatusSelecting;
        const backgroundColor = status === todoStatus ? '#FF8800' : '#fff';
        const color = status === todoStatus ? '#fff' : '#444';

        return (
            <TouchableOpacity
                activeOpacity={1}
                style={[
                    styles.filterStatusButton,
                    {
                        backgroundColor,
                        borderRightWidth: 1,
                        borderRightColor: '#eee'
                    }
                ]}
                onPress={() => {
                    this.onFilterStatusSelect(todoStatus);
                }}
            >
                <Text style={{color}}>{getTodoStatusName(todoStatus)}</Text>
            </TouchableOpacity>
        );
    }

    private renderFilterStatusContainer() {
        return (
            <View style={[commonStyles.flexRow]}>
                {this.renderFilterStatus(TodoStatus.Ongoing)}
                {this.renderFilterStatus(TodoStatus.Completed)}
                {this.renderFilterStatus(TodoStatus.Discard)}
            </View>
        );
    }

    private renderFilterBottom() {
        return (
            <View
                style={[commonStyles.flexRowSpaceBetween]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.filterButton]}
                    onPress={this.resetFilter}
                >
                    <Text style={[styles.filterButtonText, {color: '#0088FF'}]}>
                        重置
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.filterButton, {backgroundColor: '#0088FF'}]}
                    onPress={this.confirmFilterPressed}
                >
                    <Text style={[styles.filterButtonText, {color: '#FFFFFF'}]}>
                        确定
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    private renderFilterCategory(info: ListRenderItemInfo<TodoItemGroup>) {
        const {category, todoItemList} = info.item;
        const todoCount = todoItemList ? todoItemList.length : 0;
        const selected = this.state.filterTodoItemGroupSelecting === info.item;
        const backgroundColor = selected ? '#FF8800' : '#FFFFFFFF';
        const color = selected ? {color: '#fff'} : null;

        return (
            <TouchableHighlight
                underlayColor={'#ddddddFF'}
                onPress={() => {
                    this.onFilterCategorySelect(info.item);
                }}
            >
                <View style={[styles.filterCategoryButton, {backgroundColor}]}>
                    <Text style={[commonStyles.text, color]}>{category}</Text>
                    <Text style={[commonStyles.text, color]}>{todoCount}个计划</Text>
                </View>
            </TouchableHighlight>
        );
    }

    private onFilterCategorySelect(todoItemGroup: TodoItemGroup) {
        this.setState({filterTodoItemGroupSelecting: todoItemGroup});
    }

    private onFilterStatusSelect(todoStatus: TodoStatus) {
        this.setState({
            filterTodoStatusSelecting: todoStatus
        });
    }

    private resetFilter() {
        this.setState({
            filterTodoItemGroupSelecting: null,
            filterTodoStatusSelecting: null
        });
    }

    private confirmFilterPressed() {
        this.closeFilterPanel();

        this.setState({
            filterTodoItemGroup: this.state.filterTodoItemGroupSelecting,
            filterTodoStatus: this.state.filterTodoStatusSelecting
        });
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
                {this.renderCategory(todoItemList, category)}
                {todoItemList ?
                    <FlatList
                        keyboardShouldPersistTaps={'always'}
                        data={todoItemList}
                        extraData={this.state.filterTodoStatus}
                        renderItem={this.renderTodoItem}
                        keyExtractor={TodoListView.getItemKey}
                    />
                    : null}
            </View>
        );
    }

    private renderCategory(todoItemList: TodoItem[], category?: string) {
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
        const statusFilter = this.state.filterTodoStatus;
        switch (statusFilter) {
            case TodoStatus.Ongoing:
                if (ongoingCount === 0) {
                    return null;
                }
                break;
            case TodoStatus.Completed:
                if (completeCount === 0) {
                    return null;
                }
                break;
            case TodoStatus.Discard:
                if (discardCount === 0) {
                    return null;
                }
                break;
            default:
                break;
        }

        return (
            <View style={[styles.category]}>
                <Text style={styles.categoryValueText}>{category}</Text>
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

    private renderTodoItem(itemInfo: ListRenderItemInfo<TodoItem>) {
        const todoItem = itemInfo.item;
        const status = this.state.filterTodoStatus;
        if (status && todoItem.status !== status) {
            return null;
        }

        return (
            <TouchableHighlight
                underlayColor={'#bbb'}
                onPress={() => {
                    this.onItemPress(todoItem);
                }}
                onLongPress={() => {
                    this.onLongPress(todoItem);
                }}>
                <View
                    style={[
                        commonStyles.flexRowSpaceBetween,
                        {
                            paddingHorizontal: 8,
                            borderBottomWidth: 1,
                            borderBottomColor: '#eee'
                        }
                    ]}>
                    <Text style={[commonStyles.text]}>{todoItem.title}</Text>
                    <Text style={[{fontSize: 12}, getTodoStatusTextColor(todoItem.status)]}>
                        {getTodoStatusName(todoItem.status)}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    private onItemPress(todoItem: TodoItem) {
        this.props.onItemPress(todoItem);
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

        if (fastClick()) {
            return;
        }

        const {title, todoId} = todoItem;

        Alert.alert('删除计划？', title, [
            {
                text: '取消',
            },
            {
                text: '确定',
                onPress: () => {
                    this.onRemoveConfirm(todoId);
                }
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
        color: '#008888',
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
        color: '#FF8800',
        fontSize: 12
    },
    filterModal: {
        backgroundColor: '#00000070',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    filterButton: {
        backgroundColor: '#FFFFFFFF',
        paddingHorizontal: 16,
        flex: 1,
        height: 48,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterButtonText: {
        fontSize: 18
    },
    filterTitleContainer: {
        height: 24,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterTitleText: {
        fontSize: 12,
        color: '#008888'
    },
    filterCategoryButton: {
        backgroundColor: '#FFFFFFFF',
        paddingHorizontal: 16,
        height: 48,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterStatusButton: {
        height: 48,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});