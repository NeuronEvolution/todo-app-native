import { StackNavigator } from 'react-navigation';
import { commonStyles, defaultHeaderTintColor } from '../commonStyles';
import LoginScreen from './LoginScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import SignupScreen from './SignupScreen';

export const LoginViewStack = StackNavigator(
    {
        Login: {
            screen: LoginScreen,
            navigationOptions: {
                title: '登录',
                headerTitleStyle: [commonStyles.stackHeaderText],
                headerStyle: [commonStyles.stackHeader]
            }
        },
        Signup: {
            screen: SignupScreen,
            navigationOptions: {
                headerTintColor: defaultHeaderTintColor,
                title: '注册',
                headerTitleStyle: [commonStyles.stackHeaderText],
                headerStyle: [commonStyles.stackHeader],
                swipeEnabled: false
            }
        },
        ResetPassword: {
            screen: ResetPasswordScreen,
            navigationOptions: {
                headerTintColor: defaultHeaderTintColor,
                title: '找回密码',
                headerTitleStyle: [commonStyles.stackHeaderText],
                headerStyle: [commonStyles.stackHeader],
                swipeEnabled: false
            }
        }
    },
    {
        navigationOptions: {}
    });