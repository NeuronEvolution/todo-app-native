import React from 'react';
import {
    FlatList, ListRenderItemInfo, Modal, StyleSheet, Text, TouchableHighlight, TouchableOpacity,
    View
} from 'react-native';
import { TodoVisibility } from '../api/todo-private/gen';
import { commonStyles } from '../commonStyles';
import { getTodoVisibilityName } from '../utils';

export interface Props {
    visible: boolean;
    onClose: () => void;
    onSelect: (todoVisibility: TodoVisibility) => void;
}

export default class VisibilitySelectionModal extends React.Component<Props> {
    public componentWillMount() {
        this.renderSelectionItem = this.renderSelectionItem.bind(this);
    }

    public render() {
        return (
            <Modal onRequestClose={this.props.onClose}
                   visible={this.props.visible}
                   transparent={true}>
                <TouchableOpacity
                    style={[{
                        backgroundColor: '#00000050',
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 240
                    }]}
                    onPressIn={this.props.onClose}
                >
                    <FlatList
                        data={[TodoVisibility.Public, TodoVisibility.Friend, TodoVisibility.Private]}
                        renderItem={this.renderSelectionItem}
                        keyExtractor={(todoVisibility: TodoVisibility) => getTodoVisibilityName(todoVisibility)}
                        ItemSeparatorComponent={() => <View style={commonStyles.line}/>}
                    />
                </TouchableOpacity>
            </Modal>
        );
    }

    private renderSelectionItem(info: ListRenderItemInfo<TodoVisibility>) {
        const label = getTodoVisibilityName(info.item);

        return (
            <TouchableHighlight
                underlayColor={'#eee'}
                style={styles.visibilityButton}
                onPress={() => {
                    this.props.onSelect(info.item);
                    this.props.onClose();
                }}
            >
                <Text style={commonStyles.text}>{label}</Text>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    visibilityButton: {
        width: 240,
        height: 48,
        backgroundColor: '#FFFFFFFF',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});