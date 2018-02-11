import { StackNavigator } from 'react-navigation';
import { commonStyles } from '../commonStyles';
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
                title: '注册',
                headerTitleStyle: [commonStyles.stackHeaderText],
                headerStyle: [commonStyles.stackHeader]
            }
        },
        ResetPassword: {
            screen: ResetPasswordScreen,
            navigationOptions: {
                title: '找回密码',
                headerTitleStyle: [commonStyles.stackHeaderText],
                headerStyle: [commonStyles.stackHeader]
            }
        }
    },
    {
        navigationOptions: {}
    });