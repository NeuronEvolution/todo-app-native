import { StyleSheet } from 'react-native';

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
        backgroundColor: 'gold',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius : 8,
        height: 48,
    },
    buttonText: {
        color: '#007AFF',
        fontSize: 18
    },
    text: {
        color: '#444',
        textAlign: 'center',
        fontSize: 16
    },
    textInput: {
        fontSize: 16,
        height: 36,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    line: {
        height: 1,
        backgroundColor: '#EEE'
    }
});