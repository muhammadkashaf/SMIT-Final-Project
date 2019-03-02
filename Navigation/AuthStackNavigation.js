import React, { Component } from "react";
import { createSwitchNavigator} from 'react-navigation';
import login from "../Screens/Login/login";
import AppDrawerNavigator from "./DrawerNavigation";


const AuthStackNavigation = createSwitchNavigator({
    login: login,
    Dashboard: AppDrawerNavigator
},
{
    initialRouteName: "login"
}
);


export default AuthStackNavigation;
