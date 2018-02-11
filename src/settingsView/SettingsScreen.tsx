import * as React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { commonStyles } from '../commonStyles';
import { RootState } from '../redux';
import ToastView from '../ToastView';

export interface Props {
    rootState: RootState;
}

class SettingsScreen extends React.Component<Props> {
    public render() {
        return (
            <View style={[commonStyles.screen]}>
                <ToastView/>
            </View>
        );
    }
}

export default connect((rootState: RootState) => ({rootState}), {

})(SettingsScreen);