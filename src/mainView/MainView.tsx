import * as React from 'react';
import {Dimensions, FlatList, Text, View} from 'react-native';
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
        return (<View style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                backgroundColor: '#fff',
                alignItems: 'center'
            }}>
                <View style={{
                    flex: 1,
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
                                {key: 'b'},
                                {key: 'c'},
                                {key: 'd'},
                                {key: 'e'},
                                {key: 'f'},
                                {key: 'g'},
                            ]}
                            renderItem={({item}) => {
                                return (
                                    <Text style={{fontSize: 32, height: 48}}>{item.key}</Text>
                                );
                            }}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

export default connect((rootState: RootState) => ({rootState}), {

})(MainView);