import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { commonStyles } from '../commonStyles';

export default class HelpScreen extends React.Component<NavigationScreenProps<void>> {
    public render() {
        return (
            <View
                style={[commonStyles.screenCentered, {justifyContent: 'center'}]}
                onTouchEnd={() => {
                    this.props.navigation.goBack();
                }}
            >
                <Text style={{
                    fontSize: 36,
                    color: '#FF8800',
                    paddingBottom: 96
                }}>
                    敬请期待
                </Text>
            </View>
        );
    }
}