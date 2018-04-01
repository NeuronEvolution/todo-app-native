import DeviceInfo from 'react-native-device-info';

const userAgent = DeviceInfo.getApplicationName() + '_' + DeviceInfo.getBuildNumber()
    + ' ' + DeviceInfo.getUserAgent();

export const getHeader = (): RequestInit => {
    return {
        headers: {
            'User-Agent': userAgent
        }
    };
};
