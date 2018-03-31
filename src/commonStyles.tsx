import { StyleSheet } from 'react-native';

export const defaultHeaderTintColor = '#008888';

export const commonStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    screenCentered: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    stackHeader: {
        backgroundColor: '#333',
    },
    stackHeaderText: {
        color: '#fff',
        fontSize: 16
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
    },
    flexRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 48,
    },
    flexRowCentered: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
    },
    flexRowSpaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 48,
    },
    flexColumnCentered: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: '#008888',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        height: 48,
    },
    windowButton: {
        backgroundColor: '#008888',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        height: 48,
        width: 300
    },
    buttonText: {
        color: '#fff',
        fontSize: 18
    },
    textColor: {
        color: '#444',
    },
    text: {
        color: '#666',
        textAlign: 'center',
        fontSize: 14
    },
    buttonColorText: {
        fontSize: 16,
        color: '#008888'
    },
    textInput: {
        height: 48,
        color: '#555',
        fontSize: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F8F8F8',
    },
    line: {
        height: 1,
        backgroundColor: '#F8F8F8'
    },
    contentWidth: {
        width: 300
    }
});