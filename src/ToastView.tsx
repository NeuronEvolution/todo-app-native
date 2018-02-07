import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { connect } from 'react-redux';
import TimedComponent from './_react_native_common/TimedComponent';
import { RootState, ToastInfo } from './redux';
import {commonStyles} from './commonStyles';

export interface Props {
    toastInfo: ToastInfo;
}

class ToastView extends React.Component<Props> {
    public render() {
        return (
            <View style={{
                position: 'absolute',
                top: Dimensions.get('window').height * 0.8,
            }}>
                <TimedComponent
                    timestamp={this.props.toastInfo.timestamp}
                    contentElement={
                        <Text style={[commonStyles.text]}>
                            {this.props.toastInfo.text}
                        </Text>
                    }
                    intervalMillSec={5000}
                />
            </View>
        );
    }
}

export default connect((rootState: RootState) => ({toastInfo: rootState.globalToast}), {

})(ToastView);