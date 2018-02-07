import { Dimensions, StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
    screen: {
        minWidth: Dimensions.get('window').width,
        minHeight: Dimensions.get('window').height,
        backgroundColor: '#fff',
    },
    screenCentered: {
        minWidth: Dimensions.get('window').width,
        minHeight: Dimensions.get('window').height,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    stackHeader: {
        backgroundColor: '#333',
    },
    stackHeaderText: {
        color: '#fff',
        fontSize: 18
    },
    flexRowCentered: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        fontSize: 18
    },
    textInput: {
        fontSize: 18,
        height: 36,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    line: {
        height: 1,
        backgroundColor: '#EEE'
    }
});