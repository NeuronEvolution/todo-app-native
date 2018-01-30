import * as React from 'react';
import { View } from 'react-native';

export interface Props {
    contentElement: JSX.Element;
    timestamp: Date;
    intervalMillSec: number;
}

interface State {
    timer: number;
    timestamp: Date;
    visible: boolean;
}

export default class TimedComponent extends React.Component<Props, State> {
    public componentWillMount() {
        this.setState({
            timer: 0,
            timestamp: this.props.timestamp,
            visible: false
        });
    }

    public componentWillReceiveProps(nextProps: Props) {
        // may called when props not changed
        if (nextProps.timestamp === this.state.timestamp) {
            return;
        }

        if (this.state.timer != null && this.state.timer !== 0) {
            clearInterval(this.state.timer);
        }

        const t: number = window.setInterval(
            () => {
                if (new Date().getTime() - nextProps.timestamp.getTime() > nextProps.intervalMillSec) {
                    clearInterval(t);
                    this.setState({
                        visible: false,
                        timestamp: nextProps.timestamp,
                        timer: 0
                    });
                }
            },
            200);

        this.setState({
            visible: true,
            timestamp: nextProps.timestamp,
            timer: t,
        });
    }

    public render() {
        return (
            <View>
                {this.state.visible ? this.props.contentElement : null}
            </View>
        );
    }
}
