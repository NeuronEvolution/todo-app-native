import * as React from 'react';
import { Text } from 'react-native';

interface Props {
    s: string;
}

interface State {
    phone: string;
}

export default class SignupView extends React.Component<Props, State> {
    public render() {
        return (
            <Text>ss</Text>
        );
    }
}