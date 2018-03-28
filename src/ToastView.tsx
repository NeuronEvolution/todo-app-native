import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Dispatchable, StandardAction } from './_common/action';
import TimedComponent from './_react_native_common/TimedComponent';
import { commonStyles } from './commonStyles';
import { RootState } from './redux';

const GLOBAL_TOAST_ACTION = 'GLOBAL_TOAST_ACTION';

export interface ToastInfo {
    text: string;
    timestamp: Date;
}

export const onGlobalToast = (text: string): Dispatchable => (dispatch) => {
    dispatch({
        type: GLOBAL_TOAST_ACTION,
        payload: {
            text,
            timestamp: new Date()
        }
    });
};

export const globalToast = (state: ToastInfo, action: StandardAction): ToastInfo => {
    if (state === undefined) {
        return {text: '', timestamp: new Date()};
    }

    switch (action.type) {
        case GLOBAL_TOAST_ACTION:
            return action.payload;
        default:
            return state;
    }
};

class ToastView extends React.Component<ToastInfo> {
    public render() {
        const {width, height} = Dimensions.get('window');
        const text = this.props.text;
        const timestamp = this.props.timestamp;

        return (
            <View
                pointerEvents={'none'}
                style={{
                    position: 'absolute',
                    top: height * 0.1,
                    width,
                    alignItems: 'center'
                }}>
                <TimedComponent
                    timestamp={timestamp}
                    contentElement={
                        <View style={{padding: 10, backgroundColor: '#444', borderRadius: 8}}>
                            <Text style={[commonStyles.text, {color: '#fff'}]}>
                                {text}
                            </Text>
                        </View>
                    }
                    intervalMillSec={2000}
                    visible={text !== ''}
                />
            </View>
        );
    }
}

const selectProps = (rootState: RootState) => ({
    text: rootState.globalToast.text,
    timestamp: rootState.globalToast.timestamp
});

export default connect(selectProps, {})(ToastView);