import React from 'react';
import {
    Dimensions,
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
    title?: string;
    selectedValue?: any;
}

export default class SelectionModal extends React.Component<Props> {
    private static renderTitle(title: string) {
        return (
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.cancelText}>取消</Text>
            </View>
        );
    }

    public componentWillMount() {
        this.renderSelectionItem = this.renderSelectionItem.bind(this);
    }

    public render() {
        const {title, items} = this.props;

        return (
            <Modal onRequestClose={this.props.onClose}
                   visible={this.props.visible}
                   transparent={true}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.modal]}
                    onPress={this.props.onClose}>
                    <View style={{flexDirection: 'column'}}>
                        {title && title !== '' && SelectionModal.renderTitle(title)}
                        <FlatList
                            keyboardShouldPersistTaps={'always'}
                            contentContainerStyle={{backgroundColor: 'red'}}
                            data={items}
                            renderItem={this.renderSelectionItem}
                            keyExtractor={(item: SelectionItem) => item.label}
                            ItemSeparatorComponent={() => <View style={commonStyles.line}/>}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }

    private renderSelectionItem(info: ListRenderItemInfo<SelectionItem>) {
        const {label} = info.item;
        const selected = this.props.selectedValue === info.item.value;
        const backgroundColor = selected ? '#FF8800' : '#FFFFFF';

        return (
            <TouchableHighlight
                underlayColor={'#eee'}
                style={[styles.selectionButton, {backgroundColor}]}
                onPress={() => {
                    this.props.onSelect(info.item);
                    this.props.onClose();
                }}
            >
                <Text style={styles.selectionText}>{label}</Text>
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
    titleContainer: {
        height: 48,
        backgroundColor: '#FFFFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    titleText: {
        fontSize: 18,
        color: '#888'
    },
    cancelText: {
        fontSize: 18,
        color: '#0088FF'
    },
    selectionButton: {
        width: Dimensions.get('window').width - 48,
        height: 48,
        backgroundColor: '#FFFFFFFF',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectionText: {
        fontSize: 14,
        color: '#444'
    }
});