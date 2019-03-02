import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import AuthLoadingScreen from '../Screens/Auth/AuthLoadingScreen';
import AppDrawerNavigator from './DrawerNavigation';
import login from '../Screens/Login/login';

const SwitchNavigator = createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    login: login,
    App: AppDrawerNavigator
})

const appContainer = createAppContainer(SwitchNavigator);

export default appContainer;