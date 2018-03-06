import { StyleSheet } from 'react-native';

export const defaultHeaderTintColor = '#0088FF';

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
        backgroundColor: '#0088FF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius : 8,
        height: 48,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18
    },
    textColor: {
        color: '#444',
    },
    text: {
        color: '#444',
        textAlign: 'center',
        fontSize: 14
    },
    buttonColorText: {
        fontSize: 16,
        color: '#0088FF'
    },
    textInput: {
        height: 48,
        color: '#333',
        fontSize: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    line: {
        height: 1,
        backgroundColor: '#eee'
    }
});