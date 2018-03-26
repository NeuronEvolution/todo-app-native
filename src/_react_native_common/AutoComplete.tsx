import * as React from 'react';
import {
    findNodeHandle,
    FlatList, ListRenderItemInfo, Modal, StyleProp, StyleSheet, Text, TextInput, TextInputProperties, TextStyle,
    TouchableOpacity, UIManager, View,
} from 'react-native';
import { commonStyles } from '../commonStyles';

export interface Props {
    style: StyleProp<TextStyle>;
    value?: string;
    placeholder?: string;
    items: string[];
    onChangeText?: (text: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

interface State {
    value: string;
    showModal: boolean;
    x: number;
    y: number;
    w: number;
    h: number;
}

export default class AutoComplete extends React.Component<Props, State> {
    private textInputRef: React.Component<TextInputProperties, React.ComponentState> | null = null;

    public componentWillMount() {
        this.setState({
            value: this.props.value ? this.props.value : '',
            showModal: false,
            x: 0,
            y: 0,
            w: 0,
            h: 0
        });

        this.onChangeText = this.onChangeText.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    public render() {
        return this.state.showModal ? this.renderWithModal() : this.renderNormal();
    }

    private renderNormal(): JSX.Element {
        return (
            <TextInput
                underlineColorAndroid={'transparent'}
                ref={(node) => {
                    this.textInputRef = node;
                }}
                style={this.props.style}
                value={this.state.value}
                placeholder={this.props.placeholder}
                onChangeText={this.onChangeText}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
            />
        );
    }

    private renderWithModal(): JSX.Element {
        return (
            <Modal
                onRequestClose={this.closeModal}
                transparent={true}
            >
                <TouchableOpacity style={[{flex: 1}]} onPressIn={this.closeModal}>
                    <TextInput
                        underlineColorAndroid={'transparent'}
                        // autoFocus={true}
                        style={[
                            this.props.style,
                            {
                                top: this.state.y,
                                left: this.state.x,
                                width: this.state.w,
                                height: this.state.h
                            }
                        ]}
                        value={this.state.value}
                        placeholder={this.props.placeholder}
                        onChangeText={this.onChangeText}
                    />
                    {this.renderItems()}
                </TouchableOpacity>
            </Modal>
        );
    }

    private renderItems(): JSX.Element | null {
        if (!this.props.items || this.props.items.length === 0) {
            return null;
        }

        return (
            <FlatList
                keyboardShouldPersistTaps={'always'}
                style={[
                    styles.defaultBorder,
                    {
                        position: 'absolute',
                        top: this.state.y + this.state.h,
                        left: this.state.x,
                    }
                ]}
                data={this.props.items}
                renderItem={this.renderItem}
                keyExtractor={(item: string) =>
                    item}
                ItemSeparatorComponent={() => <View style={[commonStyles.line]}/>}
            />
        );
    }

    private renderItem(info: ListRenderItemInfo<string>): JSX.Element {
        return (
            <TouchableOpacity
                style={[
                    styles.defaultItem,
                    {
                        width: this.state.w - defaultBorderWidth * 2
                    }
                ]}
                onPressIn={() => {
                    this.onSelect(info.item);
                }}
            >
                <Text style={[styles.defaultItemText]}>
                    {info.item}
                </Text>
            </TouchableOpacity>
        );
    }

    private onSelect(text: string) {
        this.setState({value: text});

        if (this.props.onChangeText) {
            this.props.onChangeText(text);
        }

        this.closeModal();
    }

    private onChangeText(text: string) {
        this.setState({value: text});

        if (this.props.onChangeText) {
            this.props.onChangeText(text);
        }
    }

    private openModal() {
        if (this.textInputRef) {
            const node = findNodeHandle(this.textInputRef);
            if (node) {
                UIManager.measureInWindow(node, (x, y, w, h) => {
                    this.setState({x, y, w, h});
                });
            }
        }

        this.setState({showModal: true});
    }

    private closeModal() {
        this.setState({showModal: false});
    }

    private onFocus() {
        this.openModal();

        if (this.props.onFocus) {
            this.props.onFocus();
        }
    }

    private onBlur() {
        if (this.props.onBlur) {
            this.props.onBlur();
        }
    }
}

const defaultBorderWidth = 1;

const styles = StyleSheet.create({
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
