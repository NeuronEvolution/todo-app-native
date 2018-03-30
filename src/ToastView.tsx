import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Dispatchable, StandardAction } from './_common/action';
import TimedComponent from './_react_native_common/TimedComponent';
import { commonStyles } from './commonStyles';
import { RootState } from './redux';

export const TOAST_SLOW = 3000;
export const TOAST_FAST = 1000;

const GLOBAL_TOAST_ACTION = 'GLOBAL_TOAST_ACTION';

export interface ToastInfo {
    text: string;
    timestamp: Date;
    intervalMsec: number;
}

export const onGlobalToast = (text: string, intervalMsec: number): Dispatchable => (dispatch) => {
    dispatch({
        type: GLOBAL_TOAST_ACTION,
        payload: {
            text,
            intervalMsec,
            timestamp: new Date()
        }
    });
};

const initGlobalToast: ToastInfo = {text: '', timestamp: new Date(), intervalMsec: 3000};
export const globalToast = (state: ToastInfo= initGlobalToast, action: StandardAction): ToastInfo => {
    switch (action.type) {
        case GLOBAL_TOAST_ACTION:
            return action.payload;
        default:
            return state;
    }
};

class ToastView extends React.Component<ToastInfo> {
    public render() {
        const {text, timestamp, intervalMsec} = this.props;
        if (!text || text === '') {
            return null;
        }

        const {width, height} = Dimensions.get('window');

        return (
            <View
                pointerEvents={'none'}
                style={{
                    position: 'absolute',
                    top: height * 0.2,
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
                    intervalMillSec={intervalMsec}
                    visible={text !== ''}
                />
            </View>
        );
    }
}

const selectProps = (rootState: RootState) => ({
    text: rootState.globalToast.text,
    timestamp: rootState.globalToast.timestamp,
    intervalMsec: rootState.globalToast.intervalMsec
});

export default connect(selectProps, {})(ToastView);