import * as React from 'react';
import {
    FlatList, GestureResponderEvent, ListRenderItemInfo,
    Modal, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, UIManager, View, ViewStyle
} from 'react-native';
import { commonStyles } from '../commonStyles';

export interface Item {
    label: string;
    value: any;
}

export interface Props {
    items: Item[];
    selectedIndex?: number;
    selectedValue?: any;
    buttonStyle: StyleProp<ViewStyle>;
    buttonTextStyle?: StyleProp<TextStyle>;
    onSelect: (item: Item, index: number) => void;
}

interface State {
    visible: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    selectedIndex: number;
    selectedItem: Item | null;
}

export default class DropdownList extends React.Component<Props, State> {
    public componentWillMount() {
        const selectedIndex = this.props.selectedIndex !== undefined ? this.props.selectedIndex : -1;
        let selectedItem = this.props.selectedIndex !== undefined ? this.props.items[this.props.selectedIndex] : null;
        if (this.props.selectedValue !== undefined) {
            this.props.items.forEach((v) => {
                if (v.value === this.props.selectedValue) {
                    selectedItem = v;
                }
            });
        }

        this.setState({
            visible: false,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            selectedIndex,
            selectedItem
        });

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    public render() {
        return (
            <View>
                <TouchableOpacity
                    style={[
                        styles.defaultButton,
                        this.props.buttonStyle
                    ]}
                    onPress={this.openModal}>
                    <View pointerEvents={'none'}>
                        <Text style={[styles.defaultButtonText, this.props.buttonTextStyle]}>
                            {this.state.selectedItem ? this.state.selectedItem.label : null}
                        </Text>
                    </View>
                </TouchableOpacity>
                <Modal onRequestClose={this.closeModal} visible={this.state.visible} transparent={true}>
                    <TouchableOpacity style={[{flex: 1}]} onPress={this.closeModal}>
                        <FlatList
                            keyboardShouldPersistTaps={'always'}
                            style={[
                                {
                                    position: 'absolute',
                                    left: this.state.x,
                                    top: this.state.y + this.state.height,
                                },
                                styles.defaultBorder
                            ]}
                            data={this.props.items}
                            renderItem={this.renderItem}
                            keyExtractor={(item: Item) => {
                                return item.label;
                            }}
                            ItemSeparatorComponent={() => <View style={[commonStyles.line]}/>}
                        />
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    }

    private openModal(e: GestureResponderEvent) {
        UIManager.measureInWindow(e.target, (x, y, width, height) => {
            this.setState({visible: true, x, y, width, height});
        });
    }

    private closeModal() {
        this.setState({visible: false});
    }

    private onSelect(index: number, item: Item) {
        this.setState({
            selectedIndex: index,
            selectedItem: item
        });

        this.props.onSelect(item, index);

        this.closeModal();
    }

    private renderItem(info: ListRenderItemInfo<Item>): JSX.Element {
        return (
            <TouchableOpacity
                style={[
                    {width: this.state.width - 2 * defaultBorderWidth},
                    styles.defaultItem
                ]}
                onPress={() => {
                    this.onSelect(info.index, info.item);
                }}
            >
                <Text
                    style={[
                        styles.defaultItemText
                    ]}
                >
                    {info.item.label}
                </Text>
            </TouchableOpacity>
        );
    }
}

const defaultBorderWidth = 1;

const styles = StyleSheet.create({
    defaultButton: {
        height: 36,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    defaultButtonText: {
        fontSize: 14,
        color: '#444'
    },
    defaultBorder: {
        borderWidth: defaultBorderWidth,
        borderRadius: 1,
        borderColor: '#eee'
    },
    defaultItem: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 36,
        backgroundColor: '#fff',
    },
    defaultItemText: {
        fontSize: 14,
        color: '#444'
    }
});
