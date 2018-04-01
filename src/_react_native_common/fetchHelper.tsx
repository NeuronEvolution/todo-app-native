import DeviceInfo from 'react-native-device-info';

const userAgent =  'todo_app_v1.0.0' + ' ' + DeviceInfo.getUserAgent();

export const getHeader = (): RequestInit => {
    return {
        headers: {
            'User-Agent': userAgent
        }
    };
};
