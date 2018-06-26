import * as React from 'react';
import {
    Dimensions, FlatList, ListRenderItemInfo, StyleSheet, Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { fastClick } from '../_common/fastClick';
import { CategoryInfo } from '../api/todo-private/gen';
import { commonStyles, defaultHeaderTintColor } from '../commonStyles';
import * as GlobalConstants from '../GlobalConstants';
import { apiTodoGetCategoryNameList, RootState } from '../redux';

export interface TodoEditCategoryScreenNavigationParams {
    category: string;
    onBack: (category: string) => void;
}

export interface Props extends NavigationScreenProps<TodoEditCategoryScreenNavigationParams> {
    apiTodoGetCategoryNameList: () => Dispatchable;
    categoryNameList: CategoryInfo[];
}

interface State {
    category: string;
}

let categoryForNavigation: string = '';
const navigationOptionsFunc = ({navigation}: NavigationScreenProps<TodoEditCategoryScreenNavigationParams>) => {
    return {
        headerTintColor: defaultHeaderTintColor,
        headerTitle: '设置分类',
        headerTitleStyle: [commonStyles.stackHeaderText],
        headerStyle: [commonStyles.stackHeader],
        tabBarVisible: false,
        swipeEnabled: false,
        headerRight: (
            <TouchableOpacity
                style={[{
                    marginRight: 8, width: 64, height: 32,
                    backgroundColor: '#008888', borderRadius: 2,
                    justifyContent: 'center', alignItems: 'center'
                }]}
                onPress={() => {
                    if (fastClick()) {
                        return;
                    }

                    navigation.goBack();
                    navigation.state.params.onBack(categoryForNavigation);
                }}>
                <Text style={[{fontSize: 14, color: '#fff'}]}>确定</Text>
            </TouchableOpacity>
        ),
    };
};

class TodoEditCategoryScreen extends React.Component<Props, State> {
    public static navigationOptions = navigationOptionsFunc;

    public componentWillMount() {
        this.onCategoryChanged = this.onCategoryChanged.bind(this);
        this.renderCategory = this.renderCategory.bind(this);

        const navigationParam = this.props.navigation.state.params;
        const category = navigationParam && navigationParam.category;
        this.setState({category});
        categoryForNavigation = category;
    }

    public componentDidMount() {
        this.props.apiTodoGetCategoryNameList();
    }

    public componentWillReceiveProps(nextProps: Props) {
        const navigationParam = this.props.navigation.state.params;
        const category = navigationParam && navigationParam.category;
        const navigationParamNext = nextProps.navigation.state.params;
        const categoryNext = navigationParamNext && navigationParamNext.category;
        if (categoryNext !== category) {
            categoryForNavigation = categoryNext;
        }
    }

    public render() {
        return (
            <View style={[commonStyles.screenCentered]}>
                <TextInput
                    autoFocus={true}
                    underlineColorAndroid={'transparent'}
                    style={[
                        commonStyles.textInput, styles.contentWidth, {marginTop: 24}
                    ]}
                    onChangeText={this.onCategoryChanged}
                    value={this.state.category}
                    placeholder={'最多' + GlobalConstants.MAX_CATEGORY_NAME_LENGTH + '个字符'}
                    maxLength={GlobalConstants.MAX_CATEGORY_NAME_LENGTH}
                />
                <FlatList
                    keyboardShouldPersistTaps={'always'}
                    data={this.props.categoryNameList}
                    extraData={this.state.category}
                    renderItem={this.renderCategory}
                    keyExtractor={(categoryInfo: CategoryInfo) => categoryInfo.category}
                />
            </View>
        );
    }

    private renderCategory(item: ListRenderItemInfo<CategoryInfo>) {
        const {category, todoCount} = item.item;
        const currentCategory = this.state.category;
        if (currentCategory === category) {
            return null;
        }
        if (currentCategory && !category.startsWith(currentCategory)) {
            return null;
        }

        return (
            <TouchableOpacity
                style={[
                    commonStyles.flexRowSpaceBetween,
                    styles.contentWidth,
                    styles.categoryItem
                ]}
                onPress={() => {
                    this.onCategoryChanged(category);
                }}
            >
                <Text style={[{fontSize: 14, color: '#008888'}]}>{category}</Text>
                <Text style={styles.todoCountText}>{todoCount}个计划</Text>
            </TouchableOpacity>
        );
    }

    private onCategoryChanged(category: string) {
        this.setState({category});
        categoryForNavigation = category;
    }
}

const selectProps = (rootState: RootState) => ({
    categoryNameList: rootState.categoryNameList
});

export default connect(selectProps, {
    apiTodoGetCategoryNameList
})(TodoEditCategoryScreen);

const styles = StyleSheet.create({
    contentWidth: {
        maxWidth: 480,
        width: Dimensions.get('window').width - 96
    },
    categoryItem: {
       borderBottomWidth: 1,
       borderBottomColor: '#F8F8F8'
    },
    todoCountText: {
        fontSize: 12,
        color: '#FF8800'
    }
});