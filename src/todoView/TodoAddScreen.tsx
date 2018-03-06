import * as React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import AutoComplete from '../_react_native_common/AutoComplete';
import { getTodoListParams, TodoItem, TodoStatus } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import * as GlobalConstants from '../GlobalConstants';
import {
    apiTodoAddTodo, apiTodoGetCategoryNameList, apiTodoGetTodoListByCategory, onGlobalToast,
    RootState
} from '../redux';
import ToastView from '../ToastView';

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

class TodoAddScreen extends React.Component<Props, State> {
    public componentWillMount() {
        this.setState({
            category: '',
            title: ''
        });

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
                            value={this.state.category}
                            placeholder={'最多' + GlobalConstants.MAX_CATEGORY_NAME_LENGTH + '个字符'}
                            onChangeText={(text) => {
                                this.setState({category: text});
                            }}
                            items={this.props.categoryNameList}
                            onFocus={this.onCategoryFocused}
                        />
                    </View>
                    <View style={[commonStyles.flexRowLeft]}>
                        <Text style={[commonStyles.text, styles.nameText]}>标题</Text>
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            style={[commonStyles.textInput, {width: 240}]}
                            onChangeText={(text) => {
                                this.setState({title: text});
                            }}
                            value={this.state.title}
                            placeholder={'最多' + GlobalConstants.MAX_TITLE_NAME_LENGTH + '个字符'}
                        />
                    </View>
                    <View style={[commonStyles.flexRowLeft]}>
                        <Text style={[commonStyles.text, styles.nameText]}>描述</Text>
                        <TextInput
                            underlineColorAndroid={'transparent'}
                            style={[commonStyles.textInput, {width: 240}]}
                            onChangeText={(text) => {
                                this.setState({desc: text});
                            }}
                            value={this.state.desc}
                            placeholder={'最多' + GlobalConstants.MAX_DESC_TEXT_LENGTH + '个字符'}
                        />
                    </View>
                    <View style={[commonStyles.flexRowCentered]}>
                        <TouchableOpacity
                            style={[commonStyles.button, {width: 300, marginTop: 24}]}
                            onPress={() => {
                                this.onAddPressed();
                            }}>
                            <Text style={[commonStyles.buttonText]}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ToastView/>
            </View>
        );
    }

    private onCategoryFocused() {
        this.props.apiTodoGetCategoryNameList();
    }

    private onAddPressed() {
        if (this.state.category === '未分类') {
            return this.props.onGlobalToast('请使用别的分类名称');
        }

        this.props.apiTodoAddTodo(
            {
                todoId: '',
                category: this.state.category,
                title: this.state.title,
                desc: this.state.desc,
                status: TodoStatus.Ongoing
            },
            () => {
                this.props.apiTodoGetTodoListByCategory({});
                this.props.navigation.goBack();
            });
    }
}

const selectProps = (rootState: RootState) =>
    ({categoryNameList: rootState.categoryNameList});

export default connect(selectProps, {
    onGlobalToast,
    apiTodoAddTodo,
    apiTodoGetTodoListByCategory,
    apiTodoGetCategoryNameList
})(TodoAddScreen);

const styles = StyleSheet.create({
    nameText: {
        width: 48
    }
});