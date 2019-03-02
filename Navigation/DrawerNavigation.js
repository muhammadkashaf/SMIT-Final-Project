import React from "react";
import {View, TouchableOpacity} from "react-native";
import {createBottomTabNavigator, createStackNavigator, createDrawerNavigator} from 'react-navigation';
import Dashboard from '../Screens/Dashboard/Dashboard';
import Icon from 'react-native-vector-icons/Ionicons';
import Map from "../Screens/Map/Map";
import Services from "../Screens/Services/Services";
import Category from "../Screens/Category/Category";
import UserProfile from "../Screens/UserProfile/UserProfile";
import Chat from "../Screens/Chat/Chat";
import Offers from "../Screens/Offers/Offers";

const AppTabNavigator = createBottomTabNavigator({
    Service: Services,
    // Offer: Offers,
    Dashboard: Dashboard,
    Map: Map,
    Category: Category,
    Chat: Chat,
    UserProfile: UserProfile,
    Offer:Offers
})

signOut = async () => {
    AsyncStorage.clear();
    this.props.navigation.navigate('Login');
}

const AppStackNavigator = createStackNavigator({
    AppTabNavigator: {
        screen: AppTabNavigator,
        navigationOptions: ({navigation}) => ({
            // title:'App',
            // headerTitleStyle: {
            //     marginLeft: 100,
            //   },
            headerLeft:(
                <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                    <View style={{paddingHorizontal: 10}}> 
                        <Icon name="md-menu" size={24} />
                    </View>
                </TouchableOpacity>
            )
        })
    }
})

const AppDrawerNavigator = createDrawerNavigator({
    Dashboard: AppStackNavigator,
    Chat: createStackNavigator({
        Chat: {
            screen: Chat,
            navigationOptions: ({navigation}) => ({
                headerLeft:(
                    <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                        <View style={{paddingHorizontal: 10}}> 
                            <Icon name="md-menu" size={24} />
                        </View>
                    </TouchableOpacity>
                )
            })
        }
    }),
    Service: Services,

}
);

export default AppDrawerNavigator;