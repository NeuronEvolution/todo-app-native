import React from 'react';
import { Text, View } from 'react-native';
import { commonStyles } from '../commonStyles';

export default class AboutScreen extends React.Component<{}> {
    public render() {
        return (
            <View style={[commonStyles.screenCentered, {justifyContent: 'center'}]}>
                <Text style={{fontSize: 20, color: '#008888'}}>
                    地球是人类的摇篮
                </Text>
                <Text style={{
                    fontSize: 20,
                    color: '#FF8800',
                    marginTop: 12,
                    paddingBottom: 96
                }}>
                    但人类不能永远生活在摇篮里
                </Text>
            </View>
        );
    }
}