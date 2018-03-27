import * as React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import { commonStyles } from '../commonStyles';
import { apiTodoGetCategoryNameList } from '../redux';

export interface Props {
    apiTodoGetCategoryNameList: () => Dispatchable;
}

class TodoEditCategoryScreen extends React.Component<Props> {
    public componentWillMount() {
        this.props.apiTodoGetCategoryNameList();
    }

    public render() {
        return (
            <View style={[commonStyles.screen]}>
            </View>
        );
    }
}

export default connect(null, {
    apiTodoGetCategoryNameList
})(TodoEditCategoryScreen);