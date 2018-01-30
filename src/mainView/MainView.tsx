import * as React from 'react';
import { FlatList, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { RootState } from '../redux';

export interface Props {
    rootState: RootState;
}

interface State {
    s: string;
}

class MainView extends React.Component<Props, State> {
    public render() {
        return (
            <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    flex: 1,
                }}>
                    <FlatList
                        data={[
                            {key: 'a'},
                            {key: 'a'},
                            {key: 'a'},
                            {key: 'a'},
                            {key: 'a'},
                            {key: 'a'},
                            {key: 'a'},
                        ]}
                        renderItem={({item}) => {
                            return (
                                <Text style={{fontSize: 32, height: 48}}>{item.key}</Text>
                            );
                        }}
                    />
                </View>
            </View>
        );
    }
}

export default connect((rootState: RootState) => ({rootState}), {

})(MainView);