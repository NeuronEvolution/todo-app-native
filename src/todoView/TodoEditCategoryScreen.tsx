import * as React from 'react';
import {
    Dimensions, FlatList, ListRenderItemInfo, StyleSheet, Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { commonStyles, defaultHeaderTintColor } from '../commonStyles';
import * as GlobalConstants from '../GlobalConstants';
import { apiTodoGetCategoryNameList, RootState } from '../redux';

export interface TodoEditCategoryScreenNavigationParams {
    category: string;
    onBack: (category: string) => void;
}

export interface Props extends NavigationScreenProps<TodoEditCategoryScreenNavigationParams> {
    apiTodoGetCategoryNameList: () => Dispatchable;
    categoryNameList: string[];
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
                    backgroundColor: '#0088FF', borderRadius: 2,
                    justifyContent: 'center', alignItems: 'center'
                }]}
                onPress={() => {
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
                />
                <FlatList
                    keyboardShouldPersistTaps={'always'}
                    data={this.props.categoryNameList}
                    extraData={this.state.category}
                    renderItem={this.renderCategory}
                    keyExtractor={(category: string) => category}
                />
            </View>
        );
    }

    private renderCategory(item: ListRenderItemInfo<string>) {
        const itemCategory = item.item;
        const category = this.state.category;
        if (category === itemCategory) {
            return null;
        }
        if (category && !itemCategory.startsWith(category)) {
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
                    this.onCategoryChanged(itemCategory);
                }}
            >
                <Text style={commonStyles.text}>{itemCategory}</Text>
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
       borderBottomColor: '#eee'
    }
});