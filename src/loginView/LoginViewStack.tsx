import { StackNavigator } from 'react-navigation';
import { commonStyles } from '../commonStyles';
import LoginScreen from './LoginScreen';

export const LoginViewStack = StackNavigator(
    {
        Login: {
            screen: LoginScreen,
            navigationOptions: {
                title: '登录',
                headerTitleStyle: [commonStyles.stackHeaderText],
                headerStyle: [commonStyles.stackHeader]
            }
        }
    },
    {
        navigationOptions: {}
    });