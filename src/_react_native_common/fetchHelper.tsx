import { Platform } from 'react-native';

export const getHeader = (): RequestInit => {
    return {
        headers: {
            'User-Agent':
            'todo_app_v1.0.0'
            + ' ' + Platform.OS + '_' + Platform.Version
        }
    };
};
