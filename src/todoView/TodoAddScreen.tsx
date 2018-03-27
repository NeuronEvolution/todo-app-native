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
        this.onCategoryFocus = this.onCategoryFocus.bind(this);

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
            ? '点击选择或新建分类' : category;
        const color = category === '' ? '#ccc' : '#444';

        return (
            <View style={[commonStyles.flexRowLeft]}>
                <Text style={[styles.nameText]}>分类</Text>
                <TouchableOpacity
                    style={[
                        styles.contentRight,
                        {
                            alignItems: 'flex-start',
                            height: 48,
                            flex: 1,
                            justifyContent: 'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#eee'
                        }
                    ]}
                    onPress={this.onCategoryFocus}
                >
                    <Text
                        style={[commonStyles.text, {color}]}
                    >{text}</Text>
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
                    style={[commonStyles.textInput, styles.contentRight]}
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
                    style={[commonStyles.textInput, styles.contentRight]}
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

    private onCategoryFocus() {
        this.props.navigation.navigate('TodoEditCategory');
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
    contentRight: {
        width: 240
    },
    summitButton: {
        marginTop: 24
    }
});