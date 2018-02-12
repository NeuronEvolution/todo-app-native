import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { connect } from 'react-redux';
import TimedComponent from './_react_native_common/TimedComponent';
import { commonStyles } from './commonStyles';
import { RootState, ToastInfo } from './redux';

export interface Props {
    toastInfo: ToastInfo;
}

class ToastView extends React.Component<Props> {
    public render() {
        return (
            <View style={{
                position: 'absolute',
                top: Dimensions.get('window').height * 0.7,
                alignItems: 'center',
                width: Dimensions.get('window').width
            }}>
                <TimedComponent
                    timestamp={this.props.toastInfo.timestamp}
                    contentElement={
                        <View style={{padding: 10, backgroundColor: '#444', borderRadius: 8}}>
                            <Text style={[commonStyles.text, {color: '#fff'}]}>
                                {this.props.toastInfo.text}
                            </Text>
                        </View>
                    }
                    intervalMillSec={5000}
                    visible={this.props.toastInfo.text !== ''}
                />
            </View>
        );
    }
}

export default connect((rootState: RootState) => ({toastInfo: rootState.globalToast}), {

})(ToastView);