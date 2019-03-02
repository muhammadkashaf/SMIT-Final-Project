import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SwitchNavigator from './Navigation/SwitchNavigation';
import ApiKeys from './config/firebase';
import * as firebase from 'firebase';

export default class App extends React.Component {
  constructor(){
    super();
  
    //Firebase
    if(!firebase.apps.length) {firebase.initializeApp(ApiKeys.FirebaseConfig);}
  }


  render() {
    return (      
        <SwitchNavigator />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
