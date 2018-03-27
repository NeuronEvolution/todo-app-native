import * as React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { fastClick } from '../_common/fastClick';
import { getTodoListParams, TodoItem, TodoStatus } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import * as GlobalConstants from '../GlobalConstants';
import {
    apiTodoAddTodo, apiTodoGetCategoryNameList, apiTodoGetTodoListByCategory,
    RootState
} from '../redux';
import ToastView, { onGlobalToast } from '../ToastView';
import { TodoEditCategoryScreenNavigationParams } from './TodoEditCategoryScreen';

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
        this.onCategoryPress = this.onCategoryPress.bind(this);

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

    private renderCategory() {
        const {category} = this.state;
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
        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[styles.nameText]}>标题</Text>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    style={[commonStyles.textInput, styles.contentWidth]}
                    onChangeText={this.onTitleChanged}
                    value={this.state.title}
                    placeholder={'最多' + GlobalConstants.MAX_TITLE_NAME_LENGTH + '个字符'}
                />
            </View>
        );
    }

    private renderDesc() {
        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[styles.nameText]}>描述</Text>
                <TextInput
                    underlineColorAndroid={'transparent'}
                    style={[commonStyles.textInput, styles.contentWidth]}
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

    private onCategoryPress() {
        const {category} = this.state;
        const params: TodoEditCategoryScreenNavigationParams = {
            category,
            onBack: this.onCategoryChanged
        };
        this.props.navigation.navigate('TodoEditCategory', params);
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
        if (!category || category === '') {
            return this.props.onGlobalToast('分类不能为空');
        }
        if (!title || title === '') {
            return this.props.onGlobalToast('标题不能为空');
        }

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