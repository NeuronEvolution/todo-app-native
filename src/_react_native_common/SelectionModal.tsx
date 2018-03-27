import React from 'react';
import {
    FlatList, ListRenderItemInfo, Modal, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View
} from 'react-native';
import { commonStyles } from '../commonStyles';

export interface SelectionItem {
    label: string;
    value: any;
}

export interface Props {
    items: SelectionItem[];
    visible: boolean;
    onClose: () => void;
    onSelect: (item: SelectionItem) => void;
}

export default class SelectionModal extends React.Component<Props> {
    public componentWillMount() {
        this.renderSelectionItem = this.renderSelectionItem.bind(this);
    }

    public render() {
        return (
            <Modal onRequestClose={this.props.onClose}
                   visible={this.props.visible}
                   transparent={true}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.modal]}
                    onPress={this.props.onClose}>
                    <FlatList
                        contentContainerStyle={{backgroundColor: 'red'}}
                        data={this.props.items}
                        renderItem={this.renderSelectionItem}
                        keyExtractor={(item: SelectionItem) => item.label}
                        ItemSeparatorComponent={() => <View style={commonStyles.line}/>}
                    />
                </TouchableOpacity>
            </Modal>
        );
    }

    private renderSelectionItem(info: ListRenderItemInfo<SelectionItem>) {
        const {label} = info.item;

        return (
            <TouchableHighlight
                underlayColor={'#eee'}
                style={styles.selectionButton}
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
    modal: {
        backgroundColor: '#00000060',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 240
    },
    selectionButton: {
        width: 240,
        height: 48,
        backgroundColor: '#FFFFFFFF',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});